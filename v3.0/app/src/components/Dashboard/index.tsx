import {
  Psychology,
  Send
} from '@mui/icons-material';
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';

import styled from 'styled-components';
import { useDocumentContext } from '../../state/documentContext';
import { useFlashMessage } from '../../state/FlashMessageContext';
import Loading from '../Loading';

// Chat-specific container with 800px max width
const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

// Loading animation with three dots
const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  color: #6b7280;
  width: 100%;
  
  &::after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #6b7280;
    animation: loading 1.4s infinite both;
    margin-left: 8px;
  }
  
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #6b7280;
    animation: loading 1.4s infinite both;
    margin-right: 4px;
    animation-delay: -0.32s;
  }
  
  span::after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #6b7280;
    animation: loading 1.4s infinite both;
    margin-left: 4px;
    animation-delay: -0.16s;
    display: inline-block;
  }
  
  @keyframes loading {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

// Styled component for markdown content - GPT-like styling
const MarkdownContainer = styled.div`
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
  
  h1, h2, h3, h4, h5, h6 {
    color: #1f2937;
    margin: 1.5em 0 0.75em 0;
    font-weight: 600;
    line-height: 1.3;
  }
  
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.3em; }
  h3 { font-size: 1.2em; }
  h4 { font-size: 1.1em; }
  h5, h6 { font-size: 1em; }
  
  p {
    margin: 0.75em 0;
  }
  
  ul, ol {
    margin: 0.75em 0;
    padding-left: 1.5em;
  }
  
  li {
    margin: 0.25em 0;
  }
  
  strong {
    font-weight: 600;
    color: #1f2937;
  }
  
  em {
    font-style: italic;
    color: #4b5563;
  }
  
  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1.5em 0;
  }
  
  blockquote {
    border-left: 3px solid #2563eb;
    padding-left: 1em;
    margin: 1em 0;
    background: #f8fafc;
    padding: 0.75em 1em;
    border-radius: 4px;
    color: #4b5563;
  }
  
  code {
    background: #f1f5f9;
    padding: 0.125em 0.25em;
    border-radius: 3px;
    font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
    font-size: 0.875em;
    color: #1e293b;
  }
  
  pre {
    background: #f8fafc;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;
    border: 1px solid #e2e8f0;
  }
  
  pre code {
    background: none;
    padding: 0;
    color: #334155;
  }
  
  /* Tables */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  th, td {
    border: 1px solid #e5e7eb;
    padding: 0.5em 0.75em;
    text-align: left;
  }
  
  th {
    background: #f9fafb;
    font-weight: 600;
  }
`;

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { getAllDocuments, allDocumentsData, loading } = useDocumentContext();
  const { showMessage } = useFlashMessage();
  const [aiSummary, setAiSummary] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('products');
  const [question, setQuestion] = useState<string>('');

  const availableTopics = [
    { id: 'products', label: t('Products'), icon: '📦', description: t('Analyze product catalog and inventory') },
    { id: 'clients', label: t('Clients'), icon: '👥', description: t('Review client base and relationships') },
    { id: 'documents', label: t('Documents'), icon: '📄', description: t('Examine document workflow and status') }
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
      showMessage(t('Please enter a question to analyze'), 'error');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Make actual API call to generate DeepSeek analysis
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No authentication token found');
        showMessage(t('Authentication error: Please log in again'), 'error');
        setIsGenerating(false);
        return;
      }
      
      console.log('Making AI analysis request with token:', token ? 'Token present' : 'No token');
      console.log('Topic:', selectedTopic, 'Question:', question);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://sermixer.micro-cloud.it:12923/api'}/ai/generate-analysis`, {
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
          showMessage(t('Authentication error: Please log in again'), 'error');
          setIsGenerating(false);
          return;
        }
        
        if (response.status === 400) {
          const errorData = await response.json();
          showMessage(`${errorData.message}. ${errorData.suggestion || 'Try a different approach'}`, 'error');
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
      
      // Show success message
      showMessage(
        data.samplingInfo 
          ? `${t('Analysis completed using')} ${data.samplingInfo.analyzed} ${t('samples from')} ${data.samplingInfo.total} ${t('records')}`
          : t('Analysis completed successfully'),
        'success'
      );
      
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      showMessage(t('Failed to generate analysis. Please try again later.'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const getLastUpdatedText = () => {
    if (!lastUpdated) return t('Never updated');
    
    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesAgo = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursAgo === 0) {
      return minutesAgo === 0 ? t('Just now') : `${minutesAgo}m ${t('ago')}`;
    }
    
    return `${hoursAgo}h ${minutesAgo}m ${t('ago')}`;
  };

  if (loading && !allDocumentsData) {
    return <Loading />;
  }

  return (
    <ChatContainer>
      <Box sx={{ p: 2 }}>

      {/* Header - Clean */}
      <Typography variant="h5" sx={{ 
        fontWeight: 600, 
        color: '#1a1a1a',
        mb: 1,
        textAlign: 'center'
      }}>
        {t('AI Business Intelligence')}
      </Typography>
      <Typography variant="body1" sx={{ 
        color: '#666', 
        textAlign: 'center',
        mb: 3
      }}>
        {t('Powered by DeepSeek')}
      </Typography>

      {/* Clean Topic Selection */}
      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        {availableTopics.map((topic) => (
          <Chip
            key={topic.id}
            label={topic.label}
            onClick={() => setSelectedTopic(topic.id)}
            variant={selectedTopic === topic.id ? "filled" : "outlined"}
            size="small"
            sx={{
              backgroundColor: selectedTopic === topic.id ? '#2563eb' : 'transparent',
              color: selectedTopic === topic.id ? 'white' : '#666',
              borderColor: selectedTopic === topic.id ? '#2563eb' : '#d1d5db',
              '&:hover': {
                backgroundColor: selectedTopic === topic.id ? '#1d4ed8' : '#f3f4f6',
              }
            }}
          />
        ))}
      </Stack>

      {/* Clean Chat Input */}
      <Paper 
        elevation={0} 
        sx={{ 
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          mb: 3,
          '&:focus-within': {
            borderColor: '#2563eb',
            boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
          }
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          placeholder={`${t('Ask about your')} ${t(selectedTopic)}... (e.g., "${t('How many')} ${t(selectedTopic)} ${t('do we have?')}")`}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              generateAISummary();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={generateAISummary}
                  disabled={isGenerating || !question.trim()}
                  sx={{
                    color: question.trim() ? '#2563eb' : '#9ca3af',
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.1)'
                    }
                  }}
                >
                  {isGenerating ? <CircularProgress size={20} /> : <Send />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              border: 'none',
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              padding: '16px',
              fontSize: '14px',
              lineHeight: 1.5
            }
          }}
        />
      </Paper>

      {/* Chat Conversation */}
      {question && (
        <Box sx={{ mb: 2 }}>
          {/* User Message - Right */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Paper 
              elevation={0}
              sx={{ 
                backgroundColor: '#2563eb',
                color: 'white',
                p: 2,
                borderRadius: '18px 18px 4px 18px',
                maxWidth: '70%',
                wordWrap: 'break-word'
              }}
            >
              <Typography variant="body1">
                {question}
              </Typography>
            </Paper>
          </Box>

          {/* AI Response - Left */}
          {isGenerating ? (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  p: 2,
                  borderRadius: '18px 18px 18px 4px',
                  maxWidth: '70%'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Psychology sx={{ fontSize: 16, color: '#2563eb' }} />
                  <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 500 }}>
                    {t('Analyzing...')}
                  </Typography>
                </Stack>
                <LoadingDots>
                  <span>{t('Generating analysis')}</span>
                </LoadingDots>
              </Paper>
            </Box>
          ) : aiSummary && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  p: 2,
                  borderRadius: '18px 18px 18px 4px',
                  maxWidth: '70%'
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Psychology sx={{ fontSize: 16, color: '#2563eb' }} />
                  <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 500 }}>
                    {t('AI Assistant')}
                  </Typography>
                  {lastUpdated && (
                    <Typography variant="caption" sx={{ color: '#9ca3af', ml: 'auto' }}>
                      {getLastUpdatedText()}
                    </Typography>
                  )}
                </Stack>
                <MarkdownContainer>
                  <ReactMarkdown>{aiSummary}</ReactMarkdown>
                </MarkdownContainer>
              </Paper>
            </Box>
          )}
        </Box>
      )}

      {!aiSummary && !isGenerating && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          color: '#9ca3af'
        }}>
          <Psychology sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">
            {t('Select a topic and ask a question to get started')}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            {t('Tip: Press Cmd/Ctrl + Enter to submit')}
          </Typography>
        </Box>
      )}
      </Box>
    </ChatContainer>
  );
};

export default Dashboard;