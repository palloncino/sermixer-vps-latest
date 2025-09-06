import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  Tooltip,
  Typography,
} from '@mui/material';
import { isSameDay, isWithinInterval } from 'date-fns';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useFlashMessage } from '../../state/FlashMessageContext';
import { dateText } from '../../utils/date-text';
import HighlightText from '../HighlightText';
import StatusCell from './StatusCell';
import { ROUTES } from '../../constants';
import Button from '../Button';

// PDF Status Dot Component
const PdfStatusDot: React.FC<{ pdfUrls: any[] | [] }> = ({ pdfUrls }) => {
  const getPdfStatus = (pdfUrls: any[] | []) => {
    if (!pdfUrls || !Array.isArray(pdfUrls) || pdfUrls.length === 0) {
      return { hasPdfs: false, count: 0 };
    }
    
    // Filter out invalid objects and ensure they have a valid url property
    const validPdfUrls = pdfUrls.filter(item => 
      item && 
      typeof item === 'object' && 
      item.url && 
      typeof item.url === 'string' && 
      item.url.trim() !== ''
    );
    
    return { hasPdfs: validPdfUrls.length > 0, count: validPdfUrls.length };
  };

  const pdfStatus = getPdfStatus(pdfUrls);

  return (
    <Tooltip 
      title={pdfStatus.hasPdfs ? `${pdfStatus.count} PDF${pdfStatus.count !== 1 ? 's' : ''} available` : 'No PDFs available'}
      arrow
    >
      <PdfDot 
        hasPdfs={pdfStatus.hasPdfs}
        count={pdfStatus.count}
      />
    </Tooltip>
  );
};

