/**
 * Embeddable Wizard Routes
 * Provides iframe-embeddable version of the contract wizard for partners
 */
import express from 'express';
import { createLogger } from '../utils/logger.js';
import ApiKey from '../models/ApiKey.js';

const router = express.Router();
const logger = createLogger('Embed');

/**
 * @openapi
 * /embed/wizard:
 *   get:
 *     summary: Get embeddable wizard iframe
 *     description: |
 *       Returns an embeddable version of the contract builder wizard.
 *       Requires Partner or Internal tier API key.
 *       
 *       **Usage:**
 *       ```html
 *       <iframe 
 *         src="https://api.heir.es/api/embed/wizard?key=heir_pt_xxx&theme=dark"
 *         width="100%" 
 *         height="800"
 *         frameborder="0"
 *       ></iframe>
 *       ```
 *     tags: [Embed]
 *     parameters:
 *       - name: key
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Partner or Internal tier API key
 *       - name: theme
 *         in: query
 *         schema:
 *           type: string
 *           enum: [light, dark, auto]
 *           default: dark
 *       - name: steps
 *         in: query
 *         schema:
 *           type: string
 *         description: Comma-separated list of steps to include (e.g., "blockchain,beneficiaries,review")
 *       - name: blockchain
 *         in: query
 *         schema:
 *           type: string
 *           enum: [evm, solana, ton]
 *         description: Pre-select blockchain (skip selection step)
 *       - name: template
 *         in: query
 *         schema:
 *           type: string
 *         description: Pre-select inheritance template
 *       - name: callback
 *         in: query
 *         schema:
 *           type: string
 *           format: uri
 *         description: URL to POST results to upon completion
 *       - name: logo
 *         in: query
 *         schema:
 *           type: string
 *           format: uri
 *         description: Custom logo URL (partner branding)
 *       - name: primaryColor
 *         in: query
 *         schema:
 *           type: string
 *         description: Primary brand color (hex without #)
 *     responses:
 *       200:
 *         description: HTML page with embedded wizard
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *       401:
 *         description: Invalid or missing API key
 *       403:
 *         description: API key tier does not support embedding
 */
router.get('/wizard', async (req, res) => {
  const { 
    key, 
    theme = 'dark',
    steps,
    blockchain,
    template,
    callback,
    logo,
    primaryColor,
    hideHeader,
    hideFooter
  } = req.query;
  
  // Validate API key
  if (!key) {
    return res.status(401).send(getErrorHTML('API key required', 'Provide a valid API key via the "key" query parameter.'));
  }
  
  try {
    const apiKey = await ApiKey.verifyKey(key);
    
    if (!apiKey) {
      return res.status(401).send(getErrorHTML('Invalid API key', 'The provided API key is invalid or expired.'));
    }
    
    // Check tier - only partner and internal can embed
    if (apiKey.tier === 'public') {
      return res.status(403).send(getErrorHTML(
        'Upgrade Required', 
        'Embedding requires a Partner or Internal tier API key. <a href="https://heir.es/pricing" target="_blank">Upgrade your plan</a>'
      ));
    }
    
    // Check scope
    if (!apiKey.hasScope('contracts') && !apiKey.hasScope('all')) {
      return res.status(403).send(getErrorHTML(
        'Insufficient Scope', 
        'Your API key requires the "contracts" scope to use the wizard.'
      ));
    }
    
    // Track usage
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    await apiKey.trackUsage(clientIp);
    
    // Get allowed origin from API key metadata or referrer
    const allowedOrigin = apiKey.metadata?.embedOrigins?.[0] || req.headers.referer?.split('/').slice(0, 3).join('/') || '*';
    
    // Set frame options to allow embedding
    res.setHeader('X-Frame-Options', `ALLOW-FROM ${allowedOrigin}`);
    res.setHeader('Content-Security-Policy', `frame-ancestors ${allowedOrigin}`);
    
    // Build config object for the wizard
    const config = {
      apiKey: key,
      apiUrl: process.env.API_URL || 'https://api.heir.es',
      theme,
      steps: steps ? steps.split(',') : null,
      preselect: {
        blockchain,
        template
      },
      callback,
      branding: {
        logo,
        primaryColor: primaryColor ? `#${primaryColor}` : null,
        hideHeader: hideHeader === 'true',
        hideFooter: hideFooter === 'true',
        partnerName: apiKey.owner?.profile?.company || null
      },
      tier: apiKey.tier
    };
    
    logger.info('Embed wizard loaded', { 
      keyPrefix: apiKey.keyPrefix, 
      tier: apiKey.tier,
      origin: allowedOrigin 
    });
    
    res.send(getWizardHTML(config));
    
  } catch (error) {
    logger.error('Embed wizard error', { error: error.message });
    res.status(500).send(getErrorHTML('Server Error', 'An error occurred loading the wizard.'));
  }
});

