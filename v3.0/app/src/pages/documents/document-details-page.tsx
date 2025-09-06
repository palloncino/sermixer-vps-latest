import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
  alpha,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import Button from '../../components/Button';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AddedProductsViewer } from '../../components/ObjectViewer';
import { ROUTES } from '../../constants/routes';
import { useDocumentContext } from '../../state/documentContext';
import { useAppState } from '../../state/stateContext';
import { dateText } from '../../utils/date-text';
import { formatPrice } from '../../utils/format-price';
import { WhitePaperContainer } from './styled-components';

const DocumentDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { hash } = useParams<{ hash: string }>();
  const navigate = useNavigate();
  const { getDocument, getAllDocuments, allDocumentsData } = useDocumentContext();
  const { products, getProducts } = useAppState();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [showComparison, setShowComparison] = useState(true);
  const [originalProducts, setOriginalProducts] = useState<Record<number, any>>({});
  const [loadingProducts, setLoadingProducts] = useState<Record<number, boolean>>({});
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editingNote, setEditingNote] = useState('');
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(0);
  const [isEditingQuoteDetails, setIsEditingQuoteDetails] = useState(false);
  const [editingQuoteObject, setEditingQuoteObject] = useState('');
  const [editingQuoteDescription, setEditingQuoteDescription] = useState('');
  const [editingQuoteCompany, setEditingQuoteCompany] = useState('');

  // Fetch all products to get original data
  useEffect(() => {
      getProducts();
  }, [getProducts]);

  // Fetch original products for comparison
  const fetchOriginalProduct = async (productId: number) => {
      if (originalProducts[productId] || loadingProducts[productId]) return;
      
      setLoadingProducts(prev => ({ ...prev, [productId]: true }));
      try {
          // Find product in the products array
          const originalProduct = products.find(p => Number(p.id) === Number(productId));
          if (originalProduct) {
              setOriginalProducts(prev => ({ ...prev, [productId]: originalProduct }));
          }
      } catch (error) {
          console.warn(`Failed to find original product ${productId}:`, error);
      } finally {
          setLoadingProducts(prev => ({ ...prev, [productId]: false }));
      }
  };

  // Fetch all original products when products change
  useEffect(() => {
      if (document?.data?.addedProducts && products.length > 0) {
          document.data.addedProducts.forEach((docProduct: any) => {
              if (docProduct.id && !originalProducts[docProduct.id] && !loadingProducts[docProduct.id]) {
                  fetchOriginalProduct(docProduct.id);
              }
          });
      }
  }, [document?.data?.addedProducts, products]);

  // Handle saving note
  const handleSaveNote = async () => {
    try {
      // Here you would typically call an API to update the document note
      // For now, we'll just update the local state
      setDocument((prev: any) => ({
        ...prev,
        note: editingNote
      }));
      setIsEditingNote(false);
      // TODO: Add API call to update document note
      // await updateDocumentNote(document.hash, editingNote);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Handle saving discount
  const handleSaveDiscount = async () => {
    try {
      // Here you would typically call an API to update the document discount
      // For now, we'll just update the local state
      setDocument((prev: any) => ({
        ...prev,
        discount: editingDiscount
      }));
      setIsEditingDiscount(false);
      // TODO: Add API call to update document discount
      // await updateDocumentDiscount(document.hash, editingDiscount);
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  };

  // Handle saving quote details
  const handleSaveQuoteDetails = async () => {
    try {
      // Here you would typically call an API to update the quote details
      // For now, we'll just update the local state
      setDocument((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          quoteHeadDetails: {
            ...prev.data.quoteHeadDetails,
            object: editingQuoteObject,
            company: editingQuoteCompany,
            description: editingQuoteDescription
          }
        }
      }));
      setIsEditingQuoteDetails(false);
      // TODO: Add API call to update quote details
      // await updateQuoteDetails(document.hash, editingQuoteObject, editingQuoteCompany, editingQuoteDescription);
    } catch (error) {
      console.error('Error saving quote details:', error);
    }
  };

  // Compact Product Card Component
  const CompactProductCard = ({ product, title, color, showComponents = true, originalProduct = null }: { 
      product: any; 
      title: string; 
      color: string;
      showComponents?: boolean;
      originalProduct?: any;
  }) => {
      if (!product) return null;

      // Calculate price difference for main product
      const getPriceDifference = (currentPrice: number, originalPrice: number) => {
          if (!originalPrice || currentPrice === originalPrice) return null;
          const diff = currentPrice - originalPrice;
          return {
              value: diff,
              isIncrease: diff > 0,
              formatted: `${diff > 0 ? '+' : ''}${formatPrice(diff)}`
          };
      };

      const mainPriceDiff = originalProduct ? getPriceDifference(product.price || 0, originalProduct.price || 0) : null;

      return (
          <Box sx={{ 
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: 2,
              overflow: 'hidden',
              backgroundColor: alpha(theme.palette.background.paper, 0.8)
          }}>
              {/* Header */}
              <Box sx={{ 
                  p: 2, 
                  backgroundColor: alpha(color, 0.1),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
              }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: color }}>
                      {title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                      {originalProduct && (
                          <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(ROUTES.productDetail(originalProduct.id.toString()))}
                              sx={{ 
                                  fontSize: '0.7rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  py: 0.5
                              }}
                          >
                              🔗 Original
                          </Button>
                      )}
                      {product.id && (
                          <Button
                              size="small"
                              variant="contained"
                              onClick={() => navigate(ROUTES.productDetail(product.id.toString()))}
                              sx={{ 
                                  fontSize: '0.7rem',
                                  minWidth: 'auto',
                                  px: 1,
                                  py: 0.5
                              }}
                          >
                              📄 Document
                          </Button>
                      )}
                  </Box>
              </Box>

              {/* Content */}
              <Box sx={{ p: 2 }}>
                  {/* Basic Info */}
                  <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                          {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('Category')}: {product.category || t('N/A')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {t('Company')}: {product.company || t('N/A')}
                      </Typography>
                      
                      {/* Price with difference indicator */}
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {formatPrice(product.price || 0)}
                          </Typography>
                          {mainPriceDiff && (
                              <Tooltip 
                                  title={`Price difference: ${mainPriceDiff.formatted}`} 
                                  arrow
                                  placement="top"
                              >
                                  <Box sx={{
                                      position: 'absolute',
                                      top: -5,
                                      right: -15,
                                      width: 12,
                                      height: 12,
                                      borderRadius: '50%',
                                      backgroundColor: mainPriceDiff.isIncrease ? '#ef4444' : '#10b981',
                                      border: `2px solid white`,
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      cursor: 'pointer'
                                  }} />
                              </Tooltip>
                          )}
                      </Box>
                      
                      {product.discount && product.discount > 0 ? (
                          <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              mt: 1,
                              p: 1,
                              backgroundColor: alpha(theme.palette.error.light, 0.1),
                              borderRadius: 1,
                              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
                          }}>
                              <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                                  🏷️ Discount Applied:
                              </Typography>
                              <Typography variant="body2" color="error.main" sx={{ fontWeight: 700 }}>
                                  {product.discount}% OFF
                              </Typography>
                          </Box>
                      ) : (
                          <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1, 
                              mt: 1,
                              p: 1,
                              backgroundColor: alpha(theme.palette.success.light, 0.1),
                              borderRadius: 1,
                              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                          }}>
                              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                                  ✅ No Discount Applied
                              </Typography>
                          </Box>
                      )}
                  </Box>

                  {/* Description */}
                  {product.description && (
                      <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              {t('Description')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ 
                              fontSize: '0.75rem', 
                              lineHeight: 1.4,
                              maxHeight: '100px',
                              overflow: 'auto'
                          }}>
                              {product.description}
                          </Typography>
                      </Box>
                  )}

                  {/* Components */}
                  <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          {t('Components')}
                      </Typography>
                      {showComponents && product.components && product.components.length > 0 ? (
                          <Box sx={{ maxHeight: '200px', overflow: 'auto' }}>
                              {product.components.map((comp: any, compIndex: number) => {
                                  // Find corresponding original component
                                  const originalComp = originalProduct?.components?.find(
                                      (oc: any) => oc.name === comp.name
                                  );
                                  
                                  // Calculate price difference for component
                                  const compPriceDiff = originalComp ? 
                                      getPriceDifference(comp.price || 0, originalComp.price || 0) : null;

                                  return (
                                      <Box key={compIndex} sx={{ 
                                          p: 1, 
                                          mb: 1, 
                                          backgroundColor: alpha(theme.palette.grey[50], 0.5),
                                          borderRadius: 1,
                                          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                                      }}>
                                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                              {comp.name}
                                          </Typography>
                                          {comp.description && (
                                              <Typography variant="body2" color="text.secondary" sx={{ 
                                                  fontSize: '0.7rem',
                                                  maxHeight: '40px',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis'
                                              }}>
                                                  {comp.description}
                                              </Typography>
                                          )}
                                          
                                          {/* Component price with difference indicator */}
                                          <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                              <Typography variant="body2" sx={{ 
                                                  fontWeight: 600, 
                                                  color: 'success.main',
                                                  fontSize: '0.8rem'
                                              }}>
                                                  {formatPrice(comp.price || 0)}
                                              </Typography>
                                              {compPriceDiff && (
                                                  <Tooltip 
                                                      title={`Price difference: ${compPriceDiff.formatted}`} 
                                                      arrow
                                                      placement="top"
                                                  >
                                                      <Box sx={{
                                                          position: 'absolute',
                                                          top: -2,
                                                          right: -10,
                                                          width: 8,
                                                          height: 8,
                                                          borderRadius: '50%',
                                                          backgroundColor: compPriceDiff.isIncrease ? '#ef4444' : '#10b981',
                                                          border: `1px solid white`,
                                                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                          cursor: 'pointer'
                                                      }} />
                                                  </Tooltip>
                                              )}
                                          </Box>
                                      </Box>
                                  );
                              })}
                          </Box>
                      ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              {t('No components included')}
                          </Typography>
                      )}
                  </Box>
              </Box>
          </Box>
      );
  };

  // Product Comparison View Component
  const ProductComparisonView = ({ products }: { products: any[] }) => {
      if (!products || products.length === 0) {
          return (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                      {t('No products available for comparison')}
                  </Typography>
              </Box>
          );
      }

      return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {products.map((docProduct: any, index: number) => {
                  const productId = docProduct.id;
                  const originalProduct = originalProducts[productId];
                  const isLoading = loadingProducts[productId];

                  return (
                      <Box key={index} sx={{ 
                          border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                          borderRadius: 2,
                          overflow: 'hidden'
                      }}>
                          {/* Product Header */}
                          <Box sx={{ 
                              p: 2, 
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`
                          }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                                  {t('Product')} {index + 1}: {docProduct.name}
                              </Typography>
                          </Box>

                          {/* Comparison Grid */}
                          <Grid container>
                              {/* Original Product - Left Side */}
                              <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2, borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
                                      {isLoading ? (
                                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                              <CircularProgress size={24} />
                                          </Box>
                                      ) : originalProduct ? (
                                          <CompactProductCard 
                                              product={originalProduct}
                                              title={t('Original Product')}
                                              color={theme.palette.success.main}
                                              showComponents={true}
                                              originalProduct={originalProduct}
                                          />
                                      ) : (
                                          <Box sx={{ p: 3, textAlign: 'center' }}>
                                              <Typography variant="body1" color="text.secondary">
                                                  {t('Original product not found')}
                                              </Typography>
                                          </Box>
                                      )}
                                  </Box>
                              </Grid>

                              {/* Document Version - Right Side */}
                              <Grid item xs={12} md={6}>
                                  <Box sx={{ p: 2 }}>
                                      <CompactProductCard 
                                          product={docProduct}
                                          title={t('Document Version')}
                                          color={theme.palette.primary.main}
                                          showComponents={true}
                                          originalProduct={originalProduct}
                                      />
                                  </Box>
                              </Grid>
                          </Grid>
                      </Box>
                  );
              })}
          </Box>
      );
  };

  useEffect(() => {
    const fetchDocument = async () => {
      if (!hash) return;
      
      try {
        const doc = await getDocument(hash);
        setDocument(doc);
      } catch (err) {
        setError(t('Error loading document'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [hash, getDocument, t]);

  useEffect(() => {
    if (!allDocumentsData && getAllDocuments) {
      getAllDocuments();
    }
  }, [getAllDocuments, allDocumentsData]);

  const handleTabChange = (section: string) => {
    setActiveSection(section);
  };

  const getStatusColor = (status: any) => {
    if (status.FINALIZED) return 'success';
    if (status.REJECTED) return 'error';
    if (status.YOUR_TURN) return 'warning';
    if (status.CLIENT_VIEWED_DOC) return 'info';
    return 'default';
  };

  const getStatusText = (status: any) => {
    if (status.FINALIZED) return t('Finalized');
    if (status.REJECTED) return t('Rejected');
    if (status.YOUR_TURN) return t('Your Turn');
    if (status.CLIENT_VIEWED_DOC) return t('Client Viewed');
    return t('Unknown');
  };

  const handleViewDocument = (docHash: string) => {
    if (docHash) {
      navigate(`/documents/${docHash}`);
    }
  };

  const handleDownloadDocument = async (docHash: string) => {
    if (!docHash) return;
    
    try {
      // This would typically call an API endpoint to generate/download the PDF
      const response = await fetch(`/api/docs/download/${docHash}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `document-${docHash}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
      // You could show a toast notification here
    }
  };

  const renderOverview = () => {
    if (!document) return null;

    const totalValue = document.data?.addedProducts?.reduce((sum: number, product: any) => sum + (product.price || 0), 0) || 0;
    const discountAmount = (totalValue * (document.discount || 0)) / 100;
    const finalValue = totalValue - discountAmount;

    return (
      <Container maxWidth="xl" disableGutters>
        <Grid container spacing={3}>
          {/* Document Information Section - Left Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 2, 
              height: '100%',
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: 2,
              backgroundColor: 'white'
            }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                {t('Document Information')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <InfoRow label={t('Hash')} value={document.hash} monospace index={0} />
                <InfoRow label={t('Status')} value={
                  <Chip 
                    label={getStatusText(document.status)} 
                    color={getStatusColor(document.status) as any}
                    size="small"
                    sx={{ 
                      fontWeight: 500,
                      minWidth: 80,
                      '& .MuiChip-label': { px: 1.5 }
                    }}
                  />
                } index={1} />
                {/* Client Information with Link */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('Client')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {document.data?.selectedClient?.companyName || t('N/A')}
                    </Typography>
                    {document.data?.selectedClient?.id && (
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate(ROUTES.clientDetail(document.data.selectedClient.id.toString()))}
                        sx={{ 
                          fontSize: '0.7rem',
                          minWidth: 'auto',
                          px: 1,
                          py: 0.25,
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                          }
                        }}
                      >
                        {t('View')}
                      </Button>
                    )}
                  </Box>
                </Box>
                
                {/* Owner/Company Information */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('Owner/Company')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                    {document.company || document.data?.quoteHeadDetails?.company || t('N/A')}
                  </Typography>
                </Box>
                <InfoRow label={t('Created')} value={dateText(document.createdAt)} index={2} />
                <InfoRow label={t('Expires')} value={dateText(document.expiresAt)} index={3} />
                
                {/* Editable Note Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('Note')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isEditingNote ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <TextField
                          multiline
                          rows={3}
                          value={editingNote}
                          onChange={(e) => setEditingNote(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ width: '100%' }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleSaveNote}
                            sx={{ fontSize: '0.7rem', px: 2 }}
                          >
                            {t('Save')}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setIsEditingNote(false);
                              setEditingNote(document.note || '');
                            }}
                            sx={{ fontSize: '0.7rem', px: 2 }}
                          >
                            {t('Cancel')}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        <Typography variant="body1" sx={{ flex: 1, fontStyle: document.note ? 'normal' : 'italic' }}>
                          {document.note || t('No note added')}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setIsEditingNote(true);
                            setEditingNote(document.note || '');
                          }}
                          sx={{ 
                            fontSize: '0.7rem',
                            minWidth: 'auto',
                            px: 1,
                            py: 0.25,
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            }
                          }}
                        >
                          {t('Edit')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Quote Details Section - Center Column */}
          {document.data?.quoteHeadDetails && (
            <Grid item xs={12} md={4}>
              <Box sx={{ 
              p: 2, 
              height: '100%',
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: 2,
              backgroundColor: 'white'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {t('Quote Details')}
                  </Typography>
                  {!isEditingQuoteDetails && (
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setIsEditingQuoteDetails(true);
                        setEditingQuoteObject(document.data.quoteHeadDetails.object || '');
                        setEditingQuoteCompany(document.data.quoteHeadDetails.company || '');
                        setEditingQuoteDescription(document.data.quoteHeadDetails.description || '');
                      }}
                      sx={{ 
                        fontSize: '0.7rem',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }}
                    >
                      {t('Edit')}
                    </Button>
                  )}
                </Box>
                
                {isEditingQuoteDetails ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label={t('Object')}
                      value={editingQuoteObject}
                      onChange={(e) => setEditingQuoteObject(e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                    />
                    
                    {/* Company Selector */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {t('Company')}
                      </Typography>
                      <select
                        value={editingQuoteCompany}
                        onChange={(e) => setEditingQuoteCompany(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="S2 Truck Service">S2 Truck Service</option>
                        <option value="SUPERBETON S.P.A.">SUPERBETON S.P.A.</option>
                      </select>
                    </Box>
                    
                    <TextField
                      label={t('Description')}
                      value={editingQuoteDescription}
                      onChange={(e) => setEditingQuoteDescription(e.target.value)}
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleSaveQuoteDetails}
                        sx={{ fontSize: '0.7rem', px: 2 }}
                      >
                        {t('Save')}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setIsEditingQuoteDetails(false);
                          setEditingQuoteObject(document.data.quoteHeadDetails.object || '');
                          setEditingQuoteCompany(document.data.quoteHeadDetails.company || '');
                          setEditingQuoteDescription(document.data.quoteHeadDetails.description || '');
                        }}
                        sx={{ fontSize: '0.7rem', px: 2 }}
                      >
                        {t('Cancel')}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <InfoRow label={t('Object')} value={document.data.quoteHeadDetails.object || t('N/A')} index={0} />
                    <InfoRow label={t('Company')} value={document.data.quoteHeadDetails.company || t('N/A')} index={1} />
                    <InfoRow label={t('Description')} value={document.data.quoteHeadDetails.description || t('No description')} index={2} />
                  </Box>
                )}
              </Box>
            </Grid>
          )}

          {/* Financial Summary Section - Right Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              p: 2, 
              height: '100%',
              border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: 2,
              backgroundColor: 'white'
            }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
                {t('Financial Summary')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <InfoRow 
                  label={t('Total Products Value')} 
                  value={
                    <Typography variant="h5" color="primary" fontWeight={600}>
                      {formatPrice(totalValue)}
                    </Typography>
                  } 
                  index={0}
                />
                
                {/* Editable Discount Field */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    🏷️ {t('Document Discount')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isEditingDiscount ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                        <TextField
                          type="number"
                          value={editingDiscount}
                          onChange={(e) => setEditingDiscount(Number(e.target.value))}
                          variant="outlined"
                          size="small"
                          inputProps={{ min: 0, max: 100, step: 1 }}
                          sx={{ width: '100%' }}
                          placeholder={t('Enter discount percentage')}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={handleSaveDiscount}
                            sx={{ fontSize: '0.7rem', px: 2 }}
                          >
                            {t('Save')}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setIsEditingDiscount(false);
                              setEditingDiscount(document.discount || 0);
                            }}
                            sx={{ fontSize: '0.7rem', px: 2 }}
                          >
                            {t('Cancel')}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                        {document.discount > 0 ? (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 1,
                            backgroundColor: alpha(theme.palette.error.light, 0.1),
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                            flex: 1
                          }}>
                            <Typography variant="body1" color="error.main" fontWeight={600}>
                              {document.discount}% OFF
                            </Typography>
                            <Typography variant="body1" color="error.main" fontWeight={500}>
                              (-{formatPrice(discountAmount)})
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body1" sx={{ flex: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                            {t('No discount applied')}
                          </Typography>
                        )}
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<EditIcon />}
                          onClick={() => {
                            setIsEditingDiscount(true);
                            setEditingDiscount(document.discount || 0);
                          }}
                          sx={{ 
                            fontSize: '0.7rem',
                            minWidth: 'auto',
                            px: 1,
                            py: 0.25,
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            }
                          }}
                        >
                          {t('Edit')}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <InfoRow 
                  label={t('Final Value')} 
                  value={
                    <Typography variant="h5" color="success.main" fontWeight={700}>
                      {formatPrice(finalValue)}
                    </Typography>
                  } 
                  index={2}
                />
              </Box>
            </Box>
          </Grid>




        </Grid>
      </Container>
    );
  };

  const renderDocumentsList = () => {
    // Check if pdfUrls exists and is an array
    if (!document?.pdfUrls || !Array.isArray(document.pdfUrls) || document.pdfUrls.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('No PDFs available for this document')}
          </Typography>
        </Box>
      );
    }

    // Filter out invalid objects and ensure they have valid properties
    const validPdfUrls = document.pdfUrls.filter((item: any) => 
      item && 
      typeof item === 'object' && 
      item.url && 
      typeof item.url === 'string' && 
      item.url.trim() !== ''
    );

    if (validPdfUrls.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {t('No valid PDF URLs found for this document')}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
          {t('Document PDFs')} ({validPdfUrls.length})
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('PDF Name')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('Type')}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validPdfUrls.map((pdfItem: any, index: number) => {
                // Use the name property if available, otherwise extract from URL
                const fileName = pdfItem.name || getFileNameFromUrl(pdfItem.url, index);
                const pdfType = getPdfType(fileName, index);
                
                return (
                  <TableRow 
                    key={index}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.action.hover, 0.04)
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {fileName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={pdfType} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={t('View PDF')}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewPdf(pdfItem.url)}
                            sx={{ 
                              color: theme.palette.primary.main,
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Download PDF')}>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadPdf(pdfItem.url, fileName)}
                            sx={{ 
                              color: theme.palette.secondary.main,
                              '&:hover': { backgroundColor: alpha(theme.palette.secondary.main, 0.1) }
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const getFileNameFromUrl = (pdfUrl: string, index: number): string => {
    try {
      // Try to extract filename from URL
      if (typeof pdfUrl === 'string' && pdfUrl.includes('/')) {
        const urlParts = pdfUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName && fileName.includes('.')) {
          return fileName;
        }
      }
      
      // Fallback: generate a name based on index
      return `document-${index + 1}.pdf`;
    } catch (error) {
      console.warn('Error parsing PDF URL:', error);
      return `document-${index + 1}.pdf`;
    }
  };

  const getPdfType = (fileName: string, index: number): string => {
    const lowerFileName = fileName.toLowerCase();
    
    if (lowerFileName.includes('quote') || lowerFileName.includes('preventivo')) return 'Quote';
    if (lowerFileName.includes('invoice') || lowerFileName.includes('fattura')) return 'Invoice';
    if (lowerFileName.includes('contract') || lowerFileName.includes('contratto')) return 'Contract';
    if (lowerFileName.includes('proposal') || lowerFileName.includes('proposta')) return 'Proposal';
    if (lowerFileName.includes('final') || lowerFileName.includes('finale')) return 'Final';
    if (lowerFileName.includes('draft') || lowerFileName.includes('bozza')) return 'Draft';
    
    // Default types based on position
    if (index === 0) return 'Main Document';
    if (index === 1) return 'Revision';
    if (index === 2) return 'Final Version';
    
    return 'Document';
  };

  const handleViewPdf = (pdfUrl: string) => {
    // Open PDF in a new tab
    window.open(pdfUrl, '_blank');
  };

  const handleDownloadPdf = async (pdfUrl: string, fileName: string) => {
    try {
      const response = await fetch(pdfUrl);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download PDF');
        // You could show a toast notification here
      }
    } catch (error) {
      console.error('Download failed:', error);
      // You could show a toast notification here
    }
  };

  const renderContent = () => {
    if (!document) return null;

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'client':
        return (
          <Box sx={{ p: 3 }}>
            {/* Client Header with Link */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              pb: 2,
              borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {t('Client Information')}
              </Typography>
              
              {/* Client Page Link */}
              {document.data?.selectedClient?.id && (
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<PersonIcon />}
                  onClick={() => navigate(ROUTES.clientDetail(document.data.selectedClient.id.toString()))}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      borderColor: theme.palette.primary.dark,
                    }
                  }}
                >
                  {t('View Client Page')}
                </Button>
              )}
            </Box>
            
            {/* Client Basic Info */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                mb: 1.5, 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                🏢 {t('Company Details')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Company Name')} value={document.data?.selectedClient?.companyName || t('N/A')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('VAT Number')} value={document.data?.selectedClient?.vatNumber || t('N/A')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Fiscal Code')} value={document.data?.selectedClient?.fiscalCode || t('N/A')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Company ID')} value={document.data?.selectedClient?.id || t('N/A')} />
                </Grid>
              </Grid>
            </Box>

            {/* Contact Information */}
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              borderRadius: 2
            }}>
              <Typography variant="h6" gutterBottom sx={{ 
                mb: 1.5, 
                fontWeight: 600, 
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📞 {t('Contact Information')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Email')} value={document.data?.selectedClient?.email || document.clientEmail || t('N/A')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Mobile')} value={document.data?.selectedClient?.mobileNumber || t('N/A')} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Contact Person')} value={
                    `${document.data?.selectedClient?.firstName || ''} ${document.data?.selectedClient?.lastName || ''}`.trim() || t('N/A')
                  } />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoRow label={t('Phone')} value={document.data?.selectedClient?.phoneNumber || t('N/A')} />
                </Grid>
              </Grid>
            </Box>

            {/* Address */}
            {document.data?.selectedClient?.address && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                borderRadius: 2
              }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  mb: 1.5, 
                  fontWeight: 600, 
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  🏠 {t('Address')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InfoRow label={t('Street')} value={document.data.selectedClient.address.street || t('N/A')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoRow label={t('City')} value={document.data.selectedClient.address.city || t('N/A')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoRow label={t('ZIP Code')} value={document.data.selectedClient.address.zipCode || t('N/A')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoRow label={t('Country')} value={document.data.selectedClient.address.country || t('N/A')} />
                  </Grid>
                  {document.data.selectedClient.address.state && (
                    <Grid item xs={12} md={6}>
                      <InfoRow label={t('State/Province')} value={document.data.selectedClient.address.state} />
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* Additional Client Info */}
            {document.data?.selectedClient && (
              <Box sx={{ 
                mt: 3, 
                p: 2, 
                backgroundColor: alpha(theme.palette.info.light, 0.05),
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                borderRadius: 2
              }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  mb: 1.5, 
                  color: theme.palette.info.main,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  ℹ️ {t('Additional Information')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InfoRow label={t('Client Since')} value={document.data.selectedClient.createdAt ? dateText(document.data.selectedClient.createdAt) : t('N/A')} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoRow label={t('Last Updated')} value={document.data.selectedClient.updatedAt ? dateText(document.data.selectedClient.updatedAt) : t('N/A')} />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 'products':
        return (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                {t('Products & Components')}
              </Typography>
              
              {/* View Toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('View')}:
                </Typography>
                <Button
                  size="small"
                  variant={showComparison ? 'contained' : 'outlined'}
                  onClick={() => setShowComparison(true)}
                  sx={{ px: 2, py: 0.5, fontSize: '0.8rem' }}
                >
                  {t('Comparison')}
                </Button>
                <Button
                  size="small"
                  variant={!showComparison ? 'contained' : 'outlined'}
                  onClick={() => setShowComparison(false)}
                  sx={{ px: 2, py: 0.5, fontSize: '0.8rem' }}
                >
                  {t('Simple')}
                </Button>
              </Box>
            </Box>
            
            {/* Products Summary */}
            {document.data?.addedProducts && document.data.addedProducts.length > 0 && (
              <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: theme.palette.primary.main }}>
                  {t('Summary')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <InfoRow label={t('Total Products')} value={document.data.addedProducts.length} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoRow label={t('Total Value')} value={formatPrice(document.data.addedProducts.reduce((sum: number, p: any) => sum + (p.price || 0), 0))} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <InfoRow label={t('Company')} value={document.company || t('N/A')} />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Products View */}
            {showComparison ? (
              <>
                {/* Comparison Info */}
                <Box sx={{ 
                  mb: 3, 
                  p: 2, 
                  backgroundColor: alpha(theme.palette.info.main, 0.05), 
                  borderRadius: 2, 
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` 
                }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.info.main }}>
                    💡 {t('Comparison View')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                    {t('Compare original products with their document versions. See price differences, discounts applied, and any modifications made for this specific quote. Left side shows the original product, right side shows the document version with any changes.')}
                  </Typography>
                </Box>
                
                <ProductComparisonView products={document.data?.addedProducts || []} />
              </>
            ) : (
              <AddedProductsViewer products={document.data?.addedProducts || []} />
            )}
          </Box>
        );
      case 'documents':
        return renderDocumentsList();
      case 'raw':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
              {t('Raw Document Data')}
            </Typography>
            
            {/* Quick Stats */}
            <Box sx={{ mb: 3, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 2, border: `1px solid ${alpha(theme.palette.info.main, 0.1)}` }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: theme.palette.info.main }}>
                {t('Document Statistics')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <InfoRow label={t('ID')} value={document.id} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InfoRow label={t('Products Count')} value={document.data?.addedProducts?.length || 0} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InfoRow label={t('Total Value')} value={formatPrice(document.data?.addedProducts?.reduce((sum: number, p: any) => sum + (p.price || 0), 0) || 0)} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <InfoRow label={t('PDFs Count')} value={document.pdfUrls?.length || 0} />
                </Grid>
              </Grid>
            </Box>
            
            {/* Raw JSON Data */}
            <Box sx={{ 
              backgroundColor: alpha(theme.palette.grey[50], 0.3), 
              p: 3, 
              borderRadius: 2, 
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.8rem',
              maxHeight: '600px',
              overflow: 'auto',
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`
            }}>
              <pre style={{ margin: 0, lineHeight: 1.5 }}>{JSON.stringify(document, null, 2)}</pre>
            </Box>
          </Box>
        );
      default:
        return <Typography>{t('No data available')}</Typography>;
    }
  };

  if (loading) {
    return (
      <WhitePaperContainer>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">{t('Loading document...')}</Typography>
          </Box>
        </Box>
      </WhitePaperContainer>
    );
  }

  if (error) {
    return (
      <WhitePaperContainer>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {t('Error loading document')}: {error}
            </Alert>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              {t('Retry')}
            </Button>
          </Box>
        </Box>
      </WhitePaperContainer>
    );
  }

  if (!document) {
    return (
      <WhitePaperContainer>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>Document not found</Alert>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/documents-list')}
            sx={{ borderRadius: 2, px: 3, py: 1.5 }}
          >
            Back to Documents
          </Button>
        </Container>
      </WhitePaperContainer>
    );
  }

  const tabs = [
    { key: 'overview', icon: <InfoIcon />, label: t('Overview'), labelIt: 'Panoramica' },
    { key: 'client', icon: <PersonIcon />, label: t('Client'), labelIt: 'Cliente' },
    { key: 'products', icon: <ShoppingCartIcon />, label: t('Products'), labelIt: 'Prodotti' },
    { key: 'documents', icon: <FolderIcon />, label: t('PDFs'), labelIt: 'PDF' },
    { key: 'raw', icon: <DescriptionIcon />, label: t('Raw Data'), labelIt: 'Dati Grezzi' }
  ];

  return (
    <WhitePaperContainer>
      {/* Header */}
      <Box sx={{ 
        p: 4, 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`
      }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 900, 
                color: '#000000', 
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}>
                {document.data?.quoteHeadDetails?.object || t('Document Preview')}
              </Typography>
              {document.data?.quoteHeadDetails?.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  {document.data.quoteHeadDetails.description}
                </Typography>
              )}
            </Box>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/documents-list')}
              sx={{ 
                borderRadius: 2, 
                px: 4, 
                py: 1.5,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              {t('Back to Documents')}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`${t('Hash')}: ${document.hash}`} 
              variant="outlined" 
              size="small"
              sx={{ 
                fontFamily: 'monospace', 
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '2px solid #000000',
                backgroundColor: '#f8f9fa',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                }
              }}
            />
            <Chip 
              label={`${t('Client')}: ${document.data?.selectedClient?.companyName || t('N/A')}`} 
              variant="outlined" 
              size="small"
              sx={{ 
                fontWeight: 700,
                border: '2px solid #000000',
                backgroundColor: '#f8f9fa',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                }
              }}
            />
            <Chip 
              label={`${t('Company')}: ${document.company || document.data?.quoteHeadDetails?.company || t('N/A')}`} 
              variant="outlined" 
              size="small"
              sx={{ 
                fontWeight: 700,
                border: '2px solid #000000',
                backgroundColor: '#f8f9fa',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                }
              }}
            />
            <Chip 
              label={`${t('Created')}: ${dateText(document.createdAt)}`} 
              variant="outlined" 
              size="small"
              sx={{ 
                fontWeight: 700,
                border: '2px solid #000000',
                backgroundColor: '#f8f9fa',
                color: '#000000',
                '&:hover': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                }
              }}
            />
            <Chip 
              label={`${t('Status')}: ${getStatusText(document.status)}`} 
              color={getStatusColor(document.status) as any}
              size="small"
              sx={{ 
                fontWeight: 700,
                border: '2px solid #000000',
                backgroundColor: getStatusColor(document.status) === 'success' ? '#000000' : '#f8f9fa',
                color: getStatusColor(document.status) === 'success' ? '#ffffff' : '#000000',
                '&:hover': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Tabs section */}
      <Box sx={{ 
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`
      }}>
        <Container maxWidth="xl" disableGutters>
          <Box sx={{ px: 4, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflow: 'auto' }}>
              {tabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeSection === tab.key ? 'contained' : 'outlined'}
                  startIcon={tab.icon}
                  onClick={() => handleTabChange(tab.key)}
                  sx={{ 
                    borderRadius: 2, 
                    px: 3, 
                    py: 1.5, 
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&.MuiButton-contained': {
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`
                    }
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main content section */}
      <Box sx={{ py: 4 }}>
        <Container maxWidth="xl" disableGutters>
          {renderContent()}
        </Container>
      </Box>
    </WhitePaperContainer>
  );
};

// Helper component for consistent info row styling with alternating backgrounds
const InfoRow = ({ 
  label, 
  value, 
  monospace = false, 
  index = 0 
}: { 
  label: string; 
  value: React.ReactNode; 
  monospace?: boolean;
  index?: number;
}) => {
  const theme = useTheme();
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      p: 1.5,
      borderRadius: 1,
      backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.grey[50], 0.6),
      '&:hover': {
        backgroundColor: alpha(theme.palette.grey[100], 0.8),
        transition: 'background-color 0.2s ease'
      }
    }}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 120 }}>
        {label}
      </Typography>
      <Box sx={{ 
        flex: 1, 
        textAlign: 'right',
        fontFamily: monospace ? 'Monaco, Menlo, "Ubuntu Mono", monospace' : 'inherit',
        fontSize: monospace ? '0.75rem' : 'inherit'
      }}>
        {value}
      </Box>
    </Box>
  );
};

export default DocumentDetailsPage;
