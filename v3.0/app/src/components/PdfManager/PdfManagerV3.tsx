import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Switch,
  Divider,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  FilePresent as FilePresentIcon,
  Storage as StorageIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Compact table row without background colors
const CompactTableRow = styled(TableRow)(() => ({
  height: '32px', // Much slimmer rows
  '& .MuiTableCell-root': {
    padding: '4px 8px', // Compact padding
    fontSize: '0.75rem', // Smaller font
    borderBottom: '1px solid #e0e0e0',
    whiteSpace: 'nowrap', // Prevent text wrapping
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
}));

const AgeIndicator = styled(Box)<{ ageCategory: string }>(({ theme, ageCategory }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: 
    ageCategory === 'white' ? '#4caf50' :
    ageCategory === 'lightGrey' ? '#9e9e9e' :
    ageCategory === 'darkGrey' ? '#616161' :
    ageCategory === 'greyOrange' ? '#ff9800' :
    ageCategory === 'reddish' ? '#f44336' : '#4caf50',
  marginRight: theme.spacing(1),
  display: 'inline-block'
}));

interface PDF {
  filename: string;
  status: 'current' | 'archived';
  location: string;
  path?: string;
  archiveFile?: string;
  size: number;
  created?: string;
  modified?: string;
  archived?: string;
  ageInDays: number;
  ageCategory: 'white' | 'lightGrey' | 'darkGrey' | 'greyOrange' | 'reddish';
  sizeFormatted: string;
}

interface DiskSpace {
  disk: {
    total: string;
    used: string;
    available: string;
    usagePercent: string;
  };
  pdf: {
    currentSize: number;
    archiveSize: number;
    totalPdfSize: number;
  };
}

interface PdfStats {
  white: { count: number; size: number; sizeFormatted: string };
  lightGrey: { count: number; size: number; sizeFormatted: string };
  darkGrey: { count: number; size: number; sizeFormatted: string };
  greyOrange: { count: number; size: number; sizeFormatted: string };
  reddish: { count: number; size: number; sizeFormatted: string };
}

