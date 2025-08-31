import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authMiddleware from '../utils/authMiddleware.js';
import { Document } from '../models/index.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock DeepSeek API function - replace with actual DeepSeek integration
const generateDeepSeekAnalysis = async (documents) => {
  // This is where you would make the actual DeepSeek API call
  // For now, returning a more sophisticated mock analysis
  
  const totalDocs = documents.length;
  const finalizedDocs = documents.filter(doc => doc.status?.FINALIZED).length;
  const clients = new Set(documents.map(doc => doc.data?.selectedClient?.email).filter(Boolean)).size;
  const completionRate = totalDocs > 0 ? (finalizedDocs / totalDocs) * 100 : 0;
  
  // Calculate trends (mock data for now)
  const currentMonth = new Date().getMonth();
  const lastMonthDocs = documents.filter(doc => {
    const docDate = new Date(doc.createdAt);
    return docDate.getMonth() === (currentMonth - 1);
  }).length;
  
  const trend = lastMonthDocs > 0 ? ((totalDocs - lastMonthDocs) / lastMonthDocs * 100) : 0;
  
  // Simulate DeepSeek API response structure
  const analysis = {
    summary: `Analysis of ${totalDocs} documents across ${clients} active clients reveals a ${completionRate.toFixed(1)}% completion rate. 

🔍 Key Business Insights:
• Document workflow efficiency shows ${trend > 0 ? 'positive' : 'negative'} momentum (${trend.toFixed(1)}% change)
• Client engagement patterns indicate ${clients > 10 ? 'healthy diversification' : 'concentrated risk'} in customer base
• Completion velocity suggests ${completionRate > 70 ? 'optimal' : 'suboptimal'} process efficiency

📈 Strategic Recommendations:
• ${completionRate < 70 ? 'Implement automated follow-up systems for pending documents' : 'Maintain current workflow optimization'}
• ${clients < 10 ? 'Focus on client acquisition to reduce dependency risk' : 'Consider premium service tiers for top-performing clients'}
• ${trend < 0 ? 'Investigate workflow bottlenecks causing document delays' : 'Scale successful processes to handle increased volume'}

⚡ Next Actions:
• Review documents pending over 7 days for immediate follow-up
• Analyze top-performing client interactions for replication
• Monitor completion rates weekly to maintain momentum`,
    
    metrics: {
      totalDocs,
      finalizedDocs,
      clients,
      completionRate,
      trend,
      pendingDocs: totalDocs - finalizedDocs,
      avgTimeToComplete: 5.2, // Mock data
      clientSatisfactionScore: 8.7 // Mock data
    },
    
    recommendations: [
      {
        category: 'Process Optimization',
        priority: 'High',
        action: 'Implement automated document status reminders',
        impact: 'Could improve completion rate by 15-20%'
      },
      {
        category: 'Client Engagement',
        priority: 'Medium',
        action: 'Create client success playbook based on top performers',
        impact: 'Potential to increase client retention by 25%'
      },
      {
        category: 'Workflow Efficiency', 
        priority: 'Low',
        action: 'Integrate document templates for faster creation',
        impact: 'May reduce document creation time by 30%'
      }
    ],
    
    generatedAt: new Date().toISOString(),
    model: 'DeepSeek-V2.5',
    confidence: 0.87
  };
  
  return analysis;
};

// Topic-specific AI analysis function
const generateTopicAnalysis = async (topic, question, data) => {
  // Check data size to prevent overly large requests
  const dataString = JSON.stringify(data);
  const MAX_DATA_SIZE = 50000; // 50KB limit
  
  if (dataString.length > MAX_DATA_SIZE) {
    throw new Error(`Data too long: ${dataString.length} characters. Maximum allowed: ${MAX_DATA_SIZE}`);
  }
  
  // This is where you would make the actual DeepSeek API call
  // For now, returning topic-specific mock analysis
  
  let analysis;
  
  switch (topic.toLowerCase()) {
    case 'products':
      analysis = await generateProductAnalysis(question, data);
      break;
    case 'clients':
      analysis = await generateClientAnalysis(question, data);
      break;
    case 'documents':
      analysis = await generateDocumentAnalysis(question, data);
      break;
    default:
      throw new Error(`Unsupported topic: ${topic}`);
  }
  
  return {
    ...analysis,
    generatedAt: new Date().toISOString(),
    model: "DeepSeek-V2.5",
    confidence: 0.89,
    topic,
    question
  };
};

