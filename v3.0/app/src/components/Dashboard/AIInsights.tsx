import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  LightbulbOutlined,
  TrendingUpOutlined,
  RecommendOutlined,
  ExpandMore,
  ExpandLess,
  RefreshOutlined,
  PsychologyOutlined,
  SmartToyOutlined,
  Visibility
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface AIInalysis {
  insights: string[];
  recommendations: string[];
  trends: string[];
  summary: string;
  source: 'deepseek' | 'local';
}

interface DashboardMetrics {
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

interface AIInsightsProps {
  metrics: DashboardMetrics;
}

const AIInsights: React.FC<AIInsightsProps> = ({ metrics }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [analysis, setAnalysis] = useState<AIInalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false); // Changed to false to be collapsed by default
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  // Get cached analysis from localStorage
  const getCachedAnalysis = (): AIInalysis | null => {
    try {
      const cached = localStorage.getItem('dashboard-ai-analysis');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is still valid (24h)
        if (parsed.timestamp && (Date.now() - parsed.timestamp) < 24 * 60 * 60 * 1000) {
          setLastUpdate(new Date(parsed.timestamp));
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Failed to parse cached AI analysis:', error);
    }
    return null;
  };

  // Cache analysis in localStorage
  const cacheAnalysis = (data: AIInalysis) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem('dashboard-ai-analysis', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache AI analysis:', error);
    }
  };

  // Fetch AI analysis from backend
  const fetchAIAnalysis = async () => {
    // First, always try to get cached analysis
    const cached = getCachedAnalysis();
    if (cached) {
      console.log('Using cached AI analysis (valid for 24h)');
      setAnalysis(cached);
      setError(null);
      return;
    }

    console.log('No valid cache found, fetching fresh analysis...');
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching AI analysis from backend...');
      console.log('Request URL:', '/api/ai/analyze-dashboard');
      console.log('Request payload:', metrics);
      
      const response = await fetch('/api/ai/analyze-dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ metrics }),
      });

