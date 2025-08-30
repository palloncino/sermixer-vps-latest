import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BuildIcon from '@mui/icons-material/Build';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FlagIcon from '@mui/icons-material/Flag';
import LaunchIcon from '@mui/icons-material/Launch';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Slider, TextField, Tooltip, Typography } from "@mui/material";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Loading from 'components/Loading';
import PriceSummary from 'components/PriceSummary';
import { FC, forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from 'react-router-dom';
import { useDocumentContext } from "state/documentContext";
import { useFlashMessage } from "state/FlashMessageContext";
import ClientPreventiveHeadComponent from "../../../components/ClientPreventiveHeadComponent/index";
import EuroTextField from '../../../components/EuroTextField/index';
import MarkdownEditor from '../../../components/MarkdownEditor/index';
import ProductPriceSummary from '../../../components/ProductPriceSummary';
import SummaryComponentList from "../../../components/SummaryQuote/SummaryComponentList";
import { useAppState } from "../../../state/stateContext";
import { ComponentType, DocumentDataDataType, ProductType, UserType } from "../../../types/index";
import { formatPrice, priceStyles } from "../../../utils/format-price";
import fallbackProductImage from '../../../media/fallbackProduct.png';
import DocumentFooter from './DocumentFooter';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Styled Components
const ProductBox = memo(styled(Box)`
    margin-bottom: 32px;
    padding: 24px;
    background-color: #ffffff;
    border-radius: 4px;
    position: relative;
    transition: all 0.3s ease;
    &:hover {
        box-shadow: 0 0 0 2px #e4e4e4;
    }
`);

const DeleteButton = styled(IconButton)`
    position: absolute;
    top: 8px;
    right: 8px;
    color: #000000;
    &:hover {
        color: #ff0000;
    }
`;

// 🚀 PERFORMANCE: Memoized Product Item to prevent unnecessary re-renders
const ProductItem = memo(({ 
    product, 
    productIndex, 
    user, 
    t, 
    handleInputChange, 
    handleComponentsChange,
    toggleComponentsExpanded,
    calculateDiscountedPrice,
    handleRemoveProduct,
    handleMoveUp,
    handleMoveDown,
    expandedComponents,
    products,
    formatPrice,
    priceStyles
}: {
    product: ProductType;
    productIndex: number;
    user?: UserType;
    t: any;
    handleInputChange: (index: number, field: string, value: string | number) => void;
    handleComponentsChange: (productIndex: number, updatedComponents: ComponentType[]) => void;
    toggleComponentsExpanded: (productIndex: number) => void;
    calculateDiscountedPrice: (price: number, discount: number) => number;
    handleRemoveProduct: (productIndex: number) => void;
    handleMoveUp: (index: number) => void;
    handleMoveDown: (index: number) => void;
    expandedComponents: { [key: number]: boolean };
    products: ProductType[];
    formatPrice: (price: number) => string;
    priceStyles: any;
}) => {
    console.log('🎨 PERFORMANCE: Rendering ProductItem', {
        productIndex,
        productName: product.name,
        productId: product.id,
        timestamp: Date.now()
    });

    return (
        <ProductBox key={product.id}>
            <Tooltip title={t("RemoveProduct")} arrow>
                <DeleteButton
                    onClick={() => handleRemoveProduct(productIndex)}
                    aria-label={t("RemoveProduct")}
                >
                    <DeleteIcon />
                </DeleteButton>
            </Tooltip>

            {/* Product Title Header - Above Columns */}
            <Box sx={{
                mb: 3,
                p: 2,
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flex: 1 }}>
                        {/* Main Product Title */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                lineHeight: 1.2,
                                mb: 1,
                                color: 'text.primary'
                            }}
                        >
                            {product.name}
                        </Typography>

                        {/* Product Metadata Row */}
                        <Box sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                            alignItems: 'center'
                        }}>
                            {product.category && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.5,
                                    backgroundColor: '#e3f2fd',
                                    color: '#1565c0',
                                    borderRadius: 2,
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    border: '1px solid #bbdefb'
                                }}>
                                    <LocalOfferIcon sx={{ fontSize: '0.9rem' }} />
                                    {product.category}
                                </Box>
                            )}
                            {product.company && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.5,
                                    backgroundColor: '#8FD300',
                                    color: '#ffffff',
                                    borderRadius: 2,
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    border: '1px solid #7bc200'
                                }}>
                                    <BusinessIcon sx={{ fontSize: '0.9rem' }} />
                                    {product.company === 'sermixer' ? t('Sermixer') : t('S2TruckService')}
                                </Box>
                            )}
                            {product.id && (
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    px: 1.5,
                                    py: 0.5,
                                    backgroundColor: 'grey.100',
                                    color: 'text.secondary',
                                    borderRadius: 2,
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    border: '1px solid',
                                    borderColor: 'grey.300'
                                }}>
                                    <FingerprintIcon sx={{ fontSize: '0.9rem' }} />
                                    ID: {product.id}
                                </Box>
                            )}
                            {/* View Product Link (Admin Only) */}
                            {user?.id && (
                                <Link
                                    to={`/product/${product.id}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 1.5,
                                        py: 0.5,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        borderRadius: 2,
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        border: '1px solid',
                                        borderColor: 'primary.dark',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark'
                                        }
                                    }}>
                                        <LaunchIcon sx={{ fontSize: '0.9rem' }} />
                                        {t("VediProdotto")}
                                    </Box>
                                </Link>
                            )}
                        </Box>
                    </Box>

                    {/* Right Side Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Reorder Arrow Buttons */}
                        {user?.id && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0.5 }}>
                                <IconButton
                                    size="small"
                                    onClick={() => handleMoveUp(productIndex)}
                                    disabled={productIndex === 0}
                                    aria-label="Move Up"
                                    sx={{ p: 0.5, mb: 0.5 }}
                                >
                                    <ArrowUpwardIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => handleMoveDown(productIndex)}
                                    disabled={productIndex === products.length - 1}
                                    aria-label="Move Down"
                                    sx={{ p: 0.5 }}
                                >
                                    <ArrowDownwardIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box sx={{
                        position: 'sticky',
                        top: 20,
                        alignSelf: 'flex-start'
                    }}>

                        {/* Product Image */}
                        <Box
                            component="img"
                            src={product.imgUrl || fallbackProductImage}
                            alt={product.name}
                            sx={{
                                width: '100%',
                                maxHeight: 200,
                                objectFit: 'cover',
                                mb: 1,
                                borderRadius: 1
                            }}
                        />

                        {/* Product Price */}
                        <EuroTextField
                            label={t("PrezzoProdotto")}
                            value={product.price?.toString() || ''}
                            onChange={(value) => handleInputChange(productIndex, 'price', value)}
                            fullWidth
                            readOnly={!user?.id}
                        />

                        {/* Discount Slider (Visible to Authorized Users) */}
                        {user?.id && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                <Typography variant="subtitle1" sx={{ mr: 2 }}>{t("Sconto")}</Typography>
                                <Slider
                                    value={product.discount || 0}
                                    onChange={(_, newValue) => handleInputChange(productIndex, 'discount', newValue as number)}
                                    aria-labelledby="product-discount-slider"
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={0}
                                    max={100}
                                    sx={{ flexGrow: 1 }}
                                />
                                <Typography variant="body2" sx={{ ml: 2 }}>
                                    {product.discount || 0}%
                                </Typography>
                            </Box>
                        )}

                        {/* Computed Price Display */}
                        {(product.discount || 0) > 0 && (
                            <Box sx={{
                                mt: 1,
                                p: 1.5,
                                backgroundColor: 'grey.50',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                    {t("PrezzoCalcolato")}:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap' }}>
                                    <Typography variant="body1" sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'line-through',
                                        ...priceStyles
                                    }}>
                                        {formatPrice(product.price)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                                        -{product.discount || 0}%
                                    </Typography>
                                    <Typography variant="body1" sx={{
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        ...priceStyles
                                    }}>
                                        = {formatPrice(calculateDiscountedPrice(product.price, product.discount || 0))}
                                    </Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Quick Total Summary */}
                        <Box sx={{
                            mt: 1,
                            p: 1.5,
                            backgroundColor: 'grey.50',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                                {t("TotaleConComponenti")}
                            </Typography>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {t("Prodotto")}:
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: 500, ...priceStyles }}>
                                        {formatPrice((product.discount || 0) > 0 ? calculateDiscountedPrice(product.price, product.discount || 0) : product.price)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid', borderColor: 'divider', pt: 0.5, mt: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {t("Totale")}:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', ...priceStyles }}>
                                        {formatPrice((product.discount || 0) > 0 ? calculateDiscountedPrice(product.price, product.discount || 0) : product.price)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={8}>
                    {/* Product Description */}
                    <Box mb={2}>
                        <Typography variant="subtitle1">{t("Description")}</Typography>
                        <MarkdownEditor
                            value={product.description || ""}
                            onChange={(value) => handleInputChange(productIndex, 'description', value)}
                            readOnly={!user?.id}
                        />
                    </Box>

                    {/* Product Price Summary */}
                    {console.log('💰 PERFORMANCE: Rendering ProductPriceSummary', {
                        productIndex,
                        productName: product.name,
                        componentsCount: product.components?.length || 0,
                        timestamp: Date.now()
                    })}
                    <ProductPriceSummary
                        product={product}
                        components={product.components || []}
                    />

                    {/* Components Header */}
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'action.hover'
                            }
                        }}
                        onClick={() => toggleComponentsExpanded(productIndex)}
                    >
                        {/* First Row: Components */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BuildIcon sx={{ color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t("Componenti")}
                                </Typography>
                                <Typography variant="body2" sx={{
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }}>
                                    {product.components?.length || 0}
                                </Typography>
                            </Box>
                            <ExpandMoreIcon
                                sx={{
                                    transform: expandedComponents[productIndex] ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                        </Box>

                        {/* Second Row: Statistics */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Selezionati: {product.components?.filter((c: ComponentType) => c.included).length || 0}/{product.components?.length || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Totale selezionati: {formatPrice(
                                    product.components?.filter((c: ComponentType) => c.included)
                                        .reduce((sum: number, c: ComponentType) => sum + (c.price * c.quantity), 0) || 0
                                )}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Components List (Collapsible) */}
                    <Collapse in={expandedComponents[productIndex]} timeout="auto" unmountOnExit>
                        <Box sx={{ mt: 1 }}>
                            <SummaryComponentList
                                components={product.components || []}
                                onComponentChange={(updatedComponents: ComponentType[]) =>
                                    handleComponentsChange(productIndex, updatedComponents)
                                }
                                readOnly={!user?.id}
                            />
                        </Box>
                    </Collapse>
                </Grid>
            </Grid>
        </ProductBox>
    );
});

const PreventiveForm: FC<{ activeRevisionLabel: string | null, revisionData: DocumentDataDataType, user?: UserType }> = memo(({ activeRevisionLabel, revisionData }) => {
    // 🚀 PERFORMANCE: Track render count with useRef
    const renderCountRef = useRef(0);
    renderCountRef.current += 1;
    console.log('🔄 PreventiveForm RENDER', {
        timestamp: new Date().toISOString(),
        activeRevisionLabel,
        productsCount: revisionData?.data?.addedProducts?.length || 0,
        renderCount: renderCountRef.current
    });

    const { t } = useTranslation();
    const { showMessage } = useFlashMessage();
    const { hash } = useParams<{ hash: string }>();
    const {
        originalDocumentData,
        updatedDocumentData,
        setUpdatedDocumentData,
        updateNestedDocumentField,
        getDocument,
        error,
        loading
    } = useDocumentContext();
    const { user, getProducts, products: allProducts } = useAppState();

    const [products, setProducts] = useState<ProductType[]>(updatedDocumentData?.data?.addedProducts || []);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedComponents, setExpandedComponents] = useState<{ [key: number]: boolean }>({});
    const [paymentTerms, setPaymentTerms] = useState<string>(
        updatedDocumentData?.data?.paymentTerms ||
        "MODALITA' DI PAGAMENTO: Acconto 10% e saldo alla consegna o alla richiesta dei documenti di collaudo (in mancanza del versamento dell'acconto non sarà possibile procedere con l'evasione dell'offerta)"
    );

    useEffect(() => {
        if (hash) {
            getDocument(hash);
        }
    }, [hash, getDocument]);

    useEffect(() => {
        if (updatedDocumentData?.data?.addedProducts) {
            setProducts(updatedDocumentData.data.addedProducts);
        }
    }, [updatedDocumentData]);

    useEffect(() => {
        if (revisionData) {
            setUpdatedDocumentData((prevData) => ({
                ...prevData,
                data: revisionData,
            }));
        }
    }, [revisionData, setUpdatedDocumentData]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        if (updatedDocumentData?.data?.paymentTerms) {
            setPaymentTerms(updatedDocumentData.data.paymentTerms);
        }
    }, [updatedDocumentData]);

    // 🚀 PERFORMANCE: Memoize filtered products to avoid unnecessary filtering
    const filteredProducts = useMemo(() => {
        console.log('📊 PERFORMANCE: filteredProducts useMemo recalculating', {
            searchTerm,
            allProductsCount: allProducts?.length || 0,
            timestamp: Date.now()
        });
        if (!searchTerm) return allProducts;
        return allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allProducts]);

    const handleInputChange = useCallback((index: number, field: string, value: string | number) => {
        console.log('⚡ PERFORMANCE: handleInputChange called', {
            index, field, value,
            productsCount: products.length,
            timestamp: Date.now()
        });
        const updatedProducts = [...products];
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: isNaN(numericValue) ? value : numericValue
        };

        setProducts(updatedProducts);
        updateNestedDocumentField(['data', 'addedProducts'], updatedProducts);
    }, [products, updateNestedDocumentField]);

    const handleComponentsChange = useCallback((productIndex: number, updatedComponents: ComponentType[]) => {
        console.log('⚡ PERFORMANCE: handleComponentsChange called', {
            productIndex,
            componentsCount: updatedComponents.length,
            timestamp: Date.now()
        });
        const updatedProducts = products.map((product, i) =>
            i === productIndex ? { ...product, components: updatedComponents } : product
        );

        setProducts(updatedProducts);
        updateNestedDocumentField(['data', 'addedProducts'], updatedProducts);
    }, [products, updateNestedDocumentField]);

    const calculateDiscountedPrice = useCallback((price: number, discount: number) => {
        return price * (1 - discount / 100);
    }, []);

    const handleAddProduct = useCallback(() => {
        setIsSearchModalOpen(true);
    }, []);

    const handleCloseSearchModal = useCallback(() => {
        setIsSearchModalOpen(false);
        setSearchTerm("");
    }, []);

    const handleSelectProduct = useCallback((selectedProduct: ProductType) => {
        console.log('Active Change: Product added', {
            productName: selectedProduct.name,
            productId: selectedProduct.id
        });
        const updatedProducts = [...products, selectedProduct];

        setProducts(updatedProducts);
        updateNestedDocumentField(['data', 'addedProducts'], updatedProducts);
        showMessage('AddedItemToPreventive', 'success');
        handleCloseSearchModal();
    }, [products, updateNestedDocumentField, showMessage, handleCloseSearchModal]);

    const handleRemoveProduct = useCallback((productIndex: number) => {
        const updatedProducts = products.filter((_, index) => index !== productIndex);
        setProducts(updatedProducts);
        updateNestedDocumentField(['data', 'addedProducts'], updatedProducts);
        showMessage('RemovedItemFromPreventive', 'success');
    }, [products, updateNestedDocumentField, showMessage]);

    const handleMoveUp = useCallback((index: number) => {
        if (index === 0) return;
        const updatedProducts = [...products];
        [updatedProducts[index - 1], updatedProducts[index]] = [updatedProducts[index], updatedProducts[index - 1]];

        setProducts(updatedProducts);
        updateNestedDocumentField(['data', 'addedProducts'], updatedProducts);
    }, [products, updateNestedDocumentField]);

    const handleMoveDown = useCallback((index: number) => {
        if (index === products.length - 1) return;
        const updatedProducts = [...products];
        [updatedProducts[index + 1], updatedProducts[index]] = [updatedProducts[index], updatedProducts[index + 1]];
        setProducts(updatedProducts);
        updateNestedDocumentField(['data', 'addedProducts'], updatedProducts);
    }, [products, updateNestedDocumentField]);

    const handleCloseSnackbar = useCallback((event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        } else {
            window.location.reload();
        }
    }, []);

    const handlePaymentTermsChange = useCallback((value: string) => {
        console.log('Active Change: Payment terms updated');
        setPaymentTerms(value);
        updateNestedDocumentField(['data', 'paymentTerms'], value);
    }, [updateNestedDocumentField]);

    const toggleComponentsExpanded = useCallback((productIndex: number) => {
        console.log('⚡ PERFORMANCE: toggleComponentsExpanded called', {
            productIndex,
            timestamp: Date.now()
        });
        setExpandedComponents(prev => ({
            ...prev,
            [productIndex]: !prev[productIndex]
        }));
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Box>{t(error)}</Box>;
    }

    if (!originalDocumentData) {
        return <Box>{t('No document data available')}</Box>;
    }

    return (
        <Box sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            background: '#fff',
            p: 3,
            paddingBottom: '300px',
            marginBottom: '300px'
        }}>
            {activeRevisionLabel && (
                <Box>
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="info"
                        sx={{ position: 'fixed', zIndex: 9999, backgroundColor: '#ffef4c', color: 'black' }}
                        iconMapping={{
                            info: <FlagIcon fontSize="inherit" />
                        }}
                    >
                        {t('YouAreViewing', { activeRevisionLabel })}
                    </Alert>
                </Box>
            )}

            <ClientPreventiveHeadComponent />

            {/* LIST OF PRODUCTS */}
            <Box sx={{ mt: 4, mb: 6 }}>
                {products.length === 0 ? (
                    <Box sx={{
                        py: 4,
                        textAlign: 'center',
                        color: 'text.secondary',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 1
                    }}>
                        {t('NoItemsYet')}
                    </Box>
                ) : (
                    (() => {
                        console.log('🏭 PERFORMANCE: Rendering products list', {
                            productsCount: products.length,
                            timestamp: Date.now()
                        });
                        return products.map((product, productIndex) => (
                            <ProductItem
                                key={product.id}
                                product={product}
                                productIndex={productIndex}
                                user={user}
                                t={t}
                                handleInputChange={handleInputChange}
                                handleComponentsChange={handleComponentsChange}
                                toggleComponentsExpanded={toggleComponentsExpanded}
                                calculateDiscountedPrice={calculateDiscountedPrice}
                                handleRemoveProduct={handleRemoveProduct}
                                handleMoveUp={handleMoveUp}
                                handleMoveDown={handleMoveDown}
                                expandedComponents={expandedComponents}
                                products={products}
                                formatPrice={formatPrice}
                                priceStyles={priceStyles}
                            />
                        ));
                    })()
                )}
            </Box>

            {/* ADD PRODUCT BUTTON (VISIBLE TO AUTHORIZED USERS) */}
            {user?.id && (
                <Box textAlign="center" sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddProduct}
                    >
                        {t("AddProduct")}
                    </Button>
                </Box>
            )}

            {/* SEARCH MODAL */}
            {user?.id && (
                <Dialog open={isSearchModalOpen} onClose={handleCloseSearchModal} maxWidth="lg" fullWidth>
                    <DialogTitle>{t("SearchAndAddProduct")}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={t("SearchProducts")}
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Box sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
                            {filteredProducts.map((product) => (
                                <Box
                                    key={product.id}
                                    sx={{
                                        p: 2,
                                        border: '1px solid #ccc',
                                        borderRadius: 1,
                                        mb: 1,
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}
                                    onClick={() => handleSelectProduct(product)}
                                >
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography variant="body2">{product.description}</Typography>
                                    <Typography variant="subtitle1">{formatPrice(product.price)}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSearchModal}>{t("Cancel")}</Button>
                    </DialogActions>
                </Dialog>
            )}

            {/* PAYMENT TERMS SECTION */}
            <Box sx={{
                mb: 6,
                mt: 4,
                p: 4,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: '#fafafa'
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        color: 'text.primary'
                    }}
                >
                    <Box
                        sx={{
                            mr: 1.5,
                            p: 0.5,
                            borderRadius: '50%',
                            backgroundColor: 'primary.light',
                            color: 'white'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                        </svg>
                    </Box>
                    {t("PaymentTerms")}
                </Typography>

                <Box sx={{
                    backgroundColor: 'white',
                    p: 2,
                    borderRadius: 1,
                    border: '1px solid #eaeaea'
                }}>
                    {user?.id ? (
                        <MarkdownEditor
                            value={paymentTerms}
                            onChange={handlePaymentTermsChange}
                            readOnly={!user?.id}
                        />
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 1.6,
                                fontWeight: paymentTerms.includes('MODALITA') ? 'medium' : 'normal'
                            }}
                        >
                            {paymentTerms}
                        </Typography>
                    )}
                </Box>

                {user?.id && (
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            mt: 1,
                            color: 'text.secondary',
                            fontStyle: 'italic'
                        }}
                    >
                        {t("EditPaymentTermsInfo", "Edit the payment terms above to customize the conditions")}
                    </Typography>
                )}
            </Box>

            {/* PRICE SUMMARY */}
            <Box sx={{ mb: 6 }}>
                <PriceSummary />
            </Box>

            {/* SIGNATURE FOOTER */}
            <Box sx={{ mb: 6 }}>
                <DocumentFooter />
            </Box>
        </Box>
    );
});

export default PreventiveForm;