/**
 * POST /embed/callback
 * Proxy callback results to partner's callback URL
 */
router.post('/callback', express.json(), async (req, res) => {
  const { callbackUrl, data, apiKey: key } = req.body;
  
  if (!callbackUrl || !data || !key) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields' 
    });
  }
  
  try {
    // Verify API key
    const apiKey = await ApiKey.verifyKey(key);
    if (!apiKey || apiKey.tier === 'public') {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid API key or insufficient tier' 
      });
    }
    
    // Forward to callback URL
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-HEIR-Signature': signCallback(data, apiKey.metadata?.webhookSecret)
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(10000)
    });
    
    res.json({ 
      success: response.ok, 
      statusCode: response.status 
    });
    
  } catch (error) {
    logger.error('Callback proxy error', { error: error.message });
    res.status(500).json({ 
      success: false, 
      error: 'Failed to deliver callback' 
    });
  }
});

/**
 * GET /embed/sdk.js
 * JavaScript SDK for easier iframe integration
 */
router.get('/sdk.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(getSDKScript());
});

// ============================================
// HTML/JS Templates
// ============================================

function getErrorHTML(title, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - HEIR Wizard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
      color: #e4e4e7;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .error-card {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 1rem;
      padding: 2rem;
      max-width: 400px;
      text-align: center;
    }
    .error-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto 1rem;
      background: rgba(239, 68, 68, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #f87171; }
    p { color: #a1a1aa; line-height: 1.6; }
    a { color: #6366f1; }
  </style>
</head>
<body>
  <div class="error-card">
    <div class="error-icon">⚠️</div>
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>
  `;
}

function getWizardHTML(config) {
  const primaryColor = config.branding.primaryColor || '#6366f1';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contract Builder - HEIR</title>
  <style>
    :root {
      --primary: ${primaryColor};
      --primary-hover: ${primaryColor}dd;
      --bg-primary: ${config.theme === 'light' ? '#ffffff' : '#0f0f23'};
      --bg-secondary: ${config.theme === 'light' ? '#f4f4f5' : '#1a1a2e'};
      --text-primary: ${config.theme === 'light' ? '#18181b' : '#e4e4e7'};
      --text-secondary: ${config.theme === 'light' ? '#71717a' : '#a1a1aa'};
      --border: ${config.theme === 'light' ? '#e4e4e7' : 'rgba(99, 102, 241, 0.2)'};
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
    }
    
    .wizard-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    
    .wizard-header {
      display: ${config.branding.hideHeader ? 'none' : 'flex'};
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 2rem;
    }
    
    .wizard-logo {
      height: 32px;
    }
    
    .wizard-title {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .step-indicator {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    
    .step-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border);
      transition: all 0.3s;
    }
    
    .step-dot.active {
      background: var(--primary);
      transform: scale(1.2);
    }
    
    .step-dot.completed {
      background: #22c55e;
    }
    
    .wizard-step {
      display: none;
      animation: fadeIn 0.3s ease;
    }
    
    .wizard-step.active {
      display: block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .step-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .step-description {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      color: var(--text-primary);
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
    }
    
    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
    
    .option-card {
      background: var(--bg-secondary);
      border: 2px solid var(--border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .option-card:hover {
      border-color: var(--primary);
    }
    
    .option-card.selected {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
    }
    
    .option-card h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .option-card p {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .beneficiary-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .beneficiary-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
      display: grid;
      grid-template-columns: 1fr 1fr auto auto;
      gap: 1rem;
      align-items: end;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
      font-size: 1rem;
    }
    
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    
    .btn-primary:hover {
      background: var(--primary-hover);
    }
    
    .btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-primary);
      border: 1px solid var(--border);
    }
    
    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    
    .wizard-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    
    .code-preview {
      background: #0f0f23;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      padding: 1rem;
      font-family: 'Fira Code', monospace;
      font-size: 0.75rem;
      overflow-x: auto;
      max-height: 300px;
      color: #e4e4e7;
    }
    
    .result-card {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }
    
    .result-card.error {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
    }
    
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .wizard-footer {
      display: ${config.branding.hideFooter ? 'none' : 'flex'};
      justify-content: center;
      padding: 1rem;
      margin-top: 2rem;
      border-top: 1px solid var(--border);
      color: var(--text-secondary);
      font-size: 0.875rem;
    }
    
    .wizard-footer a {
      color: var(--primary);
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wizard-container">
    <header class="wizard-header">
      ${config.branding.logo 
        ? `<img src="${config.branding.logo}" alt="Logo" class="wizard-logo">`
        : `<span class="wizard-title">Contract Builder</span>`
      }
      <span style="color: var(--text-secondary); font-size: 0.875rem;">Powered by HEIR</span>
    </header>
    
    <div class="step-indicator" id="stepIndicator"></div>
    
    <div id="wizardSteps">
      <!-- Steps will be rendered by JavaScript -->
    </div>
    
    <footer class="wizard-footer">
      Secured by <a href="https://heir.es" target="_blank">HEIR Protocol</a>
    </footer>
  </div>
  
  <script>
    // Wizard configuration from server
    const CONFIG = ${JSON.stringify(config)};
    
    // Wizard state
    const state = {
      currentStep: 0,
      data: {
        blockchain: CONFIG.preselect?.blockchain || null,
        template: CONFIG.preselect?.template || null,
        ownerAddress: '',
        beneficiaries: [{ name: '', address: '', percentage: 100 }],
        deadMansSwitch: { enabled: false, intervalDays: 365 }
      },
      result: null
    };
    
    // Available steps
    const allSteps = [
      { id: 'blockchain', title: 'Select Blockchain', required: !CONFIG.preselect?.blockchain },
      { id: 'template', title: 'Inheritance Template', required: !CONFIG.preselect?.template },
      { id: 'owner', title: 'Owner Details', required: true },
      { id: 'beneficiaries', title: 'Add Beneficiaries', required: true },
      { id: 'deadman', title: 'Dead Man\\'s Switch', required: false },
      { id: 'review', title: 'Review & Generate', required: true },
      { id: 'result', title: 'Complete', required: true }
    ];
    
    // Filter steps based on config
    const steps = CONFIG.steps 
      ? allSteps.filter(s => CONFIG.steps.includes(s.id) || s.id === 'result')
      : allSteps.filter(s => s.required || s.id === 'deadman');
    
    // Render step indicator
    function renderStepIndicator() {
      const container = document.getElementById('stepIndicator');
      container.innerHTML = steps.slice(0, -1).map((step, i) => 
        \`<div class="step-dot \${i < state.currentStep ? 'completed' : ''} \${i === state.currentStep ? 'active' : ''}" title="\${step.title}"></div>\`
      ).join('');
    }
    
    // Render current step
    function renderStep() {
      const container = document.getElementById('wizardSteps');
      const step = steps[state.currentStep];
      
      let html = '';
      
      switch(step.id) {
        case 'blockchain':
          html = \`
            <div class="wizard-step active">
              <h2 class="step-title">Select Blockchain</h2>
              <p class="step-description">Choose the blockchain network for your inheritance contract.</p>
              <div class="option-grid">
                <div class="option-card \${state.data.blockchain === 'evm' ? 'selected' : ''}" onclick="selectBlockchain('evm')">
                  <h3>⟠ Ethereum / EVM</h3>
                  <p>Ethereum, Polygon, Base, and other EVM chains</p>
                </div>
                <div class="option-card \${state.data.blockchain === 'solana' ? 'selected' : ''}" onclick="selectBlockchain('solana')">
                  <h3>◎ Solana</h3>
                  <p>High-speed, low-cost transactions</p>
                </div>
                <div class="option-card \${state.data.blockchain === 'ton' ? 'selected' : ''}" onclick="selectBlockchain('ton')">
                  <h3>💎 TON</h3>
                  <p>Telegram Open Network</p>
                </div>
              </div>
              <div class="wizard-actions">
                <div></div>
                <button class="btn btn-primary" onclick="nextStep()" \${!state.data.blockchain ? 'disabled' : ''}>Continue →</button>
              </div>
            </div>
          \`;
          break;
          
        case 'template':
          html = \`
            <div class="wizard-step active">
              <h2 class="step-title">Inheritance Template</h2>
              <p class="step-description">Select a legal framework for asset distribution.</p>
              <div class="option-grid">
                <div class="option-card \${state.data.template === 'common-law' ? 'selected' : ''}" onclick="selectTemplate('common-law')">
                  <h3>⚖️ Common Law</h3>
                  <p>Freedom of testation</p>
                </div>
                <div class="option-card \${state.data.template === 'civil-law' ? 'selected' : ''}" onclick="selectTemplate('civil-law')">
                  <h3>📜 Civil Law</h3>
                  <p>Forced heirship rules</p>
                </div>
                <div class="option-card \${state.data.template === 'islamic-mirth' ? 'selected' : ''}" onclick="selectTemplate('islamic-mirth')">
                  <h3>☪️ Islamic Law</h3>
                  <p>Quranic distribution rules</p>
                </div>
                <div class="option-card \${state.data.template === 'custom' ? 'selected' : ''}" onclick="selectTemplate('custom')">
                  <h3>⚙️ Custom</h3>
                  <p>Define your own rules</p>
                </div>
              </div>
              <div class="wizard-actions">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()" \${!state.data.template ? 'disabled' : ''}>Continue →</button>
              </div>
            </div>
          \`;
          break;
          
        case 'owner':
          html = \`
            <div class="wizard-step active">
              <h2 class="step-title">Owner Details</h2>
              <p class="step-description">Enter the wallet address that will own the inheritance contract.</p>
              <div class="form-group">
                <label class="form-label">Owner Wallet Address</label>
                <input type="text" class="form-control" placeholder="0x..." value="\${state.data.ownerAddress}" oninput="state.data.ownerAddress = this.value">
              </div>
              <div class="wizard-actions">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()" \${!state.data.ownerAddress ? 'disabled' : ''}>Continue →</button>
              </div>
            </div>
          \`;
          break;
          
        case 'beneficiaries':
          html = \`
            <div class="wizard-step active">
              <h2 class="step-title">Add Beneficiaries</h2>
              <p class="step-description">Define who will inherit and their share percentages.</p>
              <div class="beneficiary-list" id="beneficiaryList"></div>
              <button class="btn btn-secondary btn-sm" onclick="addBeneficiary()" style="margin-top: 1rem;">+ Add Beneficiary</button>
              <div class="wizard-actions">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Continue →</button>
              </div>
            </div>
          \`;
          break;
          
        case 'deadman':
          html = \`
            <div class="wizard-step active">
              <h2 class="step-title">Dead Man's Switch</h2>
              <p class="step-description">Automatically trigger inheritance if you don't check in.</p>
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" \${state.data.deadMansSwitch.enabled ? 'checked' : ''} onchange="state.data.deadMansSwitch.enabled = this.checked; renderStep();">
                  Enable Dead Man's Switch
                </label>
              </div>
              \${state.data.deadMansSwitch.enabled ? \`
                <div class="form-group">
                  <label class="form-label">Check-in Interval (days)</label>
                  <input type="number" class="form-control" value="\${state.data.deadMansSwitch.intervalDays}" min="30" max="730" oninput="state.data.deadMansSwitch.intervalDays = parseInt(this.value)">
                </div>
              \` : ''}
              <div class="wizard-actions">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="nextStep()">Continue →</button>
              </div>
            </div>
          \`;
          break;
          
        case 'review':
          html = \`
            <div class="wizard-step active">
              <h2 class="step-title">Review & Generate</h2>
              <p class="step-description">Review your configuration and generate the smart contract.</p>
              <div style="background: var(--bg-secondary); border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                <p><strong>Blockchain:</strong> \${state.data.blockchain?.toUpperCase()}</p>
                <p><strong>Template:</strong> \${state.data.template}</p>
                <p><strong>Owner:</strong> \${state.data.ownerAddress}</p>
                <p><strong>Beneficiaries:</strong> \${state.data.beneficiaries.length}</p>
                <p><strong>Dead Man's Switch:</strong> \${state.data.deadMansSwitch.enabled ? state.data.deadMansSwitch.intervalDays + ' days' : 'Disabled'}</p>
              </div>
              <div class="wizard-actions">
                <button class="btn btn-secondary" onclick="prevStep()">← Back</button>
                <button class="btn btn-primary" onclick="generateContract()" id="generateBtn">Generate Contract</button>
              </div>
            </div>
          \`;
          break;
          
        case 'result':
          if (state.result?.error) {
            html = \`
              <div class="wizard-step active">
                <div class="result-card error">
                  <h2 style="color: #f87171; margin-bottom: 1rem;">Generation Failed</h2>
                  <p>\${state.result.error}</p>
                </div>
                <div class="wizard-actions">
                  <button class="btn btn-secondary" onclick="prevStep()">← Try Again</button>
                </div>
              </div>
            \`;
          } else {
            html = \`
              <div class="wizard-step active">
                <div class="result-card">
                  <h2 style="color: #4ade80; margin-bottom: 1rem;">✓ Contract Generated!</h2>
                  <p style="margin-bottom: 1rem;">Your smart contract has been successfully generated.</p>
                </div>
                <div style="margin-top: 1.5rem;">
                  <h3 style="margin-bottom: 0.5rem;">Generated Contract</h3>
                  <pre class="code-preview">\${escapeHtml(state.result.contractCode?.slice(0, 2000) || '')}...</pre>
                </div>
                <div class="wizard-actions">
                  <button class="btn btn-secondary" onclick="downloadContract()">Download Code</button>
                  <button class="btn btn-primary" onclick="postResult()">Complete</button>
                </div>
              </div>
            \`;
          }
          break;
      }
      
      container.innerHTML = html;
      renderStepIndicator();
      
      // Render beneficiaries if on that step
      if (step.id === 'beneficiaries') {
        renderBeneficiaries();
      }
    }
    
    function renderBeneficiaries() {
      const container = document.getElementById('beneficiaryList');
      if (!container) return;
      
      container.innerHTML = state.data.beneficiaries.map((b, i) => \`
        <div class="beneficiary-card">
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" value="\${b.name}" oninput="updateBeneficiary(\${i}, 'name', this.value)">
          </div>
          <div class="form-group" style="margin: 0;">
            <label class="form-label">Wallet Address</label>
            <input type="text" class="form-control" value="\${b.address}" oninput="updateBeneficiary(\${i}, 'address', this.value)">
          </div>
          <div class="form-group" style="margin: 0; width: 100px;">
            <label class="form-label">%</label>
            <input type="number" class="form-control" value="\${b.percentage}" min="0" max="100" oninput="updateBeneficiary(\${i}, 'percentage', parseInt(this.value))">
          </div>
          <button class="btn btn-secondary btn-sm" onclick="removeBeneficiary(\${i})" \${state.data.beneficiaries.length === 1 ? 'disabled' : ''}>×</button>
        </div>
      \`).join('');
    }
    
    // Navigation
    function nextStep() {
      if (state.currentStep < steps.length - 1) {
        state.currentStep++;
        renderStep();
      }
    }
    
    function prevStep() {
      if (state.currentStep > 0) {
        state.currentStep--;
        renderStep();
      }
    }
    
    // Data handlers
    function selectBlockchain(value) {
      state.data.blockchain = value;
      renderStep();
    }
    
    function selectTemplate(value) {
      state.data.template = value;
      renderStep();
    }
    
    function addBeneficiary() {
      state.data.beneficiaries.push({ name: '', address: '', percentage: 0 });
      renderBeneficiaries();
    }
    
    function removeBeneficiary(index) {
      state.data.beneficiaries.splice(index, 1);
      renderBeneficiaries();
    }
    
    function updateBeneficiary(index, field, value) {
      state.data.beneficiaries[index][field] = value;
    }
    
    // Generate contract
    async function generateContract() {
      const btn = document.getElementById('generateBtn');
      btn.innerHTML = '<span class="spinner"></span> Generating...';
      btn.disabled = true;
      
      try {
        const response = await fetch(CONFIG.apiUrl + '/api/v1/contracts/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + CONFIG.apiKey
          },
          body: JSON.stringify({
            blockchain: state.data.blockchain,
            ownerAddress: state.data.ownerAddress,
            beneficiaries: state.data.beneficiaries,
            inheritanceTemplate: state.data.template,
            deadMansSwitch: state.data.deadMansSwitch
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          state.result = result;
        } else {
          state.result = { error: result.error?.message || 'Generation failed' };
        }
        
        state.currentStep++;
        renderStep();
        
      } catch (error) {
        state.result = { error: error.message };
        state.currentStep++;
        renderStep();
      }
    }
    
    function downloadContract() {
      const blob = new Blob([state.result.contractCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'InheritanceVault.sol';
      a.click();
      URL.revokeObjectURL(url);
    }
    
    function postResult() {
      // Notify parent window
      window.parent.postMessage({
        type: 'heir:wizard:complete',
        data: {
          config: state.data,
          result: state.result
        }
      }, '*');
      
      // If callback URL provided, send results
      if (CONFIG.callback) {
        fetch(CONFIG.apiUrl + '/api/embed/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callbackUrl: CONFIG.callback,
            data: { config: state.data, result: state.result },
            apiKey: CONFIG.apiKey
          })
        });
      }
    }
    
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Listen for messages from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'heir:wizard:setData') {
        Object.assign(state.data, event.data.data);
        renderStep();
      }
    });
    
    // Initialize
    renderStep();
    
    // Notify parent that wizard is ready
    window.parent.postMessage({ type: 'heir:wizard:ready' }, '*');
  </script>
</body>
</html>
  `;
}

function getSDKScript() {
  return `
/**
 * HEIR Embed SDK
 * Easily embed the HEIR contract wizard in your application
 */
(function(window) {
  'use strict';
  
  const HEIR_API_URL = 'https://api.heir.es';
  
  class HeirWizard {
    constructor(options = {}) {
      this.apiKey = options.apiKey;
      this.container = options.container;
      this.theme = options.theme || 'dark';
      this.onComplete = options.onComplete || (() => {});
      this.onError = options.onError || (() => {});
      this.onReady = options.onReady || (() => {});
      this.iframe = null;
      
      if (!this.apiKey) {
        throw new Error('HEIR: API key is required');
      }
      
      this._init();
    }
    
    _init() {
      // Build iframe URL
      const params = new URLSearchParams({
        key: this.apiKey,
        theme: this.theme
      });
      
      // Create iframe
      this.iframe = document.createElement('iframe');
      this.iframe.src = HEIR_API_URL + '/api/embed/wizard?' + params.toString();
      this.iframe.style.cssText = 'width: 100%; height: 800px; border: none;';
      this.iframe.setAttribute('allow', 'clipboard-write');
      
      // Get container
      const containerEl = typeof this.container === 'string' 
        ? document.querySelector(this.container)
        : this.container;
        
      if (!containerEl) {
        throw new Error('HEIR: Container element not found');
      }
      
      containerEl.appendChild(this.iframe);
      
      // Listen for messages
      window.addEventListener('message', this._handleMessage.bind(this));
    }
    
    _handleMessage(event) {
      if (!event.data || !event.data.type) return;
      
      switch (event.data.type) {
        case 'heir:wizard:ready':
          this.onReady();
          break;
        case 'heir:wizard:complete':
          this.onComplete(event.data.data);
          break;
        case 'heir:wizard:error':
          this.onError(event.data.error);
          break;
      }
    }
    
    // Set wizard data from parent
    setData(data) {
      if (this.iframe && this.iframe.contentWindow) {
        this.iframe.contentWindow.postMessage({
          type: 'heir:wizard:setData',
          data: data
        }, '*');
      }
    }
    
    // Destroy the wizard
    destroy() {
      if (this.iframe) {
        this.iframe.remove();
        this.iframe = null;
      }
      window.removeEventListener('message', this._handleMessage);
    }
  }
  
  // Export
  window.HeirWizard = HeirWizard;
  
})(window);
  `;
}

function signCallback(data, secret) {
  if (!secret) return '';
  const crypto = require('crypto');
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = timestamp + '.' + JSON.stringify(data);
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

export default router;