// Product-specific analysis
const generateProductAnalysis = async (question, products) => {
  const totalProducts = products.length;
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const companies = [...new Set(products.map(p => p.company).filter(Boolean))];
  
  return {
    summary: `📦 Product Analysis Results:

Based on your question: "${question}"

We found ${totalProducts} products across ${categories.length} categories and ${companies.length} companies.

🔍 Key Insights:
• Total Products: ${totalProducts}
• Categories: ${categories.join(', ') || 'Not categorized'}
• Companies: ${companies.join(', ') || 'No company data'}
• Average products per category: ${categories.length > 0 ? Math.round(totalProducts / categories.length) : 0}

📊 Product Distribution:
${categories.map(cat => {
  const count = products.filter(p => p.category === cat).length;
  return `• ${cat}: ${count} products (${Math.round(count/totalProducts*100)}%)`;
}).join('\n')}`,
    
    metrics: {
      totalProducts,
      categories: categories.length,
      companies: companies.length,
      avgPerCategory: categories.length > 0 ? Math.round(totalProducts / categories.length) : 0
    }
  };
};

// Client-specific analysis  
const generateClientAnalysis = async (question, clients) => {
  const totalClients = clients.length;
  const companies = [...new Set(clients.map(c => c.companyName).filter(Boolean))];
  const recentClients = clients.filter(c => {
    const created = new Date(c.createdAt);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return created > monthAgo;
  }).length;
  
  return {
    summary: `👥 Client Analysis Results:

Based on your question: "${question}"

We found ${totalClients} clients with ${recentClients} added in the last month.

🔍 Key Insights:
• Total Clients: ${totalClients}
• Recent Growth: ${recentClients} new clients (last 30 days)
• Growth Rate: ${totalClients > 0 ? Math.round(recentClients/totalClients*100) : 0}%
• Unique Companies: ${companies.length}

📈 Client Trends:
• Monthly Growth: ${recentClients} new clients
• Company Diversity: ${companies.length} different companies
• Average: ${totalClients > 0 ? Math.round(totalClients/12) : 0} clients per month (estimated)`,
    
    metrics: {
      totalClients,
      recentClients,
      growthRate: totalClients > 0 ? Math.round(recentClients/totalClients*100) : 0,
      uniqueCompanies: companies.length
    }
  };
};

// Document-specific analysis
const generateDocumentAnalysis = async (question, documents) => {
  const totalDocs = documents.length;
  const finalizedDocs = documents.filter(doc => doc.status?.FINALIZED).length;
  const pendingDocs = totalDocs - finalizedDocs;
  const completionRate = totalDocs > 0 ? Math.round((finalizedDocs / totalDocs) * 100) : 0;
  
  return {
    summary: `📄 Document Analysis Results:

Based on your question: "${question}"

We analyzed ${totalDocs} documents with ${completionRate}% completion rate.

🔍 Key Insights:
• Total Documents: ${totalDocs}
• Finalized: ${finalizedDocs} (${completionRate}%)
• Pending: ${pendingDocs} (${100-completionRate}%)
• Workflow Efficiency: ${completionRate > 70 ? 'Good' : completionRate > 40 ? 'Fair' : 'Needs Improvement'}

📊 Document Status:
• Completed: ${finalizedDocs} documents
• In Progress: ${pendingDocs} documents
• Success Rate: ${completionRate}%`,
    
    metrics: {
      totalDocs,
      finalizedDocs,
      pendingDocs,
      completionRate
    }
  };
};

