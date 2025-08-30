import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
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
  useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Description,
  TrendingUp,
  People,
  AttachMoney,
  Dashboard as DashboardIcon,
  Add,
  ShoppingCart,
  Business,
  Assessment,
  Speed,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useDocumentContext } from '../../state/documentContext';
import { ROUTES } from '../../constants/routes';
import RecentActivity from './RecentActivity';
import AIInsights from './AIInsights';
import Loading from '../Loading';

/**
 * Elegant, compact MUI dashboard with:
 * - Clean white container with subtle shadow
 * - Consistent cards (no hard-coded hex colors)
 * - Tight spacing & clean typography
 * - Reusable MetricCard & ActionListItem components
 * Drop-in replacement for your current Dashboard component.
 */

const MetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: 'primary' | 'success' | 'warning' | 'info';
  progress?: number; // 0..100
}> = ({ icon, label, value, accent = 'primary', progress }) => {
  const theme = useTheme();
  const palette = {
    primary: theme.palette.primary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    info: theme.palette.info,
  }[accent];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
        boxShadow: `0 1px 4px ${alpha(theme.palette.common.black, 0.04)}`,
        transition: 'transform 120ms ease',
        backgroundColor: theme.palette.background.paper,
        '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 3px 12px ${alpha(theme.palette.common.black, 0.08)}` },
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
          <Box>
            <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1, fontSize: '1.125rem' }}>
              {value}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
              {label}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: alpha(palette.main, 0.15), color: palette.main, width: 32, height: 32 }}>
            {icon}
          </Avatar>
        </Stack>
        {typeof progress === 'number' && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 4, borderRadius: 2, backgroundColor: alpha(palette.main, 0.12), '& .MuiLinearProgress-bar': { backgroundColor: palette.main } }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const ActionListItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick?: () => void;
}> = ({ icon, title, subtitle, onClick }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        p: 1,
        borderRadius: 1,
        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        backgroundColor: theme.palette.background.paper,
        transition: 'all 120ms ease',
        '&:hover': { 
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          borderColor: theme.palette.primary.main,
          transform: 'translateX(2px)'
        },
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        minHeight: 48,
      }}
    >
      <Avatar sx={{ 
        bgcolor: alpha(theme.palette.primary.main, 0.1), 
        color: theme.palette.primary.main, 
        width: 28, 
        height: 28 
      }}>
        {icon}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', lineHeight: 1.1 }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const { getAllDocuments, allDocumentsData, loading, error } = useDocumentContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  useEffect(() => { getAllDocuments(); }, [getAllDocuments]);

  const metrics = useMemo(() => {
    if (!allDocumentsData) return null;
    const totalDocuments = allDocumentsData.length;
    const completedDocuments = allDocumentsData.filter(doc => doc.status && Object.values(doc.status).some(s => s === 'COMPLETED')).length;
    const completionRate = totalDocuments > 0 ? (completedDocuments / totalDocuments) * 100 : 0;

    return {
      totalDocuments,
      totalClients: allDocumentsData.filter((doc, idx, arr) => arr.findIndex(d => d.data?.selectedClient?.id === doc.data?.selectedClient?.id) === idx).length,
      totalRevenue: 125000,
      completionRate,
    };
  }, [allDocumentsData]);

  // Navigation handlers for quick actions
  const handleNewDocument = () => {
    navigate(ROUTES.createDocument());
  };

  const handleManageProducts = () => {
    navigate(ROUTES.productList());
  };

  const handleManageClients = () => {
    navigate(ROUTES.clientsList());
  };

  const handleViewReports = () => {
    navigate(ROUTES.documentsList());
  };

  if (loading || !allDocumentsData || (error && !allDocumentsData)) {
    return <Loading />;
  }

  const pagedDocs = allDocumentsData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.default, 
      borderRadius: 8,
    }}>
      <Container maxWidth="xl" sx={{ 
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        p: 3,
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {metrics && (
            <Box mb={2}>
              <AIInsights metrics={{
                totalClients: metrics.totalClients,
                totalUsers: 25,
                adminRatio: 0.2,
                totalProducts: 150,
                averageProductPrice: 2500,
                totalWorksites: 45,
                activeWorksitesRatio: 0.7,
                totalReports: metrics.totalDocuments,
                completionRate: metrics.completionRate,
              }} />
            </Box>
          )}

          {/* Metrics */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<Description fontSize="small" />} label={t('Total Documents')} value={metrics?.totalDocuments ?? 0} accent="info" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<TrendingUp fontSize="small" />} label={t('Completion Rate')} value={`${metrics?.completionRate.toFixed(1) ?? '0.0'}%`} accent="success" progress={metrics?.completionRate ?? 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<People fontSize="small" />} label={t('Active Clients')} value={metrics?.totalClients ?? 0} accent="primary" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard icon={<AttachMoney fontSize="small" />} label={t('Total Revenue')} value={`€${(metrics?.totalRevenue ?? 0).toLocaleString()}`} accent="warning" />
            </Grid>
          </Grid>

          {/* Actions + Recent */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box mb={1.5} display="flex" alignItems="center" gap={1}>
                <Speed color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1rem', color: theme.palette.text.primary }}>{t('Quick Actions')}</Typography>
              </Box>
              
              {/* Documents Group */}
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="primary" mb={1} sx={{ fontSize: '0.8rem' }}>
                  📄 {t('Documents')}
                </Typography>
                <Stack spacing={0.75}>
                  <ActionListItem 
                    icon={<Add />} 
                    title={t('New Document')} 
                    subtitle={t('Create quote or invoice')} 
                    onClick={handleNewDocument}
                    data-testid="quick-action-new-document"
                  />
                  <ActionListItem 
                    icon={<Description />} 
                    title={t('Documents List')} 
                    subtitle={t('View all documents')} 
                    onClick={() => navigate(ROUTES.documentsList())}
                    data-testid="quick-action-documents-list"
                  />
                </Stack>
              </Box>

              {/* Clients Group */}
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="primary" mb={1} sx={{ fontSize: '0.8rem' }}>
                  👥 {t('Clients')}
                </Typography>
                <Stack spacing={0.75}>
                  <ActionListItem 
                    icon={<Business />} 
                    title={t('Clients List')} 
                    subtitle={t('View client database')} 
                    onClick={handleManageClients}
                    data-testid="quick-action-clients-list"
                  />
                  <ActionListItem 
                    icon={<Add />} 
                    title={t('Create Client')} 
                    subtitle={t('Add new client')} 
                    onClick={() => navigate(ROUTES.createClient())}
                    data-testid="quick-action-create-client"
                  />
                </Stack>
              </Box>

              {/* Products Group */}
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="primary" mb={1} sx={{ fontSize: '0.8rem' }}>
                  🛍️ {t('Products')}
                </Typography>
                <Stack spacing={0.75}>
                  <ActionListItem 
                    icon={<ShoppingCart />} 
                    title={t('Products List')} 
                    subtitle={t('View all products')} 
                    onClick={handleManageProducts}
                    data-testid="quick-action-products-list"
                  />
                  <ActionListItem 
                    icon={<Add />} 
                    title={t('Create Product')} 
                    subtitle={t('Add new product')} 
                    onClick={() => navigate(ROUTES.createProduct())}
                    data-testid="quick-action-create-product"
                  />
                </Stack>
              </Box>

              {/* Users Group */}
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="primary" mb={1} sx={{ fontSize: '0.8rem' }}>
                  👤 {t('Users')}
                </Typography>
                <Stack spacing={0.75}>
                  <ActionListItem 
                    icon={<People />} 
                    title={t('Users List')} 
                    subtitle={t('Manage user accounts')} 
                    onClick={() => navigate(ROUTES.usersList())}
                    data-testid="quick-action-users-list"
                  />
                  <ActionListItem 
                    icon={<Add />} 
                    title={t('Create User')} 
                    subtitle={t('Add new user')} 
                    onClick={() => navigate(ROUTES.createUser())}
                    data-testid="quick-action-create-user"
                  />
                </Stack>
              </Box>

              {/* Reports Group */}
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={600} color="primary" mb={1} sx={{ fontSize: '0.8rem' }}>
                  📊 {t('Reports')}
                </Typography>
                <Stack spacing={0.75}>
                  <ActionListItem 
                    icon={<Assessment />} 
                    title={t('View Reports')} 
                    subtitle={t('Analytics & insights')} 
                    onClick={handleViewReports}
                    data-testid="quick-action-view-reports"
                  />
                </Stack>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box mb={1.5} display="flex" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" gap={1}>
                  <DashboardIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: '1rem', color: theme.palette.text.primary }}>{t('Recent Activity')}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {t('Showing')} {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, allDocumentsData.length)} {t('of')} {allDocumentsData.length}
                  </Typography>
                  <Stack direction="row" spacing={0.25}>
                    <IconButton size="small" disabled={page === 0} onClick={() => setPage(p => p - 1)} sx={{ width: 24, height: 24 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>←</Typography>
                    </IconButton>
                    <IconButton size="small" disabled={(page + 1) * rowsPerPage >= allDocumentsData.length} onClick={() => setPage(p => p + 1)} sx={{ width: 24, height: 24 }}>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>→</Typography>
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
              <Card elevation={0} sx={{ 
                borderRadius: 2, 
                border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                backgroundColor: theme.palette.background.paper
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box>
                    <RecentActivity documents={pagedDocs} />
                  </Box>
                  <Divider />
                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {t('Showing')} {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, allDocumentsData.length)} {t('of')} {allDocumentsData.length}
                    </Typography>
                    <Stack direction="row" spacing={0.25}>
                      <Button size="small" variant="outlined" onClick={() => setRowsPerPage(8)} sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.25, px: 1 }}>8</Button>
                      <Button size="small" variant="outlined" onClick={() => setRowsPerPage(12)} sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.25, px: 1 }}>12</Button>
                      <Button size="small" variant="outlined" onClick={() => setRowsPerPage(24)} sx={{ textTransform: 'none', fontSize: '0.7rem', py: 0.25, px: 1 }}>24</Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
