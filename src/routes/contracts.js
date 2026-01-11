import express from 'express';
import { ethers } from 'ethers';
import { generateSolidityContract } from '../generators/solidity.js';
import { generateSolanaContract } from '../generators/solana.js';
import { generateTONContract } from '../generators/ton.js';
import { validateContractInput } from '../validators/inputValidator.js';
import { analyzeContract } from '../audit/staticAnalysis.js';
import { compileSolidity } from '../utils/compiler.js';
import { DeployedContract } from '../models/DeployedContract.js';
import { verifyAuth } from '../middleware/auth.js';
import { contractLimiter } from '../middleware/rateLimiter.js';
import StripeService from '../services/stripeService.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Contracts');

const router = express.Router();

/**
 * @openapi
 * /contracts/templates:
 *   get:
 *     summary: Get available inheritance templates
 *     description: Returns a list of all available legal inheritance templates (Islamic, Common Law, Civil Law, etc.)
 *     tags: [Contracts]
 *     responses:
 *       200:
 *         description: List of available templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 templates:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: common-law
 *                       name:
 *                         type: string
 *                         example: Common Law
 *                       description:
 *                         type: string
 */
router.get('/templates', (req, res) => {
  // Return available templates
  const templates = [
    { type: 'islamic-mirth', name: 'Islamic Inheritance (Mirth)', description: 'Fixed shares based on Quranic rules.' },
    { type: 'islamic-wasiyyah', name: 'Islamic Inheritance (Wasiyyah)', description: 'Will-based Islamic inheritance.' },
    { type: 'islamic-waqf', name: 'Islamic Waqf', description: 'Religious endowment distribution.' },
    { type: 'common-law', name: 'Common Law', description: 'Freedom of testation with some restrictions.' },
    { type: 'civil-law', name: 'Civil Law', description: 'Forced heirship rules.' },
    { type: 'african', name: 'African Traditional Law', description: 'Traditional African inheritance customs.' },
    { type: 'chinese', name: 'Chinese Traditional Law', description: 'Traditional Chinese family inheritance.' },
    { type: 'christian', name: 'Christian Canon Law', description: 'Christian religious inheritance principles.' },
    { type: 'hindu', name: 'Hindu Law', description: 'Traditional Hindu inheritance system.' },
    { type: 'japanese', name: 'Japanese Family Law', description: 'Traditional Japanese family inheritance.' },
    { type: 'jewish', name: 'Jewish Halakhic Law', description: 'Jewish religious inheritance law.' },
    { type: 'indigenous', name: 'Indigenous Traditional Law', description: 'Indigenous community inheritance customs.' },
    { type: 'custom', name: 'Custom Distribution', description: 'User-defined distribution.' }
  ];
  res.json({ templates });
});

/**
 * @openapi
 * /contracts/generate:
 *   post:
 *     summary: Generate inheritance smart contract
 *     description: |
 *       Generates a smart contract based on the specified blockchain, inheritance template,
 *       beneficiaries, and other configuration options.
 *       
 *       Supports EVM (Solidity), Solana (Rust), and TON (FunC) blockchains.
 *     tags: [Contracts]
 *     security:
 *       - apiKey: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateContractRequest'
 *     responses:
 *       200:
 *         description: Contract generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 contractCode:
 *                   type: string
 *                   description: Generated smart contract source code
 *                 contractInfo:
 *                   type: object
 *                   properties:
 *                     blockchain:
 *                       type: string
 *                     distribution:
 *                       type: object
 *                 compiled:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     abi:
 *                       type: array
 *                     bytecode:
 *                       type: string
 *                 analysis:
 *                   type: object
 *                   description: Static analysis results
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       429:
 *         $ref: '#/components/responses/RateLimitExceeded'
 */