      console.log('Backend response status:', response.status);
      console.log('Backend response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AIInalysis = await response.json();
      console.log('Backend response data:', data);
      
      if (!data || !data.summary) {
        throw new Error('Invalid response data from backend');
      }

      setAnalysis(data);
      setLastUpdate(new Date());
      cacheAnalysis(data);
      
      console.log(`Using ${data.source === 'deepseek' ? 'DeepSeek AI' : 'local'} analysis for dashboard`);
      
    } catch (error) {
      console.error('Failed to fetch AI analysis from backend:', error);
      console.log('Falling back to local analysis...');
      
      // Generate local analysis as fallback
      const localAnalysis = generateLocalAnalysis(metrics);
      setAnalysis(localAnalysis);
      setLastUpdate(new Date());
      cacheAnalysis(localAnalysis);
      
      // Show more informative error message
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setError('Backend endpoint not available - Using local analysis');
      } else if (error instanceof Error && error.message.includes('HTTP error')) {
        setError(`Backend error ${error.message} - Using local analysis`);
      } else {
        setError('Backend unavailable - Using local analysis');
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate local analysis when backend fails
  const generateLocalAnalysis = (metrics: DashboardMetrics): AIInalysis => {
    const completionRate = metrics.completionRate || 0;
    const totalClients = metrics.totalClients || 0;
    const totalProducts = metrics.totalProducts || 0;

    const insights = [
      `You have ${totalClients} active clients with a document completion rate of ${completionRate.toFixed(1)}%`,
      `Total products in your catalog: ${totalProducts}`,
      `Document completion rate of ${completionRate.toFixed(1)}% indicates ${completionRate > 80 ? 'excellent' : completionRate > 60 ? 'good' : 'room for improvement'} workflow efficiency`
    ];

    const recommendations = [
      completionRate < 80 ? 'Focus on improving document completion rates through better follow-up processes' : 'Maintain your excellent completion rate with current processes',
      totalClients < 10 ? 'Consider expanding your client base through marketing and networking' : 'Your client base is healthy - focus on retention and upselling',
      totalProducts < 50 ? 'Expand your product catalog to offer more options to clients' : 'Your product catalog is comprehensive - focus on optimization'
    ];

    const trends = [
      'Business metrics show steady growth in client acquisition',
      'Product diversity supports revenue diversification',
      'Document workflow efficiency impacts overall business performance'
    ];

    const summary = `Your dashboard shows ${totalClients} active clients with a ${completionRate.toFixed(1)}% document completion rate. ${totalProducts} products in your catalog provide good diversification. ${completionRate > 80 ? 'Excellent workflow efficiency' : 'Consider optimizing document processes'} to improve completion rates.`;

    return {
      insights,
      recommendations,
      trends,
      summary,
      source: 'local'
    };
  };

  // Load analysis on component mount
  useEffect(() => {
    fetchAIAnalysis();
  }, []);

  // Test if backend endpoint exists
  const testBackendEndpoint = async () => {
    try {
      console.log('Testing backend endpoint availability...');
      const response = await fetch('/api/ai/analyze-dashboard', {
        method: 'OPTIONS',
      });
      console.log('Backend endpoint test response:', response.status);
      return response.status !== 404;
    } catch (error) {
      console.log('Backend endpoint test failed:', error);
      return false;
    }
  };

  // Refresh analysis manually (respects cache)
  const handleRefresh = async () => {
    console.log('Manual refresh requested...');
    
    // Check cache first
    const cached = getCachedAnalysis();
    if (cached) {
      console.log('Cache is still valid, using cached analysis');
      setAnalysis(cached);
      setError(null);
      return;
    }
    
    // Cache expired, fetch fresh analysis
    console.log('Cache expired, fetching fresh analysis...');
    fetchAIAnalysis();
  };

  // Force refresh - bypass cache completely
  const handleForceRefresh = () => {
    console.log('Force refresh requested - bypassing cache...');
    localStorage.removeItem('dashboard-ai-analysis');
    setLastUpdate(null);
    setAnalysis(null);
    fetchAIAnalysis();
  };

  // Toggle popup
  const handleTogglePopup = () => {
    setPopupOpen(!popupOpen);
  };

  if (loading && !analysis) {
    return (
      <StyledCard>
        <CardContent sx={{ py: 2, px: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6" component="h3">
              🤖 {t('AI Insights')}
            </Typography>
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
        </CardContent>
      </StyledCard>
    );
  }

  if (error && !analysis) {
    return (
      <StyledCard>
        <CardContent sx={{ py: 2, px: 2 }}>
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
          <Button 
            variant="outlined" 
            onClick={handleRefresh}
            startIcon={<RefreshOutlined />}
            size="small"
          >
            {t('Retry')}
          </Button>
        </CardContent>
      </StyledCard>
    );
  }

  if (!analysis) {
    return null;
  }

  const getSourceIcon = () => {
    return analysis.source === 'deepseek' ? <SmartToyOutlined /> : <PsychologyOutlined />;
  };

  const getSourceColor = () => {
    return analysis.source === 'deepseek' ? 'primary' : 'default';
  };

  const getSourceLabel = () => {
    return analysis.source === 'deepseek' ? 'DeepSeek AI' : 'Local Analysis';
  };

  return (
    <>
      <StyledCard>
        <CardContent sx={{ py: 1.5, px: 1.5 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="subtitle1" component="h3" sx={{ fontSize: '1rem' }}>
                🤖 {t('AI Insights')}
              </Typography>
              <Tooltip title={getSourceLabel()}>
                <Chip
                  icon={getSourceIcon()}
                  label={getSourceLabel()}
                  size="small"
                  color={getSourceColor()}
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Tooltip>
            </Box>
            
            <Box display="flex" alignItems="center" gap={0.5}>
              {lastUpdate && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  {t('Updated')}: {lastUpdate.toLocaleTimeString()}
                </Typography>
              )}
              <IconButton
                size="small"
                onClick={handleRefresh}
                title={t('Refresh analysis')}
                sx={{ width: 24, height: 24 }}
              >
                <RefreshOutlined fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleForceRefresh}
                title={t('Force refresh - bypass cache')}
                color="secondary"
                sx={{ width: 24, height: 24 }}
              >
                <RefreshOutlined fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleTogglePopup}
                title={t('View detailed insights')}
                color="primary"
                sx={{ width: 24, height: 24 }}
              >
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setExpanded(!expanded)}
                title={expanded ? t('Collapse') : t('Expand')}
                sx={{ width: 24, height: 24 }}
              >
                {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </IconButton>
            </Box>
          </Box>

          {/* Summary */}
          <Typography variant="body2" color="text.secondary" mb={1} sx={{ lineHeight: 1.4, fontSize: '0.8rem' }}>
            {analysis.summary}
          </Typography>

          <Collapse in={expanded}>
            {/* Insights */}
            <AnalysisSection
              title={t('Key Insights')}
              icon={<LightbulbOutlined />}
              items={analysis.insights}
              color="primary"
            />

            {/* Recommendations */}
            <AnalysisSection
              title={t('Recommendations')}
              icon={<RecommendOutlined />}
              items={analysis.recommendations}
              color="success"
            />

            {/* Trends */}
            <AnalysisSection
              title={t('Business Trends')}
              icon={<TrendingUpOutlined />}
              items={analysis.trends}
              color="info"
            />
          </Collapse>

          {/* Footer */}
          <Box mt={1} pt={1} borderTop="1px solid" borderColor="divider">
            <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ fontSize: '0.7rem' }}>
              {analysis.source === 'deepseek' 
                ? t('Powered by DeepSeek AI - Analysis cached for 24 hours')
                : t('Local analysis - Refresh to try AI-powered insights')
              }
            </Typography>
          </Box>
        </CardContent>
      </StyledCard>

      {/* Detailed Insights Popup */}
      <Dialog 
        open={popupOpen} 
        onClose={handleTogglePopup}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            🤖 {t('AI Insights - Detailed Analysis')}
            <Tooltip title={getSourceLabel()}>
              <Chip
                icon={getSourceIcon()}
                label={getSourceLabel()}
                size="small"
                color={getSourceColor()}
                variant="outlined"
              />
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {/* Summary */}
          <Box mb={3}>
            <Typography variant="h6" gutterBottom color="primary">
              {t('Executive Summary')}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {analysis.summary}
            </Typography>
          </Box>

          {/* Insights */}
          <AnalysisSection
            title={t('Key Insights')}
            icon={<LightbulbOutlined />}
            items={analysis.insights}
            color="primary"
          />

          {/* Recommendations */}
          <AnalysisSection
            title={t('Recommendations')}
            icon={<RecommendOutlined />}
            items={analysis.recommendations}
            color="success"
          />

          {/* Trends */}
          <AnalysisSection
            title={t('Business Trends')}
            icon={<TrendingUpOutlined />}
            items={analysis.trends}
            color="info"
          />

          {/* Footer */}
          <Box mt={3} pt={2} borderTop="1px solid" borderColor="divider">
            <Typography variant="caption" color="text.secondary" align="center" display="block">
              {analysis.source === 'deepseek' 
                ? t('Powered by DeepSeek AI - Analysis cached for 24 hours')
                : t('Local analysis - Refresh to try AI-powered insights')
              }
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTogglePopup} color="primary">
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Analysis Section Component
const AnalysisSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  items: string[];
  color: 'primary' | 'success' | 'info';
}> = ({ title, icon, items, color }) => (
  <Box mb={1}>
    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
      <Box color={`${color}.main`}>
        {icon}
      </Box>
      <Typography variant="caption" fontWeight="medium" sx={{ fontSize: '0.8rem' }}>
        {title}
      </Typography>
    </Box>
    <List dense sx={{ py: 0 }}>
      {items.map((item, index) => (
        <ListItem key={index} sx={{ py: 0.125, px: 0 }}>
          <ListItemIcon sx={{ minWidth: 12 }}>
            <Box
              width={3}
              height={3}
              borderRadius="50%"
              bgcolor={`${color}.main`}
            />
          </ListItemIcon>
          <ListItemText
            primary={item}
            primaryTypographyProps={{
              variant: 'caption',
              color: 'text.secondary',
              lineHeight: 1.2,
              fontSize: '0.75rem'
            }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

// Styled Components
const StyledCard = styled(Card)`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.2s ease;
  }
`;

export default AIInsights;
