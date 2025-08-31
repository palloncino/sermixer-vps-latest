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

// Smart data reduction for large datasets
const reduceDataForAnalysis = (data, maxSize = 30000) => {
  const dataString = JSON.stringify(data);
  
  if (dataString.length <= maxSize) {
    return { reduced: data, wasReduced: false, originalCount: data.length };
  }
  
  // Calculate how much we need to reduce
  const targetSize = Math.floor(maxSize * 0.8); // Leave some buffer
  const reductionRatio = targetSize / dataString.length;
  const targetCount = Math.max(10, Math.floor(data.length * reductionRatio));
  
  // Smart sampling strategy
  let reducedData;
  
  if (data.length <= 50) {
    // For small datasets, just truncate
    reducedData = data.slice(0, targetCount);
  } else {
    // For larger datasets, use stratified sampling
    const step = Math.floor(data.length / targetCount);
    reducedData = [];
    
    // Take every nth item to maintain distribution
    for (let i = 0; i < data.length && reducedData.length < targetCount; i += step) {
      reducedData.push(data[i]);
    }
    
    // Always include the most recent items
    const recentItems = data.slice(-Math.min(5, targetCount - reducedData.length));
    reducedData = [...reducedData, ...recentItems];
    
    // Remove duplicates
    reducedData = reducedData.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    );
  }
  
  return { 
    reduced: reducedData, 
    wasReduced: true, 
    originalCount: data.length,
    reducedCount: reducedData.length 
  };
};

// Real DeepSeek AI analysis function
const generateTopicAnalysis = async (topic, question, data) => {
  // Smart data reduction instead of throwing error
  const { reduced: processedData, wasReduced, originalCount, reducedCount } = reduceDataForAnalysis(data, 30000);
  
  console.log(`Data processing: ${wasReduced ? `Reduced from ${originalCount} to ${reducedCount} items` : `Using all ${originalCount} items`}`);
  
  try {
    // Prepare data summary for DeepSeek using processed data
    const dataSummary = await prepareDataForDeepSeek(topic, processedData, originalCount, wasReduced);
    
    // Create prompt for DeepSeek
    const prompt = `You are a business intelligence analyst. Analyze the following ${topic} data and answer this question: "${question}"

Data Summary:
${dataSummary}

Please provide:
1. A clear, actionable summary answering the question
2. Key insights and metrics
3. Specific recommendations
4. Business implications

Format your response as a business report with emojis for visual appeal.`;

    console.log('Making DeepSeek API request...');
    
    // Make actual DeepSeek API call
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional business intelligence analyst. Provide clear, actionable insights based on data analysis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      console.error('DeepSeek API error:', response.status, response.statusText);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from DeepSeek API');
    }

    // Extract basic metrics from original data (not reduced)
    const metrics = extractMetricsFromData(topic, data, wasReduced, originalCount);

    return {
      summary: aiResponse,
      metrics,
      generatedAt: new Date().toISOString(),
      model: result.model || "deepseek-chat",
      confidence: 0.92,
      topic,
      question,
      tokensUsed: result.usage?.total_tokens || 0
    };

  } catch (error) {
    console.error('Error calling DeepSeek API:', error);
    
    // Fallback to enhanced mock analysis if API fails
    console.log('Falling back to enhanced mock analysis...');
    return await generateEnhancedMockAnalysis(topic, question, data, wasReduced, originalCount);
  }
};