router.post('/generate', contractLimiter, async (req, res) => {
  try {
    const input = req.body;

    // #region agent log
    console.log('[DEBUG][A,B] generate-entry:', JSON.stringify({blockchain:input.blockchain,ownerAddress:input.ownerAddress?.slice(0,20),beneficiaryCount:input.beneficiaries?.length,inheritanceTemplate:input.inheritanceTemplate,deadMansSwitch:input.deadMansSwitch,hasAssets:input.assets?.length>0}));
    // #endregion

    // Log inheritance template for debugging
    if (input.inheritanceTemplate) {
      console.log('Received inheritanceTemplate:', JSON.stringify(input.inheritanceTemplate, null, 2));
    }

    // Validate input
    const validation = validateContractInput(input);
    if (!validation.valid) {
      // #region agent log
      console.log('[DEBUG][A,B] validation-FAILED:', JSON.stringify({errors:validation.errors,inputSnapshot:{blockchain:input.blockchain,ownerAddress:input.ownerAddress,templateType:typeof input.inheritanceTemplate,templateValue:input.inheritanceTemplate,beneficiaries:input.beneficiaries?.map(b=>({name:b.name,hasAddress:!!b.address,address:b.address?.slice(0,15)})),deadMansSwitch:input.deadMansSwitch}}));
      // #endregion
      console.error('Validation failed:', validation.errors);
      return res.status(400).json({ error: validation.errors });
    }

    // #region agent log
    console.log('[DEBUG][A] validation-PASSED:', JSON.stringify({normalizedTemplate:input.inheritanceTemplate}));
    // #endregion

    let contractCode;
    let contractInfo;
    let compiled = null;

    if (input.blockchain === 'evm') {
      // #region agent log
      console.log('[DEBUG][C,D] evm-generate-start:', JSON.stringify({beneficiaries:input.beneficiaries?.map(b=>({name:b.name,address:b.address,relationship:b.relationship,percentage:b.percentage}))}));
      // #endregion
      
      const result = generateSolidityContract(input);
      contractCode = result.code;
      contractInfo = result.info;

      // #region agent log
      console.log('[DEBUG][C,D] evm-generate-done:', JSON.stringify({codeLength:contractCode?.length,distribution:contractInfo?.distribution,hasCode:!!contractCode}));
      // #endregion

      // Compile Solidity
      try {
        compiled = compileSolidity(contractCode);
        // #region agent log
        console.log('[DEBUG][E] compile-SUCCESS:', JSON.stringify({hasAbi:!!compiled?.abi,hasBytecode:!!compiled?.bytecode,abiLength:compiled?.abi?.length}));
        // #endregion
      } catch (err) {
        // #region agent log
        console.log('[DEBUG][E] compile-FAILED:', JSON.stringify({error:err.message,codeSnippet:contractCode?.slice(0,500)}));
        // #endregion
        console.warn("Compilation failed, returning code only:", err.message);
      }
    } else if (input.blockchain === 'solana') {
      const result = generateSolanaContract(input);
      contractCode = result.code;
      contractInfo = result.info;
      // Solana compilation requires Rust/Cargo environment, skip for MVP JS-only backend
    } else if (input.blockchain === 'ton') {
      const result = generateTONContract(input);
      contractCode = result.contracts[0].code; // FUNC code
      contractInfo = {
        blockchain: 'TON',
        network: input.conditions?.network || 'testnet',
        deploymentScript: result.contracts[0].deploymentScript,
        typescript: result.contracts[0].typescript,
        estimatedGas: result.contracts[0].estimatedGas
      };
      // TON FUNC compilation requires func compiler, deployment script handles this
    } else {
      return res.status(400).json({ error: 'Invalid blockchain selection' });
    }

    // Run static analysis
    const analysis = analyzeContract(contractCode, input.blockchain);

    // #region agent log
    console.log('[DEBUG][SUCCESS] generate-complete:', JSON.stringify({hasCode:!!contractCode,hasCompiled:!!compiled,hasAnalysis:!!analysis}));
    // #endregion

    res.json({
      contractCode,
      contractInfo,
      compiled, // ABI and Bytecode
      analysis,
      success: true
    });
  } catch (error) {
    // #region agent log
    console.log('[DEBUG][EXCEPTION] generate-error:', JSON.stringify({error:error.message,stack:error.stack?.slice(0,500)}));
    // #endregion
    console.error('Error generating contract:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /contracts/compile:
 *   post:
 *     summary: Compile smart contract source code
 *     description: Compiles Solidity source code and returns ABI and bytecode
 *     tags: [Contracts]
 *     security:
 *       - apiKey: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sourceCode, blockchain]
 *             properties:
 *               sourceCode:
 *                 type: string
 *                 description: Smart contract source code
 *               blockchain:
 *                 type: string
 *                 enum: [evm]
 *     responses:
 *       200:
 *         description: Compilation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 compiled:
 *                   type: object
 *                   properties:
 *                     abi:
 *                       type: array
 *                     bytecode:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/compile', contractLimiter, async (req, res) => {
  try {
    const { sourceCode, blockchain } = req.body;

    if (blockchain === 'evm') {
      try {
        const compiled = compileSolidity(sourceCode);
        res.json({ compiled, success: true });
      } catch (err) {
        res.status(400).json({ error: err.message, success: false });
      }
    } else {
      res.status(400).json({ error: 'Only EVM compilation is supported currently.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @openapi
 * /contracts/estimate-gas:
 *   post:
 *     summary: Estimate gas costs for contract operations
 *     description: Returns estimated gas costs for deployment and common operations
 *     tags: [Contracts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blockchain:
 *                 type: string
 *                 enum: [evm, solana]
 *               contractCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gas estimates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estimate:
 *                   type: object
 *                   properties:
 *                     deployment:
 *                       type: string
 *                       example: "~500000"
 *                     claim:
 *                       type: string
 *                     update:
 *                       type: string
 *                     currency:
 *                       type: string
 *                       example: ETH
 */
router.post('/estimate-gas', async (req, res) => {
  try {
    const { blockchain, contractCode } = req.body;

    // Simple estimation - in production, use actual gas estimation
    let estimate;
    if (blockchain === 'evm') {
      estimate = {
        deployment: '~500000',
        claim: '~100000',
        update: '~50000',
        currency: 'ETH'
      };
    } else if (blockchain === 'solana') {
      estimate = {
        deployment: '~0.5',
        claim: '~0.000005',
        update: '~0.000005',
        currency: 'SOL'
      };
    }

    res.json({ estimate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contracts/deploy-gasless - Gasless deployment via platform relayer
router.post('/deploy-gasless', verifyAuth, async (req, res) => {
  try {
    const { paymentIntentId, network, contractData, ownerAddress } = req.body;
    
    if (!paymentIntentId || !contractData || !ownerAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: paymentIntentId, contractData, ownerAddress' 
      });
    }
    
    // 1. Verify Stripe payment was successful
    const paymentVerified = await StripeService.verifyPayment(paymentIntentId);
    if (!paymentVerified) {
      logger.warn('Payment verification failed', { paymentIntentId });
      return res.status(402).json({
        success: false,
        error: 'Payment verification failed',
        message: 'Payment was not successful. Please try again or contact support.'
      });
    }
    
    // 2. Check if relayer is configured
    if (!process.env.RELAYER_PRIVATE_KEY) {
      logger.warn('Relayer not configured for gasless deployment');
      return res.status(503).json({
        success: false,
        error: 'Gasless deployment not available',
        message: 'Gasless deployment service is not configured. Please use "Pay with Wallet" option to deploy directly from your connected wallet.'
      });
    }
    
    // 3. Validate contract data
    if (!contractData.abi || !contractData.bytecode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contract data',
        message: 'Contract ABI and bytecode are required.'
      });
    }
    
    // 4. Get RPC URL for network
    const rpcUrls = {
      'ethereum': process.env.ETHEREUM_RPC_URL || process.env.RPC_URL,
      'polygon': process.env.POLYGON_RPC_URL,
      'base': process.env.BASE_RPC_URL,
      'sepolia': process.env.SEPOLIA_RPC_URL,
      'mumbai': process.env.MUMBAI_RPC_URL,
      'base-sepolia': process.env.BASE_SEPOLIA_RPC_URL
    };
    
    const rpcUrl = rpcUrls[network] || process.env.RPC_URL;
    if (!rpcUrl) {
      return res.status(400).json({
        success: false,
        error: 'Network not configured',
        message: `RPC URL for network ${network} is not configured.`
      });
    }
    
    // 5. Initialize provider and relayer wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const relayerWallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
    
    // Check relayer balance
    const balance = await provider.getBalance(relayerWallet.address);
    const balanceInEth = ethers.formatEther(balance);
    
    logger.info('Relayer balance check', {
      address: relayerWallet.address,
      balance: balanceInEth,
      network
    });
    
    if (parseFloat(balanceInEth) < 0.001) {
      logger.warn('Relayer balance too low', { balance: balanceInEth });
      return res.status(503).json({
        success: false,
        error: 'Insufficient relayer funds',
        message: 'Gasless deployment service is temporarily unavailable due to insufficient funds. Please use "Pay with Wallet" option or contact support.'
      });
    }
    
    // 6. Deploy contract using relayer wallet
    const factory = new ethers.ContractFactory(
      contractData.abi,
      contractData.bytecode,
      relayerWallet
    );
    
    const constructorArgs = contractData.constructorArgs || [];
    logger.info('Deploying contract', {
      network,
      ownerAddress,
      constructorArgs: constructorArgs.length
    });
    
    const deployment = await factory.deploy(...constructorArgs);
    const deploymentTx = deployment.deploymentTransaction();
    
    if (!deploymentTx) {
      throw new Error('Deployment transaction not created');
    }
    
    logger.info('Contract deployment transaction sent', {
      hash: deploymentTx.hash,
      from: relayerWallet.address
    });
    
    // Wait for deployment
    await deployment.waitForDeployment();
    const contractAddress = await deployment.getAddress();
    const txHash = deploymentTx.hash;
    
    logger.info('Contract deployed successfully', {
      contractAddress,
      txHash,
      network
    });
    
    // 7. Return contract address and tx hash
    return res.json({
      success: true,
      contractAddress,
      transactionHash: txHash,
      network,
      deployerAddress: relayerWallet.address,
      paymentIntentId
    });
    
  } catch (error) {
    logger.error('Gasless deployment error', {
      error: error.message,
      stack: error.stack,
      paymentIntentId: req.body.paymentIntentId
    });
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Deployment failed',
      message: 'An error occurred during deployment. Please contact support with your Payment ID.'
    });
  }
});

// POST /api/contracts/record-deployment - Record a successful deployment
router.post('/record-deployment', verifyAuth, async (req, res) => {
  try {
    const { userAddress, contractAddress, network, deploymentTx, contractInfo, abi } = req.body;

    if (!userAddress || !contractAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure beneficiaries are explicitly saved in contractInfo for easy searching
    // The frontend should pass this in contractInfo, but we validate/ensure it here if needed
    // For now, we trust contractInfo contains the necessary 'beneficiaries' array or 'distribution' map

    const newDeployment = new DeployedContract({
      userAddress,
      contractAddress,
      network,
      deploymentTx,
      contractInfo,
      abi,
      status: 'active'
    });

    await newDeployment.save();

    res.json({ success: true, contract: newDeployment });
  } catch (error) {
    console.error('Error recording deployment:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contracts/user/:address - Get user's deployed contracts (Protected)
router.get('/user/:address', verifyAuth, async (req, res) => {
  try {
    const { address } = req.params;
    
    // Verify user is authorized to view these contracts
    // Users can only view their own contracts unless they're an admin
    if (req.user) {
      // If authenticated via JWT, check if they own this address
      const userOwnsAddress = req.user.wallets?.some(w => 
        w.address.toLowerCase() === address.toLowerCase()
      );
      
      // SECURITY: Admin email from env var, not hardcoded
      const adminEmail = process.env.ADMIN_EMAIL;
      const isAdmin = adminEmail && req.user.email === adminEmail;
      
      if (!userOwnsAddress && !isAdmin) {
        return res.status(403).json({ error: 'Unauthorized to view these contracts' });
      }
    }
    
    const contracts = await DeployedContract.find({ userAddress: address }).sort({ createdAt: -1 });
    res.json({ contracts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/contracts/beneficiary/:identity - Get contracts where identity is a beneficiary (Protected)
// SECURITY: Users can only query their own identity (wallet address or email)
router.get('/beneficiary/:identity', verifyAuth, async (req, res) => {
  try {
    const { identity } = req.params;
    const searchIdentity = identity.toLowerCase();

    // SECURITY: Verify user is querying their own identity
    const userWallets = (req.user.wallets || []).map(w => w.address.toLowerCase());
    const userEmail = req.user.email?.toLowerCase();
    
    const isOwnIdentity = userWallets.includes(searchIdentity) || 
                          userEmail === searchIdentity;
    
    if (!isOwnIdentity) {
      return res.status(403).json({ 
        error: 'Unauthorized - you can only query your own beneficiary status' 
      });
    }

    // Find contracts where:
    // 1. contractInfo.distribution has a key matching the wallet address
    // 2. contractInfo.beneficiaries array contains an object with email matching the identity

    const contracts = await DeployedContract.find({
      $or: [
        { [`contractInfo.distribution.${searchIdentity}`]: { $exists: true } },
        { "contractInfo.beneficiaries": { $elemMatch: { email: searchIdentity } } }
      ]
    }).sort({ createdAt: -1 });

    res.json({ contracts });
  } catch (error) {
    console.error('Error fetching beneficiary contracts:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
