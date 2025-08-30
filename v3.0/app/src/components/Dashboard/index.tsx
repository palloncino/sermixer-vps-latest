import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Button,
  Stack,
  useTheme,
  Tooltip,
  Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Description,
  TrendingUp,
  People,
  AttachMoney,
  Add,
  ShoppingCart,
  Business,
  Assessment,
  Speed,
  ArrowForward,
  PlayArrow,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useDocumentContext } from '../../state/documentContext';
import { ROUTES } from '../../constants/routes';
import RecentActivity from './RecentActivity';
import Loading from '../Loading';

// Styled Components for ultra-compact design
const DashboardContainer = styled(Box)`
  padding: 16px;
  background: #fafafa;
  min-height: 100vh;
`;

const CompactCard = styled(Card)`
  border-radius: 8px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease !important;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.12) !important;
  }
`;

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  trend?: number;
}> = ({ icon, label, value, color, trend }) => (
  <CompactCard>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar sx={{ bgcolor: color, width: 24, height: 24, '& .MuiSvgIcon-root': { fontSize: 14 } }}>
          {icon}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2, color: '#333' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11, color: '#666', lineHeight: 1 }}>
            {label}
          </Typography>
        </Box>
        {trend && (
          <Chip
            size="small"
            label={`${trend > 0 ? '+' : ''}${trend}%`}
            sx={{
              height: 20,
              fontSize: 10,
              bgcolor: trend > 0 ? '#e8f5e8' : '#fce8e8',
              color: trend > 0 ? '#2d7d2d' : '#d32f2f',
              '& .MuiChip-label': { px: 1 }
            }}
          />
        )}
      </Stack>
    </CardContent>
  </CompactCard>
);

const QuickAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}> = ({ icon, label, onClick, color = '#1976d2' }) => (
  <Tooltip title={label}>
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        minWidth: 'auto',
        p: 1,
        borderRadius: 2,
        borderColor: '#e0e0e0',
        color: color,
        '&:hover': {
          borderColor: color,
          bgcolor: alpha(color, 0.05),
        },
        flexDirection: 'column',
        gap: 0.5,
        height: 64,
        width: '100%',
      }}
    >
      <Avatar sx={{ bgcolor: alpha(color, 0.1), color, width: 28, height: 28 }}>
        {icon}
      </Avatar>
      <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 600, textTransform: 'none' }}>
        {label}
      </Typography>
    </Button>
  </Tooltip>
);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAllDocuments, allDocumentsData, loading } = useDocumentContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => { getAllDocuments(); }, [getAllDocuments]);

  const metrics = useMemo(() => {
    if (!allDocumentsData) return null;
    const totalDocuments = allDocumentsData.length;
    const finalizedDocs = allDocumentsData.filter(doc => doc.status?.FINALIZED).length;
    const completionRate = totalDocuments > 0 ? (finalizedDocs / totalDocuments) * 100 : 0;
    const uniqueClients = new Set(allDocumentsData.map(doc => doc.data?.selectedClient?.email).filter(Boolean)).size;

    return {
      totalDocuments,
      finalizedDocs,
      uniqueClients,
      completionRate,
      pendingDocs: totalDocuments - finalizedDocs,
    };
  }, [allDocumentsData]);

  if (loading || !allDocumentsData) {
    return <Loading />;
  }

  const recentDocs = allDocumentsData.slice(0, 6);

  return (
    <DashboardContainer>
      {/* Header with Title and Quick Access */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: '#333', fontSize: 20 }}>
            {t('Dashboard')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', fontSize: 12 }}>
            {t('Welcome back! Here\'s what\'s happening.')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(ROUTES.createDocument())}
            sx={{
              bgcolor: '#1976d2',
              fontSize: 12,
              py: 0.5,
              px: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('New Document')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowForward />}
            onClick={() => navigate(ROUTES.documentsList())}
            sx={{
              fontSize: 12,
              py: 0.5,
              px: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {t('View All')}
          </Button>
        </Stack>
      </Stack>

      {/* Compact Metrics Row */}
      <Grid container spacing={1.5} mb={2}>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<Description />}
            label={t('Total Documents')}
            value={metrics?.totalDocuments ?? 0}
            color="#1976d2"
            trend={12}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<TrendingUp />}
            label={t('Finalized')}
            value={metrics?.finalizedDocs ?? 0}
            color="#2e7d32"
            trend={8}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<People />}
            label={t('Clients')}
            value={metrics?.uniqueClients ?? 0}
            color="#ed6c02"
            trend={-2}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<Speed />}
            label={t('Completion Rate')}
            value={`${metrics?.completionRate.toFixed(0) ?? '0'}%`}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Quick Actions - Ultra Compact */}
        <Grid item xs={12} md={3}>
          <CompactCard>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5} sx={{ fontSize: 14, color: '#333' }}>
                {t('Quick Actions')}
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <QuickAction
                    icon={<Add />}
                    label={t('Document')}
                    onClick={() => navigate(ROUTES.createDocument())}
                    color="#1976d2"
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickAction
                    icon={<Business />}
                    label={t('Client')}
                    onClick={() => navigate(ROUTES.createClient())}
                    color="#2e7d32"
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickAction
                    icon={<ShoppingCart />}
                    label={t('Product')}
                    onClick={() => navigate(ROUTES.createProduct())}
                    color="#ed6c02"
                  />
                </Grid>
                <Grid item xs={6}>
                  <QuickAction
                    icon={<Assessment />}
                    label={t('Reports')}
                    onClick={() => navigate(ROUTES.documentsList())}
                    color="#9c27b0"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </CompactCard>
        </Grid>

        {/* Recent Activity - Compact */}
        <Grid item xs={12} md={9}>
          <CompactCard>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14, color: '#333' }}>
                    {t('Recent Activity')}
                  </Typography>
                  <Tooltip title={t('View All Documents')}>
                    <IconButton 
                      size="small"
                      onClick={() => navigate(ROUTES.documentsList())}
                      sx={{ color: '#666' }}
                    >
                      <ArrowForward fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <RecentActivity documents={recentDocs} />
              </Box>
            </CardContent>
          </CompactCard>
        </Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
