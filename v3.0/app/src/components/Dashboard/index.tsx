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
  Divider,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useDocumentContext } from '../../state/documentContext';
import Loading from '../Loading';

// Styled Components for modern AI dashboard
const DashboardContainer = styled(Box)`
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
`;

const AICard = styled(Card)`
  border-radius: 16px !important;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.5) !important;
  }
`;

const GlowingButton = styled(Button)`
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
  border: none !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4) !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6) !important;
  }
  
  &:disabled {
    background: #ccc !important;
    box-shadow: none !important;
  }
`;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { getAllDocuments, allDocumentsData, loading } = useDocumentContext();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);

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
    if (!allDocumentsData?.length) return;
    
    setIsGenerating(true);
    
    try {
      // Make actual API call to generate DeepSeek analysis
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        setAiSummary('Authentication error: Please log in again');
        setIsGenerating(false);
        return;
      }
      
      console.log('Making AI analysis request with token:', token ? 'Token present' : 'No token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://sermixer.micro-cloud.it:12923/v3.0/api'}/ai/generate-analysis`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          console.error('Authentication failed');
          setAiSummary('Authentication error: Please log in again');
          setIsGenerating(false);
          return;
        }
        throw new Error(`Analysis generation failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const analysis = data.analysis;
      
      setAiSummary(analysis.summary);
      setAnalysisData(analysis.metrics);
      
      const now = new Date();
      setLastUpdated(now);
      localStorage.setItem('deepseek_summary', analysis.summary);
      localStorage.setItem('deepseek_analysis_data', JSON.stringify(analysis.metrics));
      localStorage.setItem('deepseek_last_summary', now.toISOString());
      
    } catch (error) {
      console.error('AI Summary generation failed:', error);
      // Fallback to mock data if API fails
      const totalDocs = allDocumentsData.length;
      const finalizedDocs = allDocumentsData.filter(doc => doc.status?.FINALIZED).length;
      const clients = new Set(allDocumentsData.map(doc => doc.data?.selectedClient?.email).filter(Boolean)).size;
      const completionRate = totalDocs > 0 ? (finalizedDocs / totalDocs) * 100 : 0;
      
      const fallbackSummary = `⚠️ API Analysis Unavailable - Showing Local Summary

Based on local analysis of ${totalDocs} documents across ${clients} clients:
• Completion rate: ${completionRate.toFixed(1)}%
• Finalized documents: ${finalizedDocs}
• Active clients: ${clients}

Note: Connect to DeepSeek API for advanced business insights and recommendations.`;

      setAiSummary(fallbackSummary);
      setAnalysisData({ totalDocs, finalizedDocs, clients, completionRate });
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
    <DashboardContainer>
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ 
              color: 'white', 
              fontSize: { xs: 28, md: 36 },
              background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              AI Business Insights
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: 16,
              mt: 1
            }}>
              Powered by DeepSeek AI • Generate analysis on demand
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              icon={<Schedule />}
              label={getLastUpdatedText()}
              sx={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontWeight: 600,
              }}
            />
            <GlowingButton
              variant="contained"
              startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <Refresh />}
              onClick={generateAISummary}
              disabled={isGenerating || !allDocumentsData?.length}
              sx={{
                color: 'white',
                fontWeight: 600,
                px: 3,
                py: 1,
                textTransform: 'none',
              }}
            >
              {isGenerating ? 'Analyzing...' : 'Refresh Analysis'}
            </GlowingButton>
          </Stack>
        </Stack>

        {/* AI Summary Card */}
        <AICard>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Box sx={{ 
                p: 2, 
                borderRadius: 2, 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Psychology sx={{ color: 'white', fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ color: '#333' }}>
                  Business Intelligence Summary
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  {lastUpdated 
                    ? `Last updated: ${lastUpdated.toLocaleDateString()} at ${lastUpdated.toLocaleTimeString()}`
                    : 'No analysis available yet'
                  }
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {aiSummary ? (
              <Box>
                <Typography variant="body1" sx={{ 
                  lineHeight: 1.8, 
                  color: '#444',
                  fontSize: 16,
                  whiteSpace: 'pre-line'
                }}>
                  {aiSummary}
                </Typography>
                
                {analysisData && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: '#555' }}>
                      Key Metrics Analyzed:
                    </Typography>
                    <Stack direction="row" spacing={3} flexWrap="wrap">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#667eea' }}>
                          {analysisData.totalDocs}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Total Documents
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#2e7d32' }}>
                          {analysisData.finalizedDocs}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Completed
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#ed6c02' }}>
                          {analysisData.clients}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Active Clients
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#9c27b0' }}>
                          {analysisData.completionRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          Success Rate
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Psychology sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                  No AI Analysis Available
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                  Click "Refresh Analysis" to generate your first business intelligence summary
                </Typography>
                {allDocumentsData?.length === 0 && (
                  <Typography variant="body2" sx={{ color: '#f44336' }}>
                    No documents found for analysis
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </AICard>
      </Box>
    </DashboardContainer>
  );
};

export default Dashboard;