const PdfDot = styled.div<{ hasPdfs: boolean; count: number }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${props => props.hasPdfs ? '#4CAF50' : '#B0BEC5'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
  
  &:hover {
    transform: scale(1.3);
    box-shadow: 0 0 10px ${props => props.hasPdfs ? 'rgba(76, 175, 80, 0.5)' : 'rgba(176, 190, 197, 0.5)'};
  }
  
  /* Add a subtle border for better visibility */
  border: 1.5px solid ${props => props.hasPdfs ? '#388E3C' : '#78909C'};
`;

const ClickableClientName = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    color: #1976d2;
  }
`;

const DocumentsList: React.FC<any> = ({ documents, filters, onDeleteDocument }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showMessage } = useFlashMessage();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('updatedAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedDocuments = useMemo(() => {
    return documents
      .filter((doc: any) => {
        const searchText = (filters.search || "").toLowerCase();
        
        // Search in both object and client fields
        const object = doc.data?.quoteHeadDetails?.object || doc.object || "";
        const clientName = doc.data?.selectedClient?.companyName || doc.clientCompany || "";
        
        const companyMatch = !filters.company || filters.company === "all" || doc.company === filters.company;
        const dateMatch = !filters.dateRangeStart || !filters.dateRangeEnd || isWithinInterval(new Date(doc.updatedAt), {
          start: new Date(filters.dateRangeStart),
          end: new Date(filters.dateRangeEnd)
        });

        // Check if search text matches either object or client name
        const searchMatch = object.toLowerCase().includes(searchText) || 
                           clientName.toLowerCase().includes(searchText);

        return searchMatch && companyMatch && dateMatch;
      })
      .sort((a: any, b: any) => {
        if (orderBy === 'updatedAt') {
          return order === 'asc'
            ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
            : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (orderBy === 'clientCompany') {
          const aCompany = a.data?.quoteHeadDetails?.companyName || '';
          const bCompany = b.data?.quoteHeadDetails?.companyName || '';
          return order === 'asc'
            ? aCompany.localeCompare(bCompany)
            : bCompany.localeCompare(aCompany);
        }
        return 0;
      });
  }, [documents, filters, orderBy, order]);

  const paginatedDocuments = useMemo(() => {
    return filteredAndSortedDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredAndSortedDocuments, page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column: string) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const handlePreview = useCallback((docHash: string) => {
    navigate(`/documents/${docHash}`);
  }, [navigate]);

  const handleViewDocument = useCallback((docHash: string) => {
    window.open(`/client-preventive/${docHash}`, '_blank', 'noopener,noreferrer');
  }, []);

  const handleDelete = useCallback((docId: string) => {
    onDeleteDocument(docId);
  }, [onDeleteDocument]);

  const handleCopyHash = useCallback((hash: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      showMessage(`${hash} Copied to clipboard`, 'info');
    }).catch(err => {
      console.error('Failed to copy hash: ', err);
    });
  }, []);

  if (filteredAndSortedDocuments.length === 0) {
    return (
      <Box p={3} textAlign="center">
        <Typography>{t('No documents found matching the current filters.')}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell width="5%">{t('ID')}</TableCell>
            <TableCell width="5%">{t('Hash')}</TableCell>
            <SortableTableCell width="25%" onClick={() => handleSort('object')}>{t('object')}</SortableTableCell>
            <SortableTableCell width="10%" onClick={() => handleSort('client')}>{t('client')}</SortableTableCell>
            <SortableTableCell width="10%" onClick={() => handleSort('company')}>{t('company')}</SortableTableCell>
            <TableCell width="8%">{t('status')}</TableCell>
            <TableCell width="8%">{t('PDFs')}</TableCell>
            <SortableTableCell width="10%" onClick={() => handleSort('updatedAt')}>{t('updatedAt')}</SortableTableCell>
            <TableCell width="12%">{t('action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedDocuments.map((doc: any) => (
            <TableRow key={doc.id || doc._id} sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
              <TableCell>{doc.id || doc._id}</TableCell>
              <TableCell>
                <Tooltip title={t('copy')}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleCopyHash(doc.hash)}
                    sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </TableCell>
              <Tooltip title={t(doc.data?.quoteHeadDetails?.object || doc.object || '')}>
                <TableCell title={doc.data?.quoteHeadDetails?.object || doc.object || ''} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <HighlightText
                    text={doc.data?.quoteHeadDetails?.object || doc.object || ''}
                    search={filters.search || ''}
                  />
                </TableCell>
              </Tooltip>
              <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {doc.data?.selectedClient?.id ? (
                  <ClickableClientName
                    onClick={() => navigate(ROUTES(doc.data.selectedClient.id).clientPage)}
                    title={t('Click to view client details')}
                  >
                    <HighlightText
                      text={doc.data?.selectedClient?.companyName || doc.clientCompany || ''}
                      search={filters.search || ''}
                    />
                  </ClickableClientName>
                ) : (
                  <HighlightText
                    text={doc.data?.selectedClient?.companyName || doc.clientCompany || ''}
                    search={filters.search || ''}
                  />
                )}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.company || ''}</TableCell>
              <TableCell><StatusCell compact statuses={doc.status || {}} /></TableCell>
              <TableCell>
                <PdfStatusDot pdfUrls={doc.pdfUrls || []} />
              </TableCell>
              <Tooltip title={dateText(doc.updatedAt)}>
                <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isSameDay(new Date(doc.updatedAt), new Date()) ? (
                    <span style={{ color: 'green', fontWeight: 'bold' }}>{`${t('Today')} ${dateText(doc.updatedAt, 'hours')}`}</span>
                  ) : (
                    dateText(doc.updatedAt, 'short_time')
                  )}
                </TableCell>
              </Tooltip>
              <TableCell>
                <Box display="flex" gap={1} justifyContent="space-between">
                  <Tooltip title={t('Preview')}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handlePreview(doc.hash)}
                      sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                  <Tooltip title={t('OpenDocument')}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDocument(doc.hash)}
                      sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                  <Tooltip title={t('DeleteDocument')}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleDelete(doc.id || doc._id)}
                      sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAndSortedDocuments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)', mt: 1 }}
      />
    </TableContainer>
  );
};

const SortableTableCell = styled(TableCell)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

export default DocumentsList;
