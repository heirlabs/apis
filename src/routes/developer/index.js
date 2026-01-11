/**
 * Developer Portal Routes
 * Provides a UI for API key management, usage analytics, and documentation
 */
import express from 'express';
import { verifyAuth } from '../../middleware/auth.js';
import ApiKey from '../../models/ApiKey.js';
import Webhook from '../../models/Webhook.js';
import { createLogger } from '../../utils/logger.js';

const router = express.Router();
const logger = createLogger('DeveloperPortal');

/**
 * GET /api/developer
 * Developer Portal Dashboard
 */
router.get('/', verifyAuth, async (req, res) => {
  const apiKeys = await ApiKey.countDocuments({ owner: req.user._id, status: 'active' });
  const webhooks = await Webhook.countDocuments({ owner: req.user._id, status: 'active' });
  
  res.send(getDashboardHTML(req.user, { apiKeys, webhooks }));
});

/**
 * GET /api/developer/keys
 * API Keys Management Page
 */
router.get('/keys', verifyAuth, async (req, res) => {
  const keys = await ApiKey.find({ 
    owner: req.user._id,
    status: { $ne: 'revoked' }
  }).select('-keyHash').sort({ createdAt: -1 });
  
  res.send(getKeysPageHTML(req.user, keys));
});

/**
 * GET /api/developer/webhooks
 * Webhooks Management Page
 */
router.get('/webhooks', verifyAuth, async (req, res) => {
  const webhooks = await Webhook.find({ 
    owner: req.user._id,
    status: { $ne: 'disabled' }
  }).select('-secret').sort({ createdAt: -1 });
  
  res.send(getWebhooksPageHTML(req.user, webhooks));
});

/**
 * GET /api/developer/usage
 * Usage Analytics Page
 */
router.get('/usage', verifyAuth, async (req, res) => {
  const keys = await ApiKey.find({ 
    owner: req.user._id,
    status: 'active'
  }).select('keyPrefix name usage tier lastUsedAt');
  
  // Calculate total usage
  const totalUsage = keys.reduce((sum, key) => sum + key.usage.total, 0);
  
  res.send(getUsagePageHTML(req.user, keys, totalUsage));
});

// ============================================
// HTML Templates
// ============================================