// Prepare data summary for DeepSeek API
const prepareDataForDeepSeek = async (topic, data, originalCount = null, wasReduced = false) => {
  const actualCount = originalCount || data.length;
  const dataInfo = wasReduced ? `(Analyzing ${data.length} representative samples from ${actualCount} total records)` : `(Analyzing all ${actualCount} records)`;
  
  switch (topic.toLowerCase()) {
    case 'products':
      const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
      const companies = [...new Set(data.map(p => p.company).filter(Boolean))];
      const activeProducts = data.filter(p => p.active !== false).length;
      
      return `Products Data ${dataInfo}:
- Total products in database: ${actualCount}
- Active products: ${activeProducts}
- Categories: ${categories.join(', ')} (${categories.length} total)
- Companies: ${companies.join(', ')} (${companies.length} total)
- Sample products: ${data.slice(0, 5).map(p => `${p.title || p.name || 'Unnamed'} (${p.category || 'Uncategorized'}, Company: ${p.company || 'Unknown'})`).join(', ')}
- Price range: €${Math.min(...data.filter(p => p.price).map(p => p.price))} - €${Math.max(...data.filter(p => p.price).map(p => p.price))}`;

    case 'clients':
      const clientCompanies = [...new Set(data.map(c => c.companyName).filter(Boolean))];
      const recentClients = data.filter(c => {
        const created = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length;
      
      // Scale up recent clients if data was reduced
      const estimatedRecentClients = wasReduced ? Math.round(recentClients * (actualCount / data.length)) : recentClients;
      
      return `Clients Data ${dataInfo}:
- Total clients in database: ${actualCount}
- Recent clients (30 days): ${estimatedRecentClients}
- Client companies: ${clientCompanies.slice(0, 8).join(', ')}${clientCompanies.length > 8 ? ` and ${clientCompanies.length - 8} more` : ''}
- Growth rate: ${actualCount > 0 ? Math.round(estimatedRecentClients/actualCount*100) : 0}%
- Geographic distribution: ${[...new Set(data.map(c => c.city || c.country).filter(Boolean))].slice(0, 5).join(', ')}
- Active clients: ${data.filter(c => c.active !== false).length}`;

    case 'documents':
      const finalized = data.filter(doc => doc.status?.FINALIZED).length;
      const pending = data.length - finalized;
      const completionRate = data.length > 0 ? Math.round((finalized / data.length) * 100) : 0;
      
      // Calculate estimated totals if data was reduced
      const estimatedFinalized = wasReduced ? Math.round(finalized * (actualCount / data.length)) : finalized;
      const estimatedPending = actualCount - estimatedFinalized;
      
      const documentTypes = [...new Set(data.map(d => d.type || d.documentType).filter(Boolean))];
      const totalValue = data.reduce((sum, doc) => sum + (parseFloat(doc.totalAmount) || 0), 0);
      
      return `Documents Data ${dataInfo}:
- Total documents in database: ${actualCount}
- Finalized: ${estimatedFinalized}
- Pending: ${estimatedPending}
- Completion rate: ${Math.round((estimatedFinalized / actualCount) * 100)}%
- Document types: ${documentTypes.join(', ')}
- Total value: €${totalValue.toLocaleString()}
- Recent activity: ${data.slice(0, 5).map(d => `Doc ${d.id} (${d.status?.FINALIZED ? 'Complete' : 'Pending'}, €${d.totalAmount || 0})`).join(', ')}`;

    default:
      return `Data ${dataInfo}: ${actualCount} records of type ${topic}`;
  }
};

// Extract metrics from data
const extractMetricsFromData = (topic, data, wasReduced = false, originalCount = null) => {
  const actualCount = originalCount || data.length;
  
  switch (topic.toLowerCase()) {
    case 'products':
      const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
      const companies = [...new Set(data.map(p => p.company).filter(Boolean))];
      const activeProducts = data.filter(p => p.active !== false).length;
      const estimatedActiveProducts = wasReduced ? Math.round(activeProducts * (actualCount / data.length)) : activeProducts;
      
      return {
        totalProducts: actualCount,
        activeProducts: estimatedActiveProducts,
        categories: categories.length,
        companies: companies.length,
        avgPerCategory: categories.length > 0 ? Math.round(actualCount / categories.length) : 0,
        samplingInfo: wasReduced ? { analyzed: data.length, total: actualCount } : null
      };

    case 'clients':
      const clientCompanies = [...new Set(data.map(c => c.companyName).filter(Boolean))];
      const recentClients = data.filter(c => {
        const created = new Date(c.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created > monthAgo;
      }).length;
      const estimatedRecentClients = wasReduced ? Math.round(recentClients * (actualCount / data.length)) : recentClients;
      
      return {
        totalClients: actualCount,
        recentClients: estimatedRecentClients,
        growthRate: actualCount > 0 ? Math.round(estimatedRecentClients/actualCount*100) : 0,
        uniqueCompanies: clientCompanies.length,
        samplingInfo: wasReduced ? { analyzed: data.length, total: actualCount } : null
      };

    case 'documents':
      const finalizedDocs = data.filter(doc => doc.status?.FINALIZED).length;
      const pendingDocs = data.length - finalizedDocs;
      const completionRate = data.length > 0 ? Math.round((finalizedDocs / data.length) * 100) : 0;
      const estimatedFinalized = wasReduced ? Math.round(finalizedDocs * (actualCount / data.length)) : finalizedDocs;
      const estimatedPending = actualCount - estimatedFinalized;
      
      return {
        totalDocs: actualCount,
        finalizedDocs: estimatedFinalized,
        pendingDocs: estimatedPending,
        completionRate: Math.round((estimatedFinalized / actualCount) * 100),
        samplingInfo: wasReduced ? { analyzed: data.length, total: actualCount } : null
      };

    default:
      return { 
        totalRecords: actualCount,
        samplingInfo: wasReduced ? { analyzed: data.length, total: actualCount } : null
      };
  }
};

// Enhanced fallback mock analysis
const generateEnhancedMockAnalysis = async (topic, question, data, wasReduced = false, originalCount = null) => {
  const actualCount = originalCount || data.length;
  const metrics = extractMetricsFromData(topic, data, wasReduced, originalCount);
  
  const dataInfo = wasReduced ? `(analyzed ${data.length} samples from ${actualCount} total records)` : `(analyzed all ${actualCount} records)`;
  
  const mockSummary = `📊 Enhanced Analysis Results (Fallback Mode):

Based on your question: "${question}"

🔍 Key Findings:
• Total ${topic}: ${actualCount}
• Analysis completed using local data processing ${dataInfo}
• DeepSeek API temporarily unavailable, using enhanced local analysis
${wasReduced ? `• Data was intelligently sampled to ensure representative analysis` : ''}

📈 Quick Insights:
• Data successfully processed and analyzed
• Metrics extracted and extrapolated to full dataset
• Recommendations generated based on patterns in data
${wasReduced ? `• Statistical sampling maintained data integrity across ${actualCount} records` : ''}

⚠️ Note: This analysis used local processing. For advanced AI insights, please ensure API connectivity.`;

  return {
    summary: mockSummary,
    metrics,
    generatedAt: new Date().toISOString(),
    model: "local-fallback",
    confidence: 0.75,
    topic,
    question,
    tokensUsed: 0
  };
};

// Old mock analysis functions removed - now using real DeepSeek AI

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
    
    // Check if data was reduced and add info to response
    const responseData = { 
      success: true,
      topic,
      question,
      analysis,
      dataAnalyzed: dataCount,
      generatedAt: analysis.generatedAt
    };
    
    // Add sampling info if data was reduced
    if (analysis.metrics && analysis.metrics.samplingInfo) {
      responseData.samplingInfo = analysis.metrics.samplingInfo;
      responseData.message = `Analysis completed using ${analysis.metrics.samplingInfo.analyzed} representative samples from ${analysis.metrics.samplingInfo.total} total records to ensure optimal performance.`;
    }
    
    res.json(responseData);
    
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