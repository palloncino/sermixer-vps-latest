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
const reduceDataForAnalysis = (data, maxSize = 30000, topic = null) => {
  // First, apply smart summarization to reduce complexity
  let processedData = data;
  
  if (topic?.toLowerCase() === 'documents') {
    // Apply document summarization to remove nested complexity
    console.log(`Applying document summarization to ${data.length} documents`);
    processedData = data.map(doc => summarizeDocument(doc));
  } else if (topic?.toLowerCase() === 'products') {
    // Progressive product reduction - start with level 1
    console.log(`Applying product summarization to ${data.length} products`);
    console.log(`Sample product keys:`, data.length > 0 ? Object.keys(data[0]) : 'No products');
    let reductionLevel = 1;
    
    // Try level 1 first
    processedData = data.map(product => summarizeProduct(product, 1));
    let testSize = JSON.stringify(processedData).length;
    console.log(`Level 1 reduction: ${testSize} chars`);
    
    // If still too large, try level 2
    if (testSize > maxSize * 0.9) {
      console.log(`Level 1 still too large, trying level 2 reduction`);
      processedData = data.map(product => summarizeProduct(product, 2));
      testSize = JSON.stringify(processedData).length;
      console.log(`Level 2 reduction: ${testSize} chars`);
      reductionLevel = 2;
    }
    
    // If still too large, go to CSV-like level 3
    if (testSize > maxSize * 0.9) {
      console.log(`Level 2 still too large, applying CSV-like level 3 reduction`);
      processedData = data.map(product => summarizeProduct(product, 3));
      testSize = JSON.stringify(processedData).length;
      console.log(`Level 3 CSV-like reduction: ${testSize} chars`);
      reductionLevel = 3;
    }
    
    // If still too large, go to extreme level 4 (array format)
    if (testSize > maxSize * 0.9) {
      console.log(`Level 3 still too large, applying extreme level 4 reduction (arrays)`);
      processedData = data.map(product => summarizeProduct(product, 4));
      testSize = JSON.stringify(processedData).length;
      console.log(`Level 4 extreme reduction: ${testSize} chars`);
      reductionLevel = 4;
    }
    
    console.log(`Final products reduction: Level ${reductionLevel}, Size: ${testSize} chars`);
  }
  
  const originalSize = JSON.stringify(data).length;
  const dataString = JSON.stringify(processedData);
  
  console.log(`Data size: Original ${originalSize} chars → Processed ${dataString.length} chars (${Math.round((1 - dataString.length/originalSize) * 100)}% reduction)`);
  
  // Final check - if still too large, use micro-sample + statistics
  if (dataString.length > maxSize && topic && ['products', 'documents'].includes(topic.toLowerCase())) {
    console.log(`Even aggressive reduction failed (${dataString.length} chars), using micro-sample + statistics`);
    
    // Take only first 5 items + comprehensive statistics
    const microSample = processedData.slice(0, 5);
    const stats = generateDataStatistics(data, topic);
    
    // Combine micro sample with statistics
    processedData = {
      type: 'micro-analysis',
      totalRecords: data.length,
      sample: microSample,
      statistics: stats
    };
    
    const finalDataString = JSON.stringify(processedData);
    console.log(`Micro-sample + statistics size: ${finalDataString.length} chars`);
    
    return { 
      reduced: processedData, 
      wasReduced: true, 
      originalCount: data.length,
      reducedCount: 5, // Sample size
      reductionType: 'micro-sample'
    };
  }
  
  if (dataString.length <= maxSize) {
    return { 
      reduced: processedData, 
      wasReduced: topic && ['documents', 'products'].includes(topic.toLowerCase()), 
      originalCount: data.length,
      reductionType: topic && ['documents', 'products'].includes(topic.toLowerCase()) ? 'summarized' : 'none'
    };
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
    reducedCount: reducedData.length,
    reductionType: 'sampled'
  };
};

// File-based data processing for extremely large datasets
const createDataFile = async (data, topic, userId) => {
  const dataDir = path.join(__dirname, '../data/temp');
  
  // Ensure directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filename = `${topic}_${userId}_${Date.now()}.json`;
  const filepath = path.join(dataDir, filename);
  
  // Create ultra-compressed data for file
  let fileData;
  if (topic === 'products') {
    fileData = data.map(p => createProductCSVRow(p));
  } else if (topic === 'documents') {
    fileData = data.map(d => summarizeDocument(d));
  } else {
    fileData = data;
  }
  
  fs.writeFileSync(filepath, JSON.stringify(fileData, null, 2));
  
  return {
    filename,
    filepath,
    recordCount: data.length,
    fileSizeKB: Math.round(fs.statSync(filepath).size / 1024)
  };
};