function getBaseStyles() {
  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%);
        color: #e4e4e7;
        min-height: 100vh;
      }
      .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: rgba(26, 26, 46, 0.8);
        border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      }
      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .nav { display: flex; gap: 1.5rem; }
      .nav a {
        color: #a1a1aa;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.2s;
      }
      .nav a:hover, .nav a.active {
        color: #fff;
        background: rgba(99, 102, 241, 0.2);
      }
      .card {
        background: rgba(26, 26, 46, 0.6);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 1rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .card-title { font-size: 1.25rem; font-weight: 600; }
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        border: none;
        transition: all 0.2s;
      }
      .btn-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
      }
      .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
      .btn-secondary {
        background: rgba(99, 102, 241, 0.2);
        color: #e4e4e7;
      }
      .btn-danger { background: rgba(239, 68, 68, 0.2); color: #f87171; }
      .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
      .stat-card {
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 0.75rem;
        padding: 1.25rem;
      }
      .stat-value { font-size: 2rem; font-weight: 700; color: #fff; }
      .stat-label { color: #a1a1aa; font-size: 0.875rem; }
      .table { width: 100%; border-collapse: collapse; }
      .table th, .table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid rgba(99, 102, 241, 0.1);
      }
      .table th { color: #a1a1aa; font-weight: 500; font-size: 0.875rem; }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
      }
      .badge-green { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
      .badge-yellow { background: rgba(234, 179, 8, 0.2); color: #fbbf24; }
      .badge-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
      .badge-purple { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
      .code-block {
        background: #0f0f23;
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 0.5rem;
        padding: 1rem;
        font-family: 'Fira Code', monospace;
        font-size: 0.875rem;
        overflow-x: auto;
      }
      .alert {
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }
      .alert-warning {
        background: rgba(234, 179, 8, 0.1);
        border: 1px solid rgba(234, 179, 8, 0.3);
        color: #fbbf24;
      }
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        align-items: center;
        justify-content: center;
      }
      .modal.active { display: flex; }
      .modal-content {
        background: #1a1a2e;
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 1rem;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
      }
      .form-group { margin-bottom: 1rem; }
      .form-group label { display: block; margin-bottom: 0.5rem; color: #a1a1aa; }
      .form-control {
        width: 100%;
        padding: 0.75rem 1rem;
        background: rgba(15, 15, 35, 0.8);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 0.5rem;
        color: #e4e4e7;
        font-size: 1rem;
      }
      .form-control:focus { outline: none; border-color: #6366f1; }
    </style>
  `;
}

function getNavHTML(active) {
  return `
    <header class="header">
      <div class="logo">HEIR Developer Portal</div>
      <nav class="nav">
        <a href="/api/developer" class="${active === 'dashboard' ? 'active' : ''}">Dashboard</a>
        <a href="/api/developer/keys" class="${active === 'keys' ? 'active' : ''}">API Keys</a>
        <a href="/api/developer/webhooks" class="${active === 'webhooks' ? 'active' : ''}">Webhooks</a>
        <a href="/api/developer/usage" class="${active === 'usage' ? 'active' : ''}">Usage</a>
        <a href="/api/docs" target="_blank">API Docs</a>
      </nav>
    </header>
  `;
}

function getDashboardHTML(user, stats) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Developer Portal - HEIR</title>
      ${getBaseStyles()}
    </head>
    <body>
      ${getNavHTML('dashboard')}
      <div class="container">
        <h1 style="margin-bottom: 2rem;">Welcome, ${user.profile?.firstName || user.email}</h1>
        
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.apiKeys}</div>
            <div class="stat-label">Active API Keys</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.webhooks}</div>
            <div class="stat-label">Active Webhooks</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${user.subscription?.plan || 'Free'}</div>
            <div class="stat-label">Current Plan</div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Quick Start</h2>
          </div>
          <p style="color: #a1a1aa; margin-bottom: 1rem;">
            Use API keys to authenticate your requests to the HEIR API.
          </p>
          <div class="code-block">
curl -X POST https://api.heir.es/api/v1/contracts/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"blockchain": "evm", "ownerAddress": "0x...", "beneficiaries": [...]}'
          </div>
          <div style="margin-top: 1rem;">
            <a href="/api/developer/keys" class="btn btn-primary">Create API Key</a>
            <a href="/api/docs" class="btn btn-secondary" target="_blank">View Documentation</a>
          </div>
        </div>
        
        <div class="card">
          <h2 class="card-title">API Endpoints</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Description</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>/api/v1/contracts/generate</code></td>
                <td>Generate smart contracts</td>
                <td><span class="badge badge-green">Public</span></td>
              </tr>
              <tr>
                <td><code>/api/v1/contracts/compile</code></td>
                <td>Compile Solidity code</td>
                <td><span class="badge badge-green">Public</span></td>
              </tr>
              <tr>
                <td><code>/api/v1/legal/will</code></td>
                <td>Generate legal documents</td>
                <td><span class="badge badge-blue">Partner</span></td>
              </tr>
              <tr>
                <td><code>/api/v1/webhooks</code></td>
                <td>Webhook subscriptions</td>
                <td><span class="badge badge-blue">Partner</span></td>
              </tr>
              <tr>
                <td><code>/api/v1/actuarial</code></td>
                <td>Actuarial AI analysis</td>
                <td><span class="badge badge-purple">Internal</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getKeysPageHTML(user, keys) {
  const keysRows = keys.map(key => `
    <tr>
      <td><code>${key.keyPrefix}</code></td>
      <td>${key.name}</td>
      <td><span class="badge badge-${key.tier === 'internal' ? 'purple' : key.tier === 'partner' ? 'blue' : 'green'}">${key.tier}</span></td>
      <td><span class="badge badge-${key.status === 'active' ? 'green' : 'yellow'}">${key.status}</span></td>
      <td>${key.usage?.total || 0}</td>
      <td>${key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="viewKey('${key._id}')">View</button>
        <button class="btn btn-danger btn-sm" onclick="revokeKey('${key._id}')">Revoke</button>
      </td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Keys - HEIR Developer Portal</title>
      ${getBaseStyles()}
    </head>
    <body>
      ${getNavHTML('keys')}
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">API Keys</h2>
            <button class="btn btn-primary" onclick="openCreateModal()">Create New Key</button>
          </div>
          
          <div class="alert alert-warning">
            <strong>Important:</strong> API keys are shown only once upon creation. Store them securely.
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Key Prefix</th>
                <th>Name</th>
                <th>Tier</th>
                <th>Status</th>
                <th>Total Requests</th>
                <th>Last Used</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${keysRows || '<tr><td colspan="7" style="text-align: center; color: #a1a1aa;">No API keys yet</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Create Key Modal -->
      <div class="modal" id="createModal">
        <div class="modal-content">
          <h2 style="margin-bottom: 1.5rem;">Create API Key</h2>
          <form id="createKeyForm">
            <div class="form-group">
              <label>Name</label>
              <input type="text" class="form-control" name="name" placeholder="e.g., Production Key" required>
            </div>
            <div class="form-group">
              <label>Scopes</label>
              <select class="form-control" name="scopes" multiple>
                <option value="contracts:read" selected>Contracts (Read)</option>
                <option value="contracts">Contracts (Full)</option>
                <option value="vaults:read">Vaults (Read)</option>
                <option value="legal:read">Legal (Read)</option>
                <option value="webhooks">Webhooks</option>
              </select>
            </div>
            <div class="form-group">
              <label>Expires In (days, empty = never)</label>
              <input type="number" class="form-control" name="expiresIn" placeholder="365">
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-primary">Create Key</button>
              <button type="button" class="btn btn-secondary" onclick="closeCreateModal()">Cancel</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Key Created Modal -->
      <div class="modal" id="keyCreatedModal">
        <div class="modal-content">
          <h2 style="margin-bottom: 1rem; color: #4ade80;">API Key Created</h2>
          <p style="color: #a1a1aa; margin-bottom: 1rem;">
            Copy this key now. It will not be shown again.
          </p>
          <div class="code-block" id="newKeyDisplay" style="word-break: break-all;"></div>
          <div style="margin-top: 1.5rem;">
            <button class="btn btn-primary" onclick="copyKey()">Copy to Clipboard</button>
            <button class="btn btn-secondary" onclick="closeKeyCreatedModal()">Done</button>
          </div>
        </div>
      </div>
      
      <script>
        function openCreateModal() {
          document.getElementById('createModal').classList.add('active');
        }
        
        function closeCreateModal() {
          document.getElementById('createModal').classList.remove('active');
        }
        
        function closeKeyCreatedModal() {
          document.getElementById('keyCreatedModal').classList.remove('active');
          location.reload();
        }
        
        function copyKey() {
          const key = document.getElementById('newKeyDisplay').textContent;
          navigator.clipboard.writeText(key);
          alert('API key copied to clipboard');
        }
        
        async function revokeKey(id) {
          if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) return;
          
          try {
            const response = await fetch('/api/v1/api-keys/' + id, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
              location.reload();
            } else {
              alert('Failed to revoke key');
            }
          } catch (e) {
            alert('Error: ' + e.message);
          }
        }
        
        document.getElementById('createKeyForm').addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const scopes = Array.from(formData.getAll('scopes'));
          
          try {
            const response = await fetch('/api/v1/api-keys', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: formData.get('name'),
                scopes: scopes,
                expiresIn: formData.get('expiresIn') ? parseInt(formData.get('expiresIn')) : null
              })
            });
            
            const result = await response.json();
            
            if (result.success) {
              document.getElementById('newKeyDisplay').textContent = result.data.key;
              closeCreateModal();
              document.getElementById('keyCreatedModal').classList.add('active');
            } else {
              alert('Error: ' + result.error.message);
            }
          } catch (e) {
            alert('Error: ' + e.message);
          }
        });
      </script>
    </body>
    </html>
  `;
}

function getWebhooksPageHTML(user, webhooks) {
  const webhookRows = webhooks.map(wh => `
    <tr>
      <td>${wh.name || 'Unnamed'}</td>
      <td><code style="font-size: 0.75rem;">${wh.url}</code></td>
      <td>${wh.events.slice(0, 3).join(', ')}${wh.events.length > 3 ? '...' : ''}</td>
      <td><span class="badge badge-${wh.status === 'active' ? 'green' : 'yellow'}">${wh.status}</span></td>
      <td>${wh.stats?.totalDeliveries || 0}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="testWebhook('${wh._id}')">Test</button>
        <button class="btn btn-danger btn-sm" onclick="deleteWebhook('${wh._id}')">Delete</button>
      </td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Webhooks - HEIR Developer Portal</title>
      ${getBaseStyles()}
    </head>
    <body>
      ${getNavHTML('webhooks')}
      <div class="container">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Webhook Subscriptions</h2>
            <button class="btn btn-primary" onclick="openCreateWebhookModal()">Create Webhook</button>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Events</th>
                <th>Status</th>
                <th>Deliveries</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${webhookRows || '<tr><td colspan="6" style="text-align: center; color: #a1a1aa;">No webhooks yet</td></tr>'}
            </tbody>
          </table>
        </div>
        
        <div class="card">
          <h2 class="card-title">Webhook Security</h2>
          <p style="color: #a1a1aa; margin-bottom: 1rem;">
            All webhook payloads are signed using HMAC-SHA256. Verify signatures using your webhook secret:
          </p>
          <div class="code-block">
const signature = headers['x-webhook-signature'];
const timestamp = headers['x-webhook-timestamp'];
const signedPayload = timestamp + '.' + JSON.stringify(body);
const expectedSig = crypto.createHmac('sha256', webhookSecret)
                          .update(signedPayload).digest('hex');
const isValid = signature === 't=' + timestamp + ',v1=' + expectedSig;
          </div>
        </div>
      </div>
      
      <script>
        async function testWebhook(id) {
          try {
            const response = await fetch('/api/webhooks/subscriptions/' + id + '/test', {
              method: 'POST'
            });
            const result = await response.json();
            if (result.success && result.data.delivered) {
              alert('Test webhook delivered successfully!');
            } else {
              alert('Test failed: ' + (result.data?.error || 'Unknown error'));
            }
          } catch (e) {
            alert('Error: ' + e.message);
          }
        }
        
        async function deleteWebhook(id) {
          if (!confirm('Delete this webhook?')) return;
          try {
            const response = await fetch('/api/webhooks/subscriptions/' + id, {
              method: 'DELETE'
            });
            if (response.ok) location.reload();
          } catch (e) {
            alert('Error: ' + e.message);
          }
        }
      </script>
    </body>
    </html>
  `;
}

function getUsagePageHTML(user, keys, totalUsage) {
  const usageRows = keys.map(key => {
    const limits = key.getEffectiveRateLimits ? key.getEffectiveRateLimits() : { requests: 100 };
    const usage = key.usage?.currentWindow || 0;
    const percentage = Math.min(100, (usage / limits.requests) * 100);
    
    return `
      <tr>
        <td><code>${key.keyPrefix}</code></td>
        <td>${key.name}</td>
        <td><span class="badge badge-${key.tier === 'internal' ? 'purple' : key.tier === 'partner' ? 'blue' : 'green'}">${key.tier}</span></td>
        <td>${key.usage?.total || 0}</td>
        <td>
          <div style="background: rgba(99, 102, 241, 0.2); border-radius: 9999px; height: 8px; width: 100px;">
            <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); height: 100%; border-radius: 9999px; width: ${percentage}%;"></div>
          </div>
          <span style="font-size: 0.75rem; color: #a1a1aa;">${usage}/${limits.requests}</span>
        </td>
        <td>${key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleString() : 'Never'}</td>
      </tr>
    `;
  }).join('');
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Usage Analytics - HEIR Developer Portal</title>
      ${getBaseStyles()}
    </head>
    <body>
      ${getNavHTML('usage')}
      <div class="container">
        <div class="stat-grid" style="margin-bottom: 2rem;">
          <div class="stat-card">
            <div class="stat-value">${totalUsage.toLocaleString()}</div>
            <div class="stat-label">Total API Requests (All Time)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${keys.length}</div>
            <div class="stat-label">Active API Keys</div>
          </div>
        </div>
        
        <div class="card">
          <h2 class="card-title">Usage by API Key</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Name</th>
                <th>Tier</th>
                <th>Total Requests</th>
                <th>Current Window</th>
                <th>Last Used</th>
              </tr>
            </thead>
            <tbody>
              ${usageRows || '<tr><td colspan="6" style="text-align: center; color: #a1a1aa;">No usage data</td></tr>'}
            </tbody>
          </table>
        </div>
        
        <div class="card">
          <h2 class="card-title">Rate Limits by Tier</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Tier</th>
                <th>General Requests</th>
                <th>Contract Generation</th>
                <th>AI Chat</th>
                <th>Window</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="badge badge-green">Public</span></td>
                <td>100</td>
                <td>10</td>
                <td>5</td>
                <td>15 minutes</td>
              </tr>
              <tr>
                <td><span class="badge badge-blue">Partner</span></td>
                <td>1,000</td>
                <td>100</td>
                <td>50</td>
                <td>15 minutes</td>
              </tr>
              <tr>
                <td><span class="badge badge-purple">Internal</span></td>
                <td>10,000</td>
                <td>1,000</td>
                <td>200</td>
                <td>15 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default router;

