import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Box, Grid, IconButton,
    Typography, styled, Fab
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import { useFlashMessage } from 'state/FlashMessageContext';
import { SectionBorderContainer } from "../../constants/index";
import { useAppState } from "../../state/stateContext";
import { ClientType, ComponentType, ProductType, QuoteHeadDetailsType } from '../../types/index';
import EuroTextField from '../EuroTextField/index';
import MarkdownEditor from '../MarkdownEditor/index';
import PageHeader from "../PageHeader/index";
import SummaryComponentList from "./SummaryComponentList";
import Button from '../Button';

type SummaryQuoteP = {
    quoteHeadDetails: QuoteHeadDetailsType;
    selectedClient: ClientType | null;
    addedProducts: ProductType[];
    onAddedProductsChange: (updatedProducts: ProductType[]) => void;
    onQuoteHeadDetailsChange: (details: QuoteHeadDetailsType) => void;
    onSelectedClientChange: (client: ClientType | null) => void;
    handleSubmit: any;
    discount: any;
}

const SummaryQuote = ({
    quoteHeadDetails,
    selectedClient,
    addedProducts,
    onAddedProductsChange,
    onQuoteHeadDetailsChange,
    onSelectedClientChange,
    handleSubmit,
    discount,
}: SummaryQuoteP) => {

    const { t } = useTranslation();
    const { showMessage } = useFlashMessage();
    const { user } = useAppState();
    const [editableProducts, setEditableProducts] = useState<ProductType[]>([]);
    const [note, setNote] = useState("");
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastAddedProductsRef = useRef<string>('');

    // Initialize editableProducts only when addedProducts actually changes
    useEffect(() => {
        const currentIds = addedProducts.map(p => p.id).sort().join(',');
        
        if (lastAddedProductsRef.current !== currentIds) {
            lastAddedProductsRef.current = currentIds;
            setEditableProducts(prevProducts => {
                // Only update if the products actually changed
                if (prevProducts.length !== addedProducts.length || 
                    !prevProducts.every((p, i) => p.id === addedProducts[i]?.id)) {
                    return addedProducts.map(product => ({
                        ...product,
                        components: product.components?.map(component => ({
                            ...component,
                            included: component.included ?? false
                        })) || []
                    }));
                }
                return prevProducts;
            });
        }
    }, [addedProducts]);

    // Add page refresh confirmation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Cleanup debounce timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    // Create stable callbacks using refs to prevent re-renders
    const onAddedProductsChangeRef = useRef(onAddedProductsChange);
    onAddedProductsChangeRef.current = onAddedProductsChange;

    // Create stable callbacks using useCallback to prevent re-renders
    const handleInputChange = useCallback((index: number, field: string, value: string) => {
        console.log(`🚀 handleInputChange called - Field: ${field}, Index: ${index}, Value length: ${value.length}`);
        
        // For description field, use debouncing to reduce update frequency
        if (field === 'description') {
            // Clear existing timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            
            // Set new timeout
            debounceTimeoutRef.current = setTimeout(() => {
                setEditableProducts(prevProducts => {
                    const currentProduct = prevProducts[index];
                    if (currentProduct && (currentProduct as any)[field] === value) {
                        console.log(`⏭️ handleInputChange (debounced) skipped - No change detected`);
                        return prevProducts;
                    }
                    
                    console.log(`📝 handleInputChange (debounced) updating - Field: ${field}, Index: ${index}`);
                    
                    const updatedProducts = prevProducts.map((product, i) =>
                        i === index ? { ...product, [field as keyof ProductType]: value } : product
                    );
                    
                    // Only call onAddedProductsChange if the value actually changed
                    if (currentProduct && (currentProduct as any)[field] !== value) {
                        console.log(`🔄 handleInputChange (debounced) calling onAddedProductsChange`);
                        onAddedProductsChangeRef.current(updatedProducts);
                    }
                    
                    return updatedProducts;
                });
            }, 500); // 500ms debounce delay for better performance
        } else {
            // For other fields, update immediately
            setEditableProducts(prevProducts => {
                const currentProduct = prevProducts[index];
                if (currentProduct && (currentProduct as any)[field] === value) {
                    console.log(`⏭️ handleInputChange skipped - No change detected`);
                    return prevProducts;
                }
                
                console.log(`📝 handleInputChange updating - Field: ${field}, Index: ${index}`);
                
                const updatedProducts = prevProducts.map((product, i) =>
                    i === index ? { ...product, [field as keyof ProductType]: value } : product
                );
                
                console.log(`🔄 handleInputChange calling onAddedProductsChange`);
                onAddedProductsChangeRef.current(updatedProducts);
                
                return updatedProducts;
            });
        }
    }, []); // Empty dependency array since we use refs

    const handleProductRemove = useCallback((productIndex: number) => {
        setEditableProducts(prevProducts => {
            const updatedProducts = prevProducts.filter((_, i) => i !== productIndex);
            onAddedProductsChangeRef.current(updatedProducts);
            return updatedProducts;
        });
        showMessage(t('productRemoved'), 'info');
    }, [showMessage, t]);

    const handleComponentsChange = useCallback((productIndex: number, updatedComponents: ComponentType[]) => {
        setEditableProducts((prevProducts) => {
            const newProducts = prevProducts.map((product, i) =>
                i === productIndex
                    ? { ...product, components: updatedComponents }
                    : product
            );
            onAddedProductsChangeRef.current(newProducts);
            return newProducts;
        });
    }, []);


    const preHandleSubmit = () => {

        if (!selectedClient) {
            const errorMsg = "Client must be selected.";
            showMessage(errorMsg, 'error');
            return;
        }

        if (!quoteHeadDetails.company || !quoteHeadDetails.object) {
            const errorMsg = "Company and Object fields must be filled out.";
            showMessage(errorMsg, 'error');
            return;
        }

        if (editableProducts.length === 0) {
            const errorMsg = "At least one product must be added.";
            showMessage(errorMsg, 'error');
            return;
        }

        const quoteSummary = {
            quoteHeadDetails,
            selectedClient,
            addedProducts: editableProducts.map(product => ({
                ...product,
                price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
                components: product.components?.map(component => ({
                    ...component,
                    price: typeof component.price === 'string' ? parseFloat(component.price) : component.price,
                    quantity: component.quantity // Include quantity here
                })),
            })),
            discount,
            note,
            employeeID: user?.id,
        };
        handleSubmit(quoteSummary);
    };

    const handleNoteChange = useCallback((value: string) => {
        setNote(value);
    }, []);

    const handleResetQuote = useCallback(() => {
        if (window.confirm('Are you sure you want to reset the quote? This will clear all products, notes, and details.')) {
            // Clear all data
            setEditableProducts([]);
            setNote("");
            onAddedProductsChange([]);
            onQuoteHeadDetailsChange({ company: '', object: '', description: '' });
            onSelectedClientChange(null);
            
            // Show success message
            showMessage(t('Quote reset successfully'), 'success');
        }
    }, [onAddedProductsChange, onQuoteHeadDetailsChange, onSelectedClientChange, showMessage, t]);



    return (
        <>
            <SectionBorderContainer>
                <PageHeader title={t("Preview")} description={t("preventivePreviewDescription")} />
                
                {!editableProducts.length ? (
                    <EmptyState>{t('NoItemsYet')}</EmptyState>
                ) : (
                    editableProducts.map((product, productIndex) => (
                        <MemoizedProductItem
                            key={product.id}
                            product={product}
                            productIndex={productIndex}
                            onInputChange={handleInputChange}
                            onProductRemove={handleProductRemove}
                            onComponentsChange={handleComponentsChange}
                            t={t}
                        />
                    ))
                )}
                <Box mb={2}>
                    <PageHeader title={t("Notes")} description={t("InternalNotesDescription")} />
                    <MarkdownEditor
                        value={note}
                        onChange={handleNoteChange}
                        readOnly={false}
                    />
                </Box>
            </SectionBorderContainer>
            <Box mt={4} display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    onClick={preHandleSubmit}
                    size="large"
                    sx={{ width: '200px', height: '50px' }}
                >
                    {t("Submit")}
                </Button>
            </Box>

            {/* Reset Quote Floating Action Button */}
            <Tooltip title={t("Reset Quote")} placement="left" arrow>
                <Fab
                    size="small"
                    onClick={handleResetQuote}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: '2px solid #000000',
                        '&:hover': {
                            backgroundColor: '#333333',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    <RefreshIcon />
                </Fab>
            </Tooltip>


        </>
    );
};

export default React.memo(SummaryQuote);

const EmptyState = styled(Box)({
    height: '200px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed #ccc',
    borderRadius: '4px',
    color: '#666',
});

const ProductContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    borderBottom: '1px solid #eee',
    paddingBottom: theme.spacing(4),
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const HeaderBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
});

