import express from 'express';
import axios from 'axios';

const router = express.Router();

// Environment variables
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';

// Only log essential info, not every request
if (!DEEPSEEK_API_KEY) {
  console.log('⚠️ DeepSeek API key not configured, using local analysis fallback');
} else {
  console.log('🤖 DeepSeek API key configured, AI analysis enabled');
}

// Local analysis fallback when DeepSeek is unavailable
const generateLocalAnalysis = (data) => {
  const { metrics } = data;
  
  const insights = [];
  const recommendations = [];
  const trends = [];

  // Generate insights based on metrics
  if (metrics.completionRate > 0.8) {
    insights.push('Eccellente gestione dei progetti! Alto tasso di completamento rapporti indica forte efficienza del team e ottimizzazione dei flussi di lavoro');
  } else if (metrics.completionRate > 0.6) {
    insights.push('Buon progresso sui rapporti, ma c\'è spazio per migliorare il follow-through dei progetti e il monitoraggio del completamento');
  } else {
    insights.push('Tasso di completamento moderato suggerisce potenziali colli di bottiglia nei flussi di lavoro o problemi di allocazione delle risorse');
  }

  if (metrics.activeWorksitesRatio > 0.7) {
    insights.push('Forte utilizzo dei cantieri mostra attività aziendale sana e pipeline di progetti solida');
  } else {
    insights.push('Utilizzo dei cantieri più basso può indicare pattern stagionali o opportunità per aumentare il volume dei progetti');
  }

  if (metrics.adminRatio > 0.3) {
    insights.push('Buon rapporto admin-utente per la gestione del sistema');
  }

  // Generate recommendations
  if (metrics.completionRate < 0.8) {
    recommendations.push('Implementare flussi di lavoro di tracciamento progetti per migliorare i tassi di completamento rapporti');
  }
  
  if (metrics.totalProducts < 100) {
    recommendations.push('Considerare l\'espansione del catalogo prodotti per aumentare le offerte di servizi');
  }

  // Generate trends
  trends.push('L\'azienda sembra essere in una fase di crescita attiva');
  trends.push('Buon equilibrio tra cantieri attivi e inattivi');

  return {
    insights: insights.length > 0 ? insights : ['I dati del dashboard mostrano operazioni aziendali consistenti'],
    recommendations: recommendations.length > 0 ? recommendations : ['Continuare a monitorare le metriche chiave per le opportunità di ottimizzazione'],
    trends: trends.length > 0 ? trends : ['Prestazioni aziendali costanti con potenziale di crescita'],
    summary: 'Il dashboard mostra metriche aziendali sane con spazio per l\'ottimizzazione nel completamento dei rapporti e nell\'espansione dei prodotti.',
    source: 'local'
  };
};

// Test endpoint to verify DeepSeek API connectivity
router.get('/test-deepseek', async (req, res) => {
  if (!DEEPSEEK_API_KEY) {
    return res.json({ 
      status: 'error', 
      message: 'No DeepSeek API key configured',
      source: 'local'
    });
  }

  try {
    console.log('🧪 Testing DeepSeek API connectivity...');
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Rispondi solo con "OK"'
          }
        ],
        max_tokens: 10,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;
    console.log('✅ DeepSeek API test successful:', aiResponse);
    
    res.json({ 
      status: 'success', 
      message: 'DeepSeek API is working',
      response: aiResponse,
      source: 'deepseek'
    });
    
  } catch (error) {
    console.error('❌ DeepSeek API test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    res.json({ 
      status: 'error', 
      message: 'DeepSeek API test failed',
      error: error.message,
      source: 'local'
    });
  }
});

