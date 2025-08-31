import {
  Psychology,
  Refresh,
  Schedule
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useDocumentContext } from '../../state/documentContext';
import Loading from '../Loading';
import { WhitePaperContainer } from '../../pages/documents/styled-components';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { getAllDocuments, allDocumentsData, loading } = useDocumentContext();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('products');
  const [question, setQuestion] = useState<string>('');

  const availableTopics = [
    { id: 'products', label: 'Products', icon: '📦', description: 'Analyze product catalog and inventory' },
    { id: 'clients', label: 'Clients', icon: '👥', description: 'Review client base and relationships' },
    { id: 'documents', label: 'Documents', icon: '📄', description: 'Examine document workflow and status' }
  ];

  useEffect(() => { 
    getAllDocuments(); 
    // Load any existing analysis from localStorage
    const existingSummary = localStorage.getItem('deepseek_summary');
    const existingDate = localStorage.getItem('deepseek_last_summary');
    if (existingSummary) {
      setAiSummary(existingSummary);
      if (existingDate) {
        setLastUpdated(new Date(existingDate));
      }
    }
  }, [getAllDocuments]);

  const generateAISummary = async () => {
    if (!question.trim()) {
      setAiSummary('Please enter a question to analyze');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Make actual API call to generate DeepSeek analysis
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        setAiSummary('Authentication error: Please log in again');
        setIsGenerating(false);
        return;
      }
      
      console.log('Making AI analysis request with token:', token ? 'Token present' : 'No token');
      console.log('Topic:', selectedTopic, 'Question:', question);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://sermixer.micro-cloud.it:12923/v3.0/api'}/ai/generate-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: selectedTopic,
          question: question.trim()
        })
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.error('Authentication failed');
          setAiSummary('Authentication error: Please log in again');
          setIsGenerating(false);
          return;
        }
        
        if (response.status === 400) {
          const errorData = await response.json();
          setAiSummary(`Error: ${errorData.message}\n\nSuggestion: ${errorData.suggestion || 'Try a different approach'}`);
          setIsGenerating(false);
          return;
        }
        
        throw new Error(`Analysis generation failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const analysis = data.analysis;
      
      // Update UI with new analysis
      setAiSummary(analysis.summary);
      setAnalysisData(analysis.metrics || {});
      
      // Store in localStorage
      const now = new Date();
      setLastUpdated(now);
      localStorage.setItem('deepseek_summary', analysis.summary);
      localStorage.setItem('deepseek_analysis_data', JSON.stringify(analysis.metrics || {}));
      localStorage.setItem('deepseek_last_summary', now.toISOString());
      
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setAiSummary('Failed to generate analysis. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getLastUpdatedText = () => {
    if (!lastUpdated) return 'Never updated';
    
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesAgo = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursAgo === 0) {
      return minutesAgo === 0 ? 'Just now' : `${minutesAgo}m ago`;
    }
    
    return `${hoursAgo}h ${minutesAgo}m ago`;
  };

  if (loading && !allDocumentsData) {
    return <Loading />;
  }

  return (
    <WhitePaperContainer>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            fontSize: '2rem',
            color: '#333',
            mb: 1
          }}>
            🧠 AI Business Insights
          </Typography>
          <Typography variant="body1" sx={{ 
            color: '#666', 
            fontSize: '1rem'
          }}>
            Powered by DeepSeek AI • Generate analysis on demand
          </Typography>
        </Box>

        {/* Topic Selection */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#333', mb: 2, fontWeight: 600 }}>
            📊 Select Analysis Topic
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            {availableTopics.map((topic) => (
              <Chip
                key={topic.id}
                icon={<span style={{ fontSize: '16px' }}>{topic.icon}</span>}
                label={topic.label}
                onClick={() => setSelectedTopic(topic.id)}
                sx={{
                  background: selectedTopic === topic.id 
                    ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                    : '#f5f5f5',
                  color: selectedTopic === topic.id ? 'white' : '#333',
                  fontWeight: 600,
                  border: selectedTopic === topic.id ? '2px solid #667eea' : '1px solid #ddd',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: selectedTopic === topic.id 
                      ? 'linear-gradient(45deg, #667eea, #764ba2)' 
                      : '#e0e0e0',
                    transform: 'translateY(-2px)'
                  }
                }}
              />
            ))}
          </Stack>
          <Typography variant="body2" sx={{ color: '#777', fontSize: '0.9rem' }}>
            {availableTopics.find(t => t.id === selectedTopic)?.description}
          </Typography>
        </Box>

        {/* Question Input */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#333', mb: 2, fontWeight: 600 }}>
            ❓ Ask Your Question
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder={`e.g., "How many ${selectedTopic} do we have?" or "What are the trends in our ${selectedTopic}?"`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9f9f9',
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#bbb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                },
              },
            }}
          />
        </Box>

        {/* Action Bar */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Chip
            icon={<Schedule />}
            label={getLastUpdatedText()}
            sx={{
              backgroundColor: '#f0f0f0',
              color: '#666',
              fontWeight: 600,
            }}
          />
          <Button
            variant="contained"
            startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
            onClick={generateAISummary}
            disabled={isGenerating || !question.trim()}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
              }
            }}
          >
            {isGenerating ? 'Analyzing...' : 'Generate Analysis'}
          </Button>
        </Stack>

        {/* AI Summary Card */}
        <Card sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Psychology sx={{ fontSize: 28, color: '#667eea' }} />
              <Typography variant="h5" fontWeight={600} sx={{ color: '#333' }}>
                Business Intelligence Summary
              </Typography>
            </Stack>
            
            <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
            </Typography>
            
            {aiSummary ? (
              <Typography variant="body1" sx={{
                color: '#444',
                fontSize: 16,
                whiteSpace: 'pre-line'
              }}>
                {aiSummary}
              </Typography>
            ) : (
              <Typography variant="body1" sx={{ color: '#999', fontStyle: 'italic' }}>
                No analysis generated yet. Select a topic, ask a question, and click "Generate Analysis" to get started.
              </Typography>
            )}
            
            {analysisData && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#555' }}>
                  Key Metrics Analyzed:
                </Typography>
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#667eea' }}>
                      {analysisData.totalDocs || analysisData.totalProducts || analysisData.totalClients || 0}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Total Records
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight={700} sx={{ color: '#764ba2' }}>
                      {analysisData.completionRate || analysisData.categories || analysisData.growthRate || 0}%
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Key Metric
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </WhitePaperContainer>
  );
};

export default Dashboard;