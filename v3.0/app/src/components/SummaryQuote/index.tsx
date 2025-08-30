import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
    Box, Button, Grid, IconButton,
    Typography, styled, Fab
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback, useEffect, useState } from "react";
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

    useEffect(() => {
        // Only update if products actually changed (deep comparison)
        const currentProductIds = editableProducts.map(p => p.id).join(',');
        const newProductIds = addedProducts.map(p => p.id).join(',');
        
        if (currentProductIds !== newProductIds) {
            setEditableProducts(addedProducts.map(product => ({
                ...product,
                components: product.components.map(component => ({
                    ...component,
                    included: component.included ?? false
                }))
            })));
        }
    }, [addedProducts, editableProducts]);

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

    const handleInputChange = useCallback((index: number, field: string, value: string) => {
        // Only update if the value actually changed
        const currentProduct = editableProducts[index];
        if (currentProduct && currentProduct[field] === value) {
            return;
        }
        
        const updatedProducts = editableProducts.map((product, i) =>
            i === index ? { ...product, [field]: value } : product
        );
        setEditableProducts(updatedProducts);
        onAddedProductsChange(updatedProducts);
    }, [editableProducts, onAddedProductsChange]);

    const handleProductRemove = useCallback((productIndex: number) => {
        const updatedProducts = editableProducts.filter((_, i) => i !== productIndex);
        setEditableProducts(updatedProducts);
        onAddedProductsChange(updatedProducts);
        showMessage(t('productRemoved'), 'info');
    }, [editableProducts, onAddedProductsChange, showMessage, t]);

    const handleComponentsChange = useCallback((productIndex: number, updatedComponents: ComponentType[]) => {
        setEditableProducts((prevProducts) => {
            const newProducts = prevProducts.map((product, i) =>
                i === productIndex
                    ? { ...product, components: updatedComponents }
                    : product
            );
            onAddedProductsChange(newProducts); // Ensure this is called with the updated products
            return newProducts;
        });
    }, [onAddedProductsChange]);

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
                price: parseFloat(product.price),
                components: product.components?.map(component => ({
                    ...component,
                    price: parseFloat(component.price),
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
                        label={t("Note")}
                        name="note"
                        value={note}
                        onChange={handleNoteChange}
                        readOnly={false}
                        minRows={5}
                    />
                </Box>
            </SectionBorderContainer>
            <Box mt={4} display="flex" justifyContent="center">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={preHandleSubmit}
                    sx={{ width: '200px', height: '50px' }}
                >
                    {t("Submit")}
                </Button>
            </Box>

            {/* Reset Quote Floating Action Button */}
            <Tooltip title={t("Reset Quote")} placement="left" arrow>
                <Fab
                    color="secondary"
                    size="small"
                    onClick={handleResetQuote}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        '&:hover': {
                            backgroundColor: 'error.main',
                            transform: 'scale(1.1)',
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
                                        color: 'inherit',
                                        '&:hover': { color: 'red' }
                                    }}
                                    onClick={() => onProductRemove(productIndex)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </HeaderBox>
                        <ProductImage src={product.imgUrl} alt={product.name} />
                        <EuroTextField
                            label={t("ProductPrice")}
                            value={product.price}
                            onChange={(value) => onInputChange(productIndex, 'price', value)}
                            margin="dense"
                            fullWidth
                        />
                        <Box mt={2}>
                            <Typography variant="subtitle1">{t("Description")}</Typography>
                            <MarkdownEditor
                                value={product.description || ""}
                                onChange={(value) => onInputChange(productIndex, 'description', value)}
                            />
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box>
                        <Typography variant="h5" mb={2}>{t("Components")}</Typography>
                        <SummaryComponentList
                            components={product.components || []}
                            onComponentChange={(updatedComponents) => onComponentsChange(productIndex, updatedComponents)}
                        />
                    </Box>
                </Grid>
            </Grid>
        </ProductContainer>
    );
});

MemoizedProductItem.displayName = 'MemoizedProductItem';