const PdfManagerV3: React.FC = () => {
  const { t } = useTranslation();
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(false);
  const [diskSpace, setDiskSpace] = useState<DiskSpace | null>(null);
  const [pdfStats, setPdfStats] = useState<PdfStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterByAge, setFilterByAge] = useState<string>('all');
  const [filterByStatus, setFilterByStatus] = useState<string>('all');
  const [compactView, setCompactView] = useState(true); // Default to compact
  const [sortBy, setSortBy] = useState<'filename' | 'size' | 'modified' | 'age'>('modified');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const API_BASE = process.env.REACT_APP_API_URL || 'http://sermixer.micro-cloud.it:12923/v3.0/api';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        loadPdfList(),
        loadDiskSpace(),
        loadPdfStats()
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPdfList = async () => {
    // Use test endpoint temporarily to bypass auth issues
    const response = await fetch(`${API_BASE}/pdfs/list-test`);
    
    if (!response.ok) {
      throw new Error(t('Failed to load PDF list'));
    }
    
    const data = await response.json();
    setPdfs(data.pdfs || []);
  };

  const loadDiskSpace = async () => {
    // Use test endpoint temporarily to bypass auth issues
    const response = await fetch(`${API_BASE}/pdfs/disk-space-test`);
    
    if (!response.ok) {
      throw new Error(t('Failed to load disk space'));
    }
    
    const data = await response.json();
    setDiskSpace(data);
  };

  const loadPdfStats = async () => {
    // Use test endpoint temporarily to bypass auth issues
    const response = await fetch(`${API_BASE}/pdfs/stats-test`);
    
    if (!response.ok) {
      throw new Error(t('Failed to load PDF stats'));
    }
    
    const data = await response.json();
    setPdfStats(data.stats);
  };

  const downloadPdf = async (filename: string) => {
    try {
      const response = await fetch(`${API_BASE}/pdfs/download/${encodeURIComponent(filename)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(t('Failed to download PDF'));
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccess(`${t('Downloaded')} ${filename} ${t('successfully')}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteSelectedPdfs = async () => {
    if (selectedPdfs.length === 0) return;
    
    try {
      const response = await fetch(`${API_BASE}/pdfs/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filenames: selectedPdfs })
      });
      
      if (!response.ok) {
        throw new Error(t('Failed to delete PDFs'));
      }
      
      const result = await response.json();
      setSuccess(`${t('Successfully deleted')} ${result.summary.deleted} PDF(s), ${t('freed')} ${result.summary.totalSizeDeletedFormatted}`);
      setSelectedPdfs([]);
      setDeleteDialog(false);
      loadData(); // Reload data
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPdfs = filteredPdfs.filter(pdf => pdf.status === 'current');
      setSelectedPdfs(currentPdfs.map(pdf => pdf.filename));
    } else {
      setSelectedPdfs([]);
    }
  };

  const handleSelectPdf = (filename: string, checked: boolean) => {
    if (checked) {
      setSelectedPdfs(prev => [...prev, filename]);
    } else {
      setSelectedPdfs(prev => prev.filter(f => f !== filename));
    }
  };

  const handleSort = (column: 'filename' | 'size' | 'modified' | 'age') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortPdfs = (pdfs: PDF[]) => {
    return pdfs.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'filename':
          aValue = a.filename.toLowerCase();
          bValue = b.filename.toLowerCase();
          break;
        case 'size':
          aValue = a.size;
          bValue = b.size;
          break;
        case 'modified':
          aValue = new Date(a.modified || a.archived || 0);
          bValue = new Date(b.modified || b.archived || 0);
          break;
        case 'age':
          aValue = a.ageInDays;
          bValue = b.ageInDays;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getAgeLabel = (ageCategory: string) => {
    switch (ageCategory) {
      case 'white': return t('< 1 week');
      case 'lightGrey': return t('1 week - 2 months');
      case 'darkGrey': return t('2 - 3 months');
      case 'greyOrange': return t('3 - 6 months');
      case 'reddish': return t('> 6 months');
      default: return 'Unknown';
    }
  };

  const filteredPdfs = pdfs.filter(pdf => {
    const matchesSearch = pdf.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge = filterByAge === 'all' || pdf.ageCategory === filterByAge;
    const matchesStatus = filterByStatus === 'all' || pdf.status === filterByStatus;
    return matchesSearch && matchesAge && matchesStatus;
  });

  const currentPdfs = sortPdfs(filteredPdfs.filter(pdf => pdf.status === 'current'));

  const diskUsagePercent = diskSpace ? 
    parseFloat(diskSpace.disk.usagePercent.replace('%', '')) : 0;

  return (
    <Box sx={{ p: 3 }}>
      
      {/* Disk Space Monitor */}
      {diskSpace && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StorageIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{t('Disk Space')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {diskSpace.disk.used} / {diskSpace.disk.total} ({diskSpace.disk.usagePercent})
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={diskUsagePercent}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: diskUsagePercent > 90 ? '#f44336' : 
                                       diskUsagePercent > 75 ? '#ff9800' : '#4caf50'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('Available')}: {diskSpace.disk.available}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FilePresentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">{t('PDF Storage')}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t('Current')}: {(diskSpace.pdf.currentSize / (1024 * 1024)).toFixed(1)} MB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Archived')}: {(diskSpace.pdf.archiveSize / (1024 * 1024)).toFixed(1)} MB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('Total')}: {(diskSpace.pdf.totalPdfSize / (1024 * 1024)).toFixed(1)} MB
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Age-based Statistics */}
      {pdfStats && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>{t('PDF Age Distribution')}</Typography>
          <Grid container spacing={2}>
            {Object.entries(pdfStats).map(([age, stats]) => (
              <Grid item xs={12} sm={6} md={2.4} key={age}>
                <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                  <AgeIndicator ageCategory={age} />
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {getAgeLabel(age)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stats.count} {t('files')} • {stats.sizeFormatted}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Controls */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e0e0e0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              label={t('Search PDFs')}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t('Age Filter')}</InputLabel>
              <Select
                value={filterByAge}
                onChange={(e) => setFilterByAge(e.target.value)}
                label={t('Age Filter')}
              >
                <MenuItem value="all">{t('All Ages')}</MenuItem>
                <MenuItem value="white">{t('< 1 week')}</MenuItem>
                <MenuItem value="lightGrey">{t('1 week - 2 months')}</MenuItem>
                <MenuItem value="darkGrey">{t('2 - 3 months')}</MenuItem>
                <MenuItem value="greyOrange">{t('3 - 6 months')}</MenuItem>
                <MenuItem value="reddish">{t('> 6 months')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>{t('Status Filter')}</InputLabel>
              <Select
                value={filterByStatus}
                onChange={(e) => setFilterByStatus(e.target.value)}
                label={t('Status Filter')}
              >
                <MenuItem value="all">{t('All Status')}</MenuItem>
                <MenuItem value="current">{t('Current')}</MenuItem>
                <MenuItem value="archived">{t('Archived')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={compactView}
                  onChange={(e) => setCompactView(e.target.checked)}
                />
              }
              label={t('Compact')}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              onClick={loadData}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              fullWidth
            >
              {t('Refresh')}
            </Button>
          </Grid>
        </Grid>
        
        {/* Selection Actions */}
        {selectedPdfs.length > 0 && (
          <Box sx={{ mt: 2, p: 1, bgcolor: 'action.selected', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">
                {selectedPdfs.length} {t('file(s) selected')}
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialog(true)}
                size="small"
              >
                {t('Delete Selected')}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* PDFs Table */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          {t('PDFs')} ({currentPdfs.length})
          {currentPdfs.length > 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentPdfs.length > 0 && selectedPdfs.length === currentPdfs.length}
                  indeterminate={selectedPdfs.length > 0 && selectedPdfs.length < currentPdfs.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              }
              label={t('Select All')}
              sx={{ float: 'right' }}
            />
          )}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ width: '40px' }}>{t('Select')}</TableCell>
                <TableCell sx={{ width: '30px' }}>{t('Age')}</TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', fontWeight: sortBy === 'filename' ? 'bold' : 'normal' }}
                  onClick={() => handleSort('filename')}
                >
                  {t('Filename')} {sortBy === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', fontWeight: sortBy === 'size' ? 'bold' : 'normal', width: '100px', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('size')}
                >
                  {t('Size')} {sortBy === 'size' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', fontWeight: sortBy === 'modified' ? 'bold' : 'normal', width: '120px', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('modified')}
                >
                  {t('Modified')} {sortBy === 'modified' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell 
                  sx={{ cursor: 'pointer', fontWeight: sortBy === 'age' ? 'bold' : 'normal', width: '70px', whiteSpace: 'nowrap' }}
                  onClick={() => handleSort('age')}
                >
                  {t('Days')} {sortBy === 'age' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableCell>
                <TableCell sx={{ width: '60px' }}>{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentPdfs.map((pdf) => (
                <CompactTableRow key={pdf.filename}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedPdfs.includes(pdf.filename)}
                      onChange={(e) => handleSelectPdf(pdf.filename, e.target.checked)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={getAgeLabel(pdf.ageCategory)}>
                      <AgeIndicator ageCategory={pdf.ageCategory} />
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                      {pdf.filename}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="caption">{pdf.sizeFormatted}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="caption">
                      {pdf.modified ? new Date(pdf.modified).toLocaleDateString('en-GB') : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="caption">{pdf.ageInDays}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={t('Download PDF')}>
                      <IconButton
                        color="primary"
                        onClick={() => downloadPdf(pdf.filename)}
                        size="small"
                        sx={{ padding: '2px' }}
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </CompactTableRow>
              ))}
              {currentPdfs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('No PDFs match the selected filters')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>



      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            {t('Confirm Deletion')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            {t('Are you sure you want to delete')} {selectedPdfs.length} {t('PDF file(s)?')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('This action cannot be undone. Only current PDFs can be deleted, archived PDFs are protected.')}
          </Typography>
          <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
            {selectedPdfs.map(filename => (
              <Typography key={filename} variant="body2" sx={{ fontFamily: 'monospace', py: 0.5 }}>
                • {filename}
              </Typography>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>{t('Cancel')}</Button>
          <Button
            variant="contained"
            color="error"
            onClick={deleteSelectedPdfs}
            startIcon={<DeleteIcon />}
          >
            {t('Delete')} {selectedPdfs.length} {t('File(s)')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccess(null)} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PdfManagerV3;