// AI-powered dashboard analysis endpoint
router.post('/analyze-dashboard', async (req, res) => {
  try {
    const dashboardData = req.body;

    // Check if DeepSeek API is available
    if (!DEEPSEEK_API_KEY) {
      const localAnalysis = generateLocalAnalysis(dashboardData);
      return res.json(localAnalysis);
    }

    // Prepare concise prompt for DeepSeek
    const prompt = `Analizza questi dati del dashboard aziendale e fornisci:

1. **Approfondimenti Chiave** (3-4 punti): Analisi dei dati più significativi
2. **Raccomandazioni** (2-3 punti): Suggerimenti per migliorare le performance  
3. **Tendenze Aziendali** (2-3 punti): Pattern e direzioni identificati
4. **Riepilogo Esecutivo**: Sintesi in 1-2 frasi

Dati del Dashboard:
- Clienti: ${dashboardData.metrics.totalClients}
- Utenti: ${dashboardData.metrics.totalUsers} (Admin: ${Math.round(dashboardData.metrics.adminRatio * 100)}%)
- Prodotti: ${dashboardData.metrics.totalProducts}
- Prezzo Medio: €${dashboardData.metrics.averageProductPrice.toFixed(2)}
- Cantieri: ${dashboardData.metrics.totalWorksites} (Attivi: ${Math.round(dashboardData.metrics.activeWorksitesRatio * 100)}%)
- Rapporti: ${dashboardData.metrics.totalReports}
- Completamento: ${Math.round(dashboardData.metrics.completionRate * 100)}%

Rispondi in italiano, in formato JSON:
{
  "insights": ["insight1", "insight2"],
  "recommendations": ["rec1", "rec2"],
  "trends": ["trend1", "trend2"],
  "summary": "riepilogo"
}`;

    // Simple retry mechanism
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`🔄 Attempting DeepSeek API call (attempt ${attempt}/2)...`);
        
        const requestData = {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'Sei un analista aziendale esperto. Analizza i dati forniti e fornisci insights professionali e raccomandazioni concrete in italiano.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        };
        
        console.log(`📤 Request payload size: ${JSON.stringify(requestData).length} characters`);
        
        const response = await axios.post(
          DEEPSEEK_API_URL,
          requestData,
          {
            headers: {
              'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000, // 30 second timeout
          }
        );

        console.log(`✅ DeepSeek API response received (status: ${response.status})`);
        const aiResponse = response.data.choices[0]?.message?.content;
        
        if (aiResponse) {
          console.log(`📝 AI Response length: ${aiResponse.length} characters`);
          try {
            // Try to parse the AI response as JSON
            const parsedResponse = JSON.parse(aiResponse);
            
            // Validate the response structure
            if (parsedResponse.insights && parsedResponse.recommendations && 
                parsedResponse.trends && parsedResponse.summary) {
              
              console.log(`🎯 DeepSeek analysis successful, returning AI insights`);
              return res.json({
                ...parsedResponse,
                source: 'deepseek'
              });
            } else {
              console.log(`⚠️ DeepSeek response missing required fields, falling back to local analysis`);
            }
          } catch (parseError) {
            console.log(`⚠️ Failed to parse DeepSeek JSON response, trying markdown extraction...`);
            // If JSON parsing fails, try to extract content from markdown
            const markdownMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
            if (markdownMatch) {
              try {
                const jsonContent = markdownMatch[1];
                const parsedResponse = JSON.parse(jsonContent);
                
                if (parsedResponse.insights && parsedResponse.recommendations && 
                    parsedResponse.trends && parsedResponse.summary) {
                  
                  console.log(`🎯 DeepSeek analysis successful (from markdown), returning AI insights`);
                  return res.json({
                    ...parsedResponse,
                    source: 'deepseek'
                  });
                }
              } catch (markdownParseError) {
                console.log(`⚠️ Markdown extraction failed, falling back to local analysis`);
              }
            }
          }
        } else {
          console.log(`⚠️ No content in DeepSeek response, falling back to local analysis`);
        }
        
        // If we get here, parsing failed, break retry loop
        break;
        
      } catch (apiError) {
        lastError = apiError;
        
        // Better error handling for different types of errors
        if (apiError.code === 'ECONNRESET' || apiError.code === 'ECONNABORTED') {
          console.error(`❌ DeepSeek API connection error (attempt ${attempt}/2):`, apiError.code);
        } else if (apiError.response) {
          console.error(`❌ DeepSeek API response error (attempt ${attempt}/2):`, apiError.response.status, apiError.response.data);
        } else if (apiError.request) {
          console.error(`❌ DeepSeek API request error (attempt ${attempt}/2):`, apiError.message);
        } else {
          console.error(`❌ DeepSeek API error (attempt ${attempt}/2):`, apiError.message);
        }
        
        // If this is the last attempt, don't wait
        if (attempt < 2) {
          console.log(`⏳ Waiting 1 second before retry...`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
    }
    
    // If all attempts failed, fallback to local analysis
    console.log(`🔄 All DeepSeek attempts failed, using local analysis fallback`);
    const localAnalysis = generateLocalAnalysis(dashboardData);
    return res.json(localAnalysis);
    
  } catch (error) {
    console.error('Dashboard analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze dashboard',
      source: 'local'
    });
  }
});

export default router;
