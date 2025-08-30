import React, { useState, useEffect } from 'react';
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
  DialogActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Archive as ArchiveIcon,
  FilePresent as FilePresentIcon,
  Help as HelpIcon
} from '@mui/icons-material';

const PdfManager = () => {
  const [pdfs, setPdfs] = useState({ current: [], archived: [] });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://sermixer.micro-cloud.it:12923/v3.0/api';

  useEffect(() => {
    loadPdfList();
  }, []);

  const loadPdfList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/documents/pdf-list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to load PDF list');
      }
      
      const data = await response.json();
      setPdfs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkPdfStatus = async (filename) => {
    try {
      const response = await fetch(`${API_BASE}/documents/pdf-status/${encodeURIComponent(filename)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check PDF status');
      }
      
      const result = await response.json();
      setStatusResult(result);
      setStatusDialog(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const downloadPdf = async (filename) => {
    try {
      const response = await fetch(`${API_BASE}/documents/pdf-retrieve/${encodeURIComponent(filename)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to retrieve PDF');
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
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'archived': return 'warning';
      case 'missing': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <FilePresentIcon />;
      case 'archived': return <ArchiveIcon />;
      case 'missing': return <HelpIcon />;
      default: return <HelpIcon />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredPdfs = {
    current: pdfs.current.filter(pdf => 
      pdf.filename.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    archived: pdfs.archived.filter(pdf => 
      pdf.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        PDF Management System
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            label="Search PDFs"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 300 }}
          />
          <Button
            variant="contained"
            onClick={loadPdfList}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          >
            Refresh
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Chip
            icon={<FilePresentIcon />}
            label={`Available: ${filteredPdfs.current.length}`}
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<ArchiveIcon />}
            label={`Archived: ${filteredPdfs.archived.length}`}
            color="warning"
            variant="outlined"
          />
          <Chip
            label={`Total: ${filteredPdfs.current.length + filteredPdfs.archived.length}`}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Current PDFs Table */}
      <Paper sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Available PDFs
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Modified</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPdfs.current.map((pdf) => (
                <TableRow key={pdf.filename}>
                  <TableCell>{pdf.filename}</TableCell>
                  <TableCell>{formatFileSize(pdf.size)}</TableCell>
                  <TableCell>{formatDate(pdf.modified)}</TableCell>
                  <TableCell>
                    <Tooltip title="Download PDF">
                      <IconButton
                        color="primary"
                        onClick={() => downloadPdf(pdf.filename)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPdfs.current.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No available PDFs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Archived PDFs Table */}
      <Paper sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          Archived PDFs
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Filename</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Archive File</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPdfs.archived.map((pdf) => (
                <TableRow key={pdf.filename}>
                  <TableCell>{pdf.filename}</TableCell>
                  <TableCell>{formatFileSize(pdf.size)}</TableCell>
                  <TableCell>{pdf.archiveFile}</TableCell>
                  <TableCell>
                    <Tooltip title="Retrieve from Archive">
                      <IconButton
                        color="warning"
                        onClick={() => downloadPdf(pdf.filename)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPdfs.archived.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No archived PDFs found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* PDF Status Check */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Check PDF Status
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Enter PDF filename"
            variant="outlined"
            size="small"
            value={selectedPdf || ''}
            onChange={(e) => setSelectedPdf(e.target.value)}
            placeholder="e.g., 04-03_15-46-50-432-Se-Preventivo.pdf"
            sx={{ minWidth: 400 }}
          />
          <Button
            variant="contained"
            onClick={() => checkPdfStatus(selectedPdf)}
            disabled={!selectedPdf}
          >
            Check Status
          </Button>
        </Box>
      </Paper>

      {/* Status Result Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          PDF Status: {statusResult?.filename}
        </DialogTitle>
        <DialogContent>
          {statusResult && (
            <Box>
              <Alert severity={getStatusColor(statusResult.status)} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getStatusIcon(statusResult.status)}
                  <Typography variant="body1">
                    {statusResult.message}
                  </Typography>
                </Box>
              </Alert>
              
              <Typography variant="body2" color="text.secondary">
                <strong>Status:</strong> {statusResult.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {statusResult.location}
              </Typography>
              {statusResult.archiveFile && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Archive File:</strong> {statusResult.archiveFile}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)}>Close</Button>
          {statusResult?.status === 'archived' && (
            <Button
              variant="contained"
              onClick={() => {
                downloadPdf(statusResult.filename);
                setStatusDialog(false);
              }}
            >
              Retrieve PDF
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PdfManager;
