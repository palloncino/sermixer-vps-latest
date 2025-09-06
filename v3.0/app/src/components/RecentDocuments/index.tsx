import React, { useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Chip,
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDocumentContext } from '../../state/documentContext';
import { dateText } from '../../utils/date-text';
import Button from '../Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const RecentDocuments: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { allDocumentsData } = useDocumentContext();
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const recentDocuments = useMemo(() => {
    if (!allDocumentsData) return [];
    
    return allDocumentsData
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 50); // Get top 50 most recent
  }, [allDocumentsData]);

  const paginatedDocuments = useMemo(() => {
    return recentDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [recentDocuments, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleViewDocument = (hash: string) => {
    navigate(`/documents/${hash}`);
  };

  const handlePreviewDocument = (hash: string) => {
    window.open(`/client-preventive/${hash}`, '_blank');
  };

  const handleViewClient = (doc: any) => {
    const clientId = doc.data?.selectedClient?.id || doc.clientId;
    if (clientId) {
      navigate(`/clients/${clientId}`);
    }
  };

  const getDocumentTitle = (doc: any) => {
    return doc.data?.quoteHeadDetails?.object || doc.object || 'Untitled Document';
  };

  const getClientName = (doc: any) => {
    return doc.data?.selectedClient?.companyName || doc.clientCompany || 'Unknown Client';
  };

  const getDocumentStatus = (doc: any) => {
    if (doc.data?.quoteHeadDetails?.status) {
      return doc.data.quoteHeadDetails.status;
    }
    return 'Draft';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'success';
      case 'approved':
        return 'primary';
      case 'rejected':
        return 'error';
      case 'draft':
      default:
        return 'default';
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const docDate = new Date(dateString);
    return today.toDateString() === docDate.toDateString();
  };

  return (
    <Paper elevation={0} sx={{ 
      backgroundColor: 'white', 
      borderRadius: 1, 
      boxShadow: '0px 1px 3px rgba(0,0,0,0.12)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
          {t('Recent Documents')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('Recently edited documents')}
        </Typography>
      </Box>

      <TableContainer sx={{ flex: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>{t('Updated')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '35%' }}>{t('Document')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>{t('Client')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>{t('Status')}</TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.map((doc: any) => (
              <TableRow key={doc.id || doc._id} hover>
                <TableCell>
                  {isToday(doc.updatedAt) ? (
                    <Chip
                      label="Today"
                      color="success"
                      size="small"
                      variant="filled"
                      sx={{ fontSize: '0.7rem', height: '20px' }}
                    />
                  ) : (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {dateText(doc.updatedAt, 'short_time')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Tooltip title={getDocumentTitle(doc)} placement="top">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        lineHeight: 1.2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '2.4em',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                      onClick={() => handleViewDocument(doc.hash)}
                    >
                      {getDocumentTitle(doc)}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{
                      fontSize: '0.75rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer',
                      fontWeight: 500,
                      '&:hover': { 
                        textDecoration: 'underline',
                        color: '#1976d2'
                      }
                    }}
                    onClick={() => handleViewClient(doc)}
                  >
                    {getClientName(doc)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getDocumentStatus(doc)}
                    color={getStatusColor(getDocumentStatus(doc)) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={0.5}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handlePreviewDocument(doc.hash)}
                      sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDocument(doc.hash)}
                      sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={recentDocuments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
      />
    </Paper>
  );
};

export default RecentDocuments;