const ProductImage = styled('img')({
    maxWidth: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    marginBottom: '16px',
});

const ProductNameLink = styled(Link)({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
});

// Memoized Product Item Component for Performance
const MemoizedProductItem = React.memo(({ 
    product, 
    productIndex, 
    onInputChange, 
    onProductRemove, 
    onComponentsChange, 
    t 
}: {
    product: ProductType;
    productIndex: number;
    onInputChange: (index: number, field: string, value: string) => void;
    onProductRemove: (index: number) => void;
    onComponentsChange: (index: number, components: ComponentType[]) => void;
    t: any;
}) => {
    const renderCountRef = React.useRef(0);
    renderCountRef.current += 1;
    console.log(`🔄 MemoizedProductItem render #${renderCountRef.current} - Product: ${product.name}, Index: ${productIndex}`);
    
    // Create stable callbacks to prevent re-renders
    const handlePriceChange = useCallback((value: string) => {
        onInputChange(productIndex, 'price', value);
    }, [onInputChange, productIndex]);

    const handleDescriptionChange = useCallback((value: string) => {
        onInputChange(productIndex, 'description', value);
    }, [onInputChange, productIndex]);

    const handleRemove = useCallback(() => {
        onProductRemove(productIndex);
    }, [onProductRemove, productIndex]);

    const handleComponentsChange = useCallback((updatedComponents: ComponentType[]) => {
        onComponentsChange(productIndex, updatedComponents);
    }, [onComponentsChange, productIndex]);

    return (
        <ProductContainer>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box>
                        <HeaderBox>
                            <ProductNameLink to={`/product/${product.id}`}>
                                <Typography variant="h4">{product.name}</Typography>
                            </ProductNameLink>
                            <Tooltip title={t("Remove Product")} arrow>
                                <IconButton
                                    sx={{
                                        height: '100%',
                                        alignSelf: 'baseline',
                                        color: '#000000',
                                        border: '2px solid #000000',
                                        borderRadius: 1,
                                        backgroundColor: 'transparent',
                                        '&:hover': {
                                            backgroundColor: '#000000',
                                            color: '#ffffff',
                                        },
                                    }}
                                    onClick={handleRemove}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </HeaderBox>
                        <ProductImage src={product.imgUrl} alt={product.name} />
                        <EuroTextField
                            label={t("ProductPrice")}
                            value={product.price.toString()}
                            onChange={handlePriceChange}
                            fullWidth
                        />
                        <Box mt={2}>
                            <Typography variant="subtitle1">{t("Description")}</Typography>
                            <MarkdownEditor
                                value={product.description || ""}
                                onChange={handleDescriptionChange}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h5" mb={2}>{t("Components")}</Typography>
                        <SummaryComponentList
                            components={product.components || []}
                            onComponentChange={handleComponentsChange}
                        />
                    </Box>
                </Grid>
            </Grid>
        </ProductContainer>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function for better memoization
    // Only compare the actual product data, not the callback functions
    const componentsEqual = prevProps.product.components?.length === nextProps.product.components?.length &&
        (prevProps.product.components?.every((comp, index) => 
            comp.id === nextProps.product.components?.[index]?.id &&
            comp.name === nextProps.product.components?.[index]?.name &&
            comp.price === nextProps.product.components?.[index]?.price &&
            comp.included === nextProps.product.components?.[index]?.included &&
            comp.discount === nextProps.product.components?.[index]?.discount &&
            comp.quantity === nextProps.product.components?.[index]?.quantity
        ) ?? true);
    
    return (
        prevProps.product.id === nextProps.product.id &&
        prevProps.product.name === nextProps.product.name &&
        prevProps.product.price === nextProps.product.price &&
        prevProps.product.description === nextProps.product.description &&
        prevProps.product.imgUrl === nextProps.product.imgUrl &&
        prevProps.productIndex === nextProps.productIndex &&
        componentsEqual
    );
});

MemoizedProductItem.displayName = 'MemoizedProductItem';