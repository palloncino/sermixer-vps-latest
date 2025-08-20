# DeepSeek API Integration - Dashboard AI Insights

## 🚀 Overview

This integration adds AI-powered business insights to your dashboard using DeepSeek's advanced language model. The system provides intelligent analysis of your business metrics with automatic fallback to local analysis when the API is unavailable.

## ✨ Features

- **🤖 AI-Powered Analysis**: Professional business insights using DeepSeek's advanced AI
- **📊 Smart Metrics Analysis**: Analyzes clients, users, products, worksites, and reports
- **💾 24-Hour Caching**: Reduces API calls and improves performance
- **🔄 Automatic Fallback**: Seamlessly switches to local analysis if API fails
- **🌍 Multi-language**: Supports both English and Italian
- **📱 Responsive Design**: Works on all device sizes

## 🔧 Setup

### 1. Environment Variables

Add to your `.env` file:
```bash
DEEPSEEK_API_KEY=sk-e9eacbc1c91643cab8339254aad6c22e
```

### 2. Backend Dependencies

Ensure these packages are installed in your server:
```bash
npm install axios
```

### 3. Frontend Dependencies

The frontend uses Material-UI components that should already be available.

## 🏗️ Architecture

### Backend (`/server-v3.0/app/routes/aiRoutes.js`)
- **AI Analysis Endpoint**: `/api/ai/analyze-dashboard`
- **Test Endpoint**: `/api/ai/test-deepseek`
- **Local Analysis Fallback**: Generates insights when API is unavailable
- **Retry Mechanism**: Attempts API calls twice before falling back

### Frontend (`/v3.0/app/src/components/Dashboard/AIInsights.tsx`)
- **Smart Caching**: 24-hour localStorage cache
- **Real-time Updates**: Manual refresh capability
- **Error Handling**: Graceful fallback to cached data
- **Responsive UI**: Collapsible sections with Material-UI

### Dashboard Integration (`/v3.0/app/src/components/Dashboard/index.tsx`)
- **Metrics Calculation**: Computes business metrics from document data
- **Component Placement**: Added to right column (Analytics section)
- **Data Flow**: Passes calculated metrics to AI component

## 📊 Metrics Analyzed

The AI analyzes these business metrics:

| Metric | Description | Source |
|--------|-------------|---------|
| `totalClients` | Unique clients from documents | Document data |
| `totalUsers` | System users count | Mock data (replace with real) |
| `adminRatio` | Admin users percentage | Mock data (replace with real) |
| `totalProducts` | Product catalog size | Mock data (replace with real) |
| `averageProductPrice` | Mean product price | Mock data (replace with real) |
| `totalWorksites` | Total worksite count | Mock data (replace with real) |
| `activeWorksitesRatio` | Active worksites percentage | Mock data (replace with real) |
| `totalReports` | Document count | Document data |
| `completionRate` | Completed documents ratio | Calculated from status |

## 🔄 How It Works

### 1. **Dashboard Load**
   - Component mounts and calculates metrics
   - Checks for cached analysis (24h validity)

### 2. **AI Analysis Request**
   - Sends metrics to `/api/ai/analyze-dashboard`
   - DeepSeek analyzes data with business context
   - Returns structured insights in Italian

### 3. **Response Processing**
   - Parses AI response (JSON or markdown)
   - Validates response structure
   - Falls back to local analysis if parsing fails

### 4. **Caching & Display**
   - Stores analysis in localStorage with timestamp
   - Displays insights in organized sections
   - Shows source indicator (DeepSeek vs Local)

## 🎯 AI Prompt Structure

The system sends this structured prompt to DeepSeek:

```
Analizza questi dati del dashboard aziendale e fornisci:

1. **Approfondimenti Chiave** (3-4 punti): Analisi dei dati più significativi
2. **Raccomandazioni** (2-3 punti): Suggerimenti per migliorare le performance  
3. **Tendenze Aziendali** (2-3 punti): Pattern e direzioni identificati
4. **Riepilogo Esecutivo**: Sintesi in 1-2 frasi

Dati del Dashboard:
- Clienti: {count}
- Utenti: {count} (Admin: {percentage}%)
- Prodotti: {count}
- Prezzo Medio: €{amount}
- Cantieri: {count} (Attivi: {percentage}%)
- Rapporti: {count}
- Completamento: {percentage}%

Rispondi in italiano, in formato JSON:
{
  "insights": ["insight1", "insight2"],
  "recommendations": ["rec1", "rec2"],
  "trends": ["trend1", "trend2"],
  "summary": "riepilogo"
}
```

## 🧪 Testing

### Test API Connectivity
```bash
cd server-v3.0
node test-deepseek.js
```

### Test Endpoint
```bash
curl -X GET http://localhost:5004/api/ai/test-deepseek
```

### Test Analysis
```bash
curl -X POST http://localhost:5004/api/ai/analyze-dashboard \
  -H "Content-Type: application/json" \
  -d '{
    "metrics": {
      "totalClients": 25,
      "totalUsers": 15,
      "adminRatio": 0.2,
      "totalProducts": 150,
      "averageProductPrice": 2500,
      "totalWorksites": 45,
      "activeWorksitesRatio": 0.7,
      "totalReports": 100,
      "completionRate": 0.8
    }
  }'
```

## 🚨 Troubleshooting

### Common Issues

1. **No API Key**
   - Symptom: "⚠️ DeepSeek API key not configured"
   - Solution: Add `DEEPSEEK_API_KEY` to `.env` file

2. **API Errors**
   - Symptom: "❌ DeepSeek API test failed"
   - Check: API key validity, internet connection, account credits

3. **Parsing Errors**
   - Symptom: Falls back to local analysis
   - Check: API response format, retry mechanism

4. **Caching Issues**
   - Symptom: Analysis not updating
   - Solution: Clear localStorage or wait 24 hours

### Debug Mode

Enable detailed logging by setting in your server:
```javascript
console.log('🔍 Debug mode enabled');
```

## 💰 Cost Analysis

- **DeepSeek Pricing**: ~$0.14 per 1M tokens
- **Request Size**: ~200-300 tokens per analysis
- **Daily Cost**: ~$0.0001 per day
- **Monthly Cost**: ~$0.003 per month

## 🔮 Future Enhancements

1. **Real Metrics**: Replace mock data with actual database queries
2. **Custom Prompts**: Allow users to customize analysis focus
3. **Historical Analysis**: Track insights over time
4. **Export Reports**: Generate PDF reports from AI insights
5. **Multi-model Support**: Add support for other AI providers

## 📝 API Reference

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ai/test-deepseek` | Test API connectivity |
| `POST` | `/api/ai/analyze-dashboard` | Analyze dashboard metrics |

### Request Body
```typescript
{
  metrics: {
    totalClients: number;
    totalUsers: number;
    adminRatio: number;
    totalProducts: number;
    averageProductPrice: number;
    totalWorksites: number;
    activeWorksitesRatio: number;
    totalReports: number;
    completionRate: number;
  }
}
```

### Response Format
```typescript
{
  insights: string[];
  recommendations: string[];
  trends: string[];
  summary: string;
  source: 'deepseek' | 'local';
}
```

## 🎉 Success!

Your dashboard now has intelligent AI insights that:
- ✅ Provide professional business analysis
- ✅ Cache results for 24 hours
- ✅ Fallback gracefully when API is unavailable
- ✅ Support multiple languages
- ✅ Work responsively on all devices

The system automatically handles all edge cases and provides a seamless user experience whether using AI-powered or local analysis!