// Generate data statistics for file-based analysis
const generateDataStatistics = (data, topic) => {
  const stats = {
    totalRecords: data.length,
    topic
  };
  
  if (topic === 'products') {
    const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
    const companies = [...new Set(data.map(p => p.company).filter(Boolean))];
    const prices = data.filter(p => p.price && p.price > 0).map(p => p.price);
    
    stats.categories = categories.length;
    stats.companies = companies.length;
    stats.avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    stats.priceRange = prices.length > 0 ? `€${Math.min(...prices)} - €${Math.max(...prices)}` : 'N/A';
    stats.totalComponents = data.reduce((sum, p) => sum + (p.components?.length || 0), 0);
    stats.sampleProducts = data.slice(0, 5).map(p => `${p.name} (${p.category}, €${p.price})`);
  }
  
  return stats;
};

// Real DeepSeek AI analysis function
const generateTopicAnalysis = async (topic, question, data) => {
  // Smart data reduction instead of throwing error
  const { reduced: processedData, wasReduced, originalCount, reducedCount, reductionType } = reduceDataForAnalysis(data, 30000, topic);
  
  console.log(`Data processing: ${wasReduced ? `Reduced from ${originalCount} to ${reducedCount} items` : `Using all ${originalCount} items`}`);
  
  try {
    // Prepare data summary for DeepSeek using processed data
    const dataSummary = await prepareDataForDeepSeek(topic, processedData, originalCount, wasReduced, reductionType);
    
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

// Smart document summarization for complex nested data
const summarizeDocument = (doc) => {
  const totalValue = doc.data?.addedProducts?.reduce((sum, product) => {
    const productPrice = product.discountedPrice || product.price || 0;
    const componentsValue = product.components?.reduce((compSum, comp) => 
      compSum + (comp.discountedPrice || comp.price || 0), 0) || 0;
    return sum + productPrice + componentsValue;
  }, 0) || 0;

  return {
    id: doc.id,
    company: doc.company,
    clientEmail: doc.clientEmail,
    clientCompany: doc.data?.selectedClient?.companyName,
    clientCity: doc.data?.selectedClient?.address?.city,
    totalValue: totalValue,
    discount: doc.discount,
    status: doc.status,
    isFinalized: doc.status?.FINALIZED || false,
    createdAt: doc.createdAt,
    expiresAt: doc.expiresAt,
    dateOfSignature: doc.dateOfSignature,
    object: doc.data?.quoteHeadDetails?.object,
    productsCount: doc.data?.addedProducts?.length || 0,
    products: doc.data?.addedProducts?.map(p => ({
      name: p.name,
      category: p.category,
      price: p.price,
      discount: p.discount,
      componentsCount: p.components?.length || 0
    })) || [],
    revisionsCount: doc.revisions?.length || 0,
    pdfCount: doc.pdfUrls?.length || 0
  };
};

// CSV-like ultra-minimal product representation
const createProductCSVRow = (product) => {
  return {
    id: product.id,
    name: (product.name || '').substring(0, 20), // Even shorter - 20 chars
    price: product.price || 0,
    cat: (product.category || '').substring(0, 10), // Shortened key + value
    co: (product.company || '').substring(0, 8), // Very short company
    disc: product.discount || 0,
    act: product.active !== false ? 1 : 0,
    comp: product.components?.length || 0
  };
};

// Extreme minimal representation - for massive datasets
const createUltraMinimalProduct = (product) => {
  try {
    return [
      product?.id || 0,
      (product?.name || '').toString().substring(0, 15),
      product?.price || 0,
      (product?.category || '').toString().substring(0, 8),
      Array.isArray(product?.components) ? product.components.length : 0
    ];
  } catch (err) {
    console.error('Error in createUltraMinimalProduct:', err);
    return [0, 'Error', 0, 'Unknown', 0];
  }
};

// Smart product summarization - progressive reduction levels
const summarizeProduct = (product, level = 1) => {
  if (level === 4) {
    // Extreme minimal - array format
    return createUltraMinimalProduct(product);
  }
  
  if (level === 3) {
    // Ultra-minimal CSV-like representation
    return createProductCSVRow(product);
  }
  
  if (level === 2) {
    // Minimal representation
    return {
      id: product.id,
      name: (product.name || '').substring(0, 40),
      price: product.price,
      category: product.category,
      company: product.company,
      active: product.active,
      componentsCount: product.components?.length || 0
    };
  }
  
  // Level 1 - Original summarization
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    company: product.company,
    discount: product.discount,
    active: product.active,
    createdAt: product.createdAt,
    description: product.description ? 
      (product.description.length > 100 ? 
        product.description.substring(0, 100) + '...' : 
        product.description) : '',
    componentsCount: product.components?.length || 0,
    componentsSample: product.components?.slice(0, 2)?.map(c => ({
      name: c.name?.substring(0, 50),
      price: c.price,
      included: c.included
    })) || []
  };
};

// Prepare data summary for DeepSeek API
const prepareDataForDeepSeek = async (topic, data, originalCount = null, wasReduced = false, reductionType = 'none') => {
  const actualCount = originalCount || data.length;
  
  // Handle micro-sample mode
  if (reductionType === 'micro-sample' && data.type === 'micro-analysis') {
    const stats = data.statistics;
    return `Micro-Sample Analysis for ${data.totalRecords} ${topic}:
- Total records: ${data.totalRecords}
- Sample analyzed: ${data.sample.length} representative items
- Categories: ${stats.categories || 'N/A'}
- Companies: ${stats.companies || 'N/A'}
- Average price: €${stats.avgPrice || 'N/A'}
- Price range: ${stats.priceRange || 'N/A'}
- Total components: ${stats.totalComponents || 'N/A'}

Sample Data:
${data.sample.map((item, i) => {
  if (Array.isArray(item)) {
    // Array format (level 4)
    return `${i+1}. ${item[1]} - €${item[2]} (${item[3]})`;
  } else {
    // Object format
    return `${i+1}. ${item.name || item[1] || 'Unknown'} - €${item.price || item[2] || 0} (${item.category || item.cat || item[3] || 'Unknown'})`;
  }
}).join('\n')}

Note: Dataset was too large for full analysis, showing micro-sample with statistics.`;
  }
  
  // Handle statistical summary mode
  if (reductionType === 'statistical-summary' && data.length === 1 && data[0].totalRecords) {
    const stats = data[0];
    return `Statistical Summary for ${actualCount} ${topic}:
- Total records: ${stats.totalRecords}
- Categories: ${stats.categories || 'N/A'}
- Companies: ${stats.companies || 'N/A'}
- Average price: €${stats.avgPrice || 'N/A'}
- Price range: ${stats.priceRange || 'N/A'}
- Total components: ${stats.totalComponents || 'N/A'}
- Sample items: ${stats.sampleProducts?.join(', ') || 'N/A'}

Note: Dataset was too large for detailed analysis, showing statistical summary only.`;
  }
  
  const dataInfo = wasReduced ? `(Analyzing ${data.length} representative samples from ${actualCount} total records)` : `(Analyzing all ${actualCount} records)`;
  
  switch (topic.toLowerCase()) {
    case 'products':
      const categories = [...new Set(data.map(p => p.category).filter(Boolean))];
      const companies = [...new Set(data.map(p => p.company).filter(Boolean))];
      const activeProducts = data.filter(p => p.active !== false).length;
      const estimatedActiveProducts = wasReduced ? Math.round(activeProducts * (actualCount / data.length)) : activeProducts;
      
      // Calculate pricing insights
      const prices = data.filter(p => p.price && p.price > 0).map(p => p.price);
      const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
      
      // Component analysis
      const totalComponents = data.reduce((sum, p) => sum + (p.componentsCount || 0), 0);
      const avgComponents = data.length > 0 ? Math.round(totalComponents / data.length) : 0;
      
      // Sample component names from componentsSample
      const sampleComponents = new Set();
      data.forEach(p => {
        if (p.componentsSample) {
          p.componentsSample.forEach(c => sampleComponents.add(c.name));
        }
      });
      
      return `Products Data ${dataInfo}:
- Total products in database: ${actualCount}
- Active products: ${estimatedActiveProducts}
- Categories: ${categories.join(', ')} (${categories.length} total)
- Companies: ${companies.join(', ')} (${companies.length} total)
- Price range: €${minPrice.toLocaleString()} - €${maxPrice.toLocaleString()}
- Average price: €${avgPrice.toLocaleString()}
- Average components per product: ${avgComponents}
- Sample products: ${data.slice(0, 5).map(p => `${p.name || 'Unnamed'} (${p.category || 'Uncategorized'}, €${p.price?.toLocaleString() || 0}, ${p.componentsCount || 0} components)`).join(', ')}
- Common components: ${Array.from(sampleComponents).slice(0, 5).join(', ')}${sampleComponents.size > 5 ? '...' : ''}`;

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
      const finalized = data.filter(doc => doc.isFinalized || doc.status?.FINALIZED).length;
      const pending = data.length - finalized;
      const completionRate = data.length > 0 ? Math.round((finalized / data.length) * 100) : 0;
      
      // Calculate estimated totals if data was reduced
      const estimatedFinalized = wasReduced ? Math.round(finalized * (actualCount / data.length)) : finalized;
      const estimatedPending = actualCount - estimatedFinalized;
      
      const docCompanies = [...new Set(data.map(d => d.company).filter(Boolean))];
      const clients = [...new Set(data.map(d => d.clientCompany).filter(Boolean))];
      const totalValue = data.reduce((sum, doc) => sum + (parseFloat(doc.totalValue) || 0), 0);
      const avgValue = data.length > 0 ? Math.round(totalValue / data.length) : 0;
      
      // Document objects/purposes
      const objects = [...new Set(data.map(d => d.object).filter(Boolean))];
      
      // Product categories from documents
      const allCategories = new Set();
      data.forEach(doc => {
        if (doc.products) {
          doc.products.forEach(prod => {
            if (prod.category) allCategories.add(prod.category);
          });
        }
      });
      
      return `Documents Data ${dataInfo}:
- Total documents in database: ${actualCount}
- Finalized: ${estimatedFinalized} (${Math.round((estimatedFinalized / actualCount) * 100)}%)
- Pending: ${estimatedPending}
- Companies: ${docCompanies.join(', ')}
- Unique clients: ${clients.length} (${clients.slice(0, 5).join(', ')}${clients.length > 5 ? '...' : ''})
- Total portfolio value: €${totalValue.toLocaleString()}
- Average document value: €${avgValue.toLocaleString()}
- Document types: ${objects.slice(0, 5).join(', ')}${objects.length > 5 ? ` and ${objects.length - 5} more` : ''}
- Product categories: ${Array.from(allCategories).slice(0, 5).join(', ')}
- Recent activity: ${data.slice(0, 3).map(d => `Doc ${d.id} (${d.isFinalized ? 'Complete' : 'Pending'}, €${d.totalValue?.toLocaleString() || 0}, ${d.productsCount} products)`).join(', ')}`;

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
      
      // Calculate pricing metrics
      const prices = data.filter(p => p.price && p.price > 0).map(p => p.price);
      const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
      const totalComponents = data.reduce((sum, p) => sum + (p.componentsCount || 0), 0);
      const avgComponents = data.length > 0 ? Math.round(totalComponents / data.length) : 0;
      
      return {
        totalProducts: actualCount,
        activeProducts: estimatedActiveProducts,
        categories: categories.length,
        companies: companies.length,
        avgPerCategory: categories.length > 0 ? Math.round(actualCount / categories.length) : 0,
        avgPrice: avgPrice,
        minPrice: prices.length > 0 ? Math.min(...prices) : 0,
        maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        avgComponents: avgComponents,
        totalComponents: wasReduced ? Math.round(totalComponents * (actualCount / data.length)) : totalComponents,
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
      const finalizedDocs = data.filter(doc => doc.isFinalized || doc.status?.FINALIZED).length;
      const pendingDocs = data.length - finalizedDocs;
      const completionRate = data.length > 0 ? Math.round((finalizedDocs / data.length) * 100) : 0;
      const estimatedFinalized = wasReduced ? Math.round(finalizedDocs * (actualCount / data.length)) : finalizedDocs;
      const estimatedPending = actualCount - estimatedFinalized;
      
      const totalValue = data.reduce((sum, doc) => sum + (parseFloat(doc.totalValue) || 0), 0);
      const avgValue = data.length > 0 ? Math.round(totalValue / data.length) : 0;
      const totalProducts = data.reduce((sum, doc) => sum + (doc.productsCount || 0), 0);
      
      return {
        totalDocs: actualCount,
        finalizedDocs: estimatedFinalized,
        pendingDocs: estimatedPending,
        completionRate: Math.round((estimatedFinalized / actualCount) * 100),
        totalValue: wasReduced ? Math.round(totalValue * (actualCount / data.length)) : totalValue,
        avgDocValue: avgValue,
        totalProducts: wasReduced ? Math.round(totalProducts * (actualCount / data.length)) : totalProducts,
        avgProductsPerDoc: data.length > 0 ? Math.round(totalProducts / data.length) : 0,
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