// Generate AI analysis on specific topic
router.post('/generate-analysis', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, question } = req.body;
    
    // Validate input
    if (!topic || !question) {
      return res.status(400).json({
        message: 'Both topic and question are required',
        example: { topic: 'products', question: 'How many products do we have?' }
      });
    }
    
    const validTopics = ['documents', 'products', 'clients'];
    if (!validTopics.includes(topic.toLowerCase())) {
      return res.status(400).json({
        message: 'Invalid topic. Must be one of: documents, products, clients',
        validTopics
      });
    }
    
    // Get data based on topic
    let data;
    let dataCount;
    
    switch (topic.toLowerCase()) {
      case 'documents':
        data = await Document.findAll({ limit: 100 });
        dataCount = data.length;
        break;
        
      case 'products':
        const { Product } = await import('../models/index.js');
        data = await Product.findAll({ limit: 100 });
        dataCount = data.length;
        break;
        
      case 'clients':
        const { Client } = await import('../models/index.js');
        data = await Client.findAll({ limit: 100 });
        dataCount = data.length;
        break;
    }
    
    if (!data || data.length === 0) {
      return res.status(400).json({
        message: `No ${topic} found for analysis`
      });
    }
    
    console.log(`Generating AI analysis for ${dataCount} ${topic} with question: "${question}"`);
    
    // Generate analysis
    const analysis = await generateTopicAnalysis(topic, question, data);
    
    // Store analysis result
    await storeAnalysis(userId, { topic, question, analysis, dataCount });
    
    res.json({ 
      success: true,
      topic,
      question,
      analysis,
      dataAnalyzed: dataCount,
      generatedAt: analysis.generatedAt
    });
    
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    
    // Check if error is due to text length or other issues
    if (error.message && error.message.includes('too long')) {
      return res.status(400).json({
        message: 'Data too large for analysis',
        error: error.message,
        suggestion: 'Try a more specific question or smaller data set'
      });
    }
    
    res.status(500).json({
      message: 'Failed to generate analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get last analysis
router.get('/last-analysis', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const lastAnalysis = await getLastAnalysis(userId);
    
    if (!lastAnalysis) {
      return res.status(404).json({
        message: 'No previous analysis found'
      });
    }
    
    res.json({ 
      analysis: lastAnalysis.analysis,
      generatedAt: lastAnalysis.createdAt
    });
    
  } catch (error) {
    console.error('Error fetching last analysis:', error);
    res.status(500).json({
      message: 'Failed to fetch analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Helper functions (you might want to create a proper Analysis model)
const getLastAnalysis = async (userId) => {
  // For now, using simple file storage - replace with database model
  const analysisDir = path.join(__dirname, '../data/analyses');
  const analysisFile = path.join(analysisDir, `${userId}_analysis.json`);
  
  try {
    if (fs.existsSync(analysisFile)) {
      const data = JSON.parse(fs.readFileSync(analysisFile, 'utf8'));
      return data;
    }
  } catch (error) {
    console.error('Error reading analysis file:', error);
  }
  
  return null;
};

const storeAnalysis = async (userId, analysis) => {
  const analysisDir = path.join(__dirname, '../data/analyses');
  const analysisFile = path.join(analysisDir, `${userId}_analysis.json`);
  
  try {
    // Ensure directory exists
    if (!fs.existsSync(analysisDir)) {
      fs.mkdirSync(analysisDir, { recursive: true });
    }
    
    const data = {
      analysis,
      createdAt: new Date().toISOString(),
      userId
    };
    
    fs.writeFileSync(analysisFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error storing analysis:', error);
  }
};

// Test endpoints without authentication
router.post('/generate-analysis-test', async (req, res) => {
  try {
    const userId = 'test-user'; // Fixed test user ID
    
    // Mock documents for testing
    const documents = [
      { id: 1, company: 'Sermixer', totalAmount: 15000, createdAt: new Date() },
      { id: 2, company: 'S2 Truck Service', totalAmount: 8500, createdAt: new Date() }
    ];
    
    console.log(`Generating test DeepSeek analysis for ${documents.length} documents...`);
    const analysis = await generateDeepSeekAnalysis(documents);
    
    // Store analysis result
    await storeAnalysis(userId, analysis);
    
    res.json({ 
      success: true,
      analysis,
      documentsAnalyzed: documents.length,
      generatedAt: analysis.generatedAt,
      note: 'This is a test endpoint'
    });
    
  } catch (error) {
    console.error('Error generating test AI analysis:', error);
    res.status(500).json({
      message: 'Failed to generate test analysis',
      error: error.message
    });
  }
});

router.get('/last-analysis-test', async (req, res) => {
  try {
    const userId = 'test-user'; // Fixed test user ID
    const lastAnalysis = await getLastAnalysis(userId);
    
    if (!lastAnalysis) {
      return res.status(404).json({
        message: 'No previous test analysis found'
      });
    }
    
    res.json({
      success: true,
      lastAnalysis: lastAnalysis.analysis,
      generatedAt: lastAnalysis.createdAt,
      note: 'This is a test endpoint'
    });
    
  } catch (error) {
    console.error('Error fetching test analysis:', error);
    res.status(500).json({
      message: 'Failed to fetch test analysis',
      error: error.message
    });
  }
});

export default router;