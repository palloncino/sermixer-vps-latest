import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableRow, Tooltip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTranslation } from 'react-i18next';
import { ProductType, ComponentType } from '../../types';
import { formatPrice, priceStyles } from '../../utils/format-price';

interface ProductPriceSummaryProps {
    product: ProductType;
    components: ComponentType[];
}

const ProductPriceSummary: React.FC<ProductPriceSummaryProps> = ({ product, components }) => {
    const { t } = useTranslation();
    const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);

    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price * (1 - discount / 100);
    };

    const componentTotal = components.reduce((total, component) => {
        if (component.included) {
            const componentPrice = parseFloat(component.price?.toString() || '0') || 0;
            const componentDiscount = component.discount || 0;
            const componentQuantity = component.quantity || 1;
            
            if (isNaN(componentPrice) || isNaN(componentQuantity)) {
                return total;
            }
            
            const discountedPrice = calculateDiscountedPrice(componentPrice, componentDiscount);
            const componentTotal = discountedPrice * componentQuantity;
            
            return total + componentTotal;
        }
        return total;
    }, 0);

    const productPrice = parseFloat(product.price?.toString() || '0') || 0;
    const productDiscount = product.discount || 0;
    
    if (isNaN(productPrice)) {
        return (
            <Box sx={{ mt: 3, p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 1, backgroundColor: 'error.light' }}>
                <Typography variant="h6" color="error" gutterBottom>{t("Error")}</Typography>
                <Typography color="error">{t("Invalid product price data")}</Typography>
            </Box>
        );
    }
    
    const productDiscountedPrice = calculateDiscountedPrice(productPrice, productDiscount);
    const totalPrice = productDiscountedPrice + componentTotal;

    return (
        <Box sx={{ 
            mt: 2, 
            p: 2, 
            border: '1px solid', 
            borderColor: 'divider', 
            borderRadius: 1,
            backgroundColor: 'background.paper'
        }}>
            {/* Header */}
            <Box sx={{ 
                mb: 2,
                pb: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {t("ProductPriceSummary")}
                </Typography>
            </Box>

            {/* Main Price Breakdown */}
            <Box sx={{ mb: 1.5 }}>
                {/* Product Price Row */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    py: 1,
                    px: 1.5,
                    backgroundColor: 'grey.50',
                    borderRadius: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {t("ProductPrice")}
                        </Typography>
                    </Box>
                    <Box sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        flexWrap: 'nowrap',
                        whiteSpace: 'nowrap'
                    }}>
                        {productDiscount > 0 ? (
                            <>
                                <Typography variant="body2" sx={{ 
                                    color: 'text.secondary', 
                                    textDecoration: 'line-through',
                                    fontSize: '0.85rem',
                                    ...priceStyles
                                }}>
                                    {formatPrice(productPrice)}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: 'error.main',
                                    fontSize: '0.75rem'
                                }}>
                                    -{productDiscount}%
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                    color: 'text.primary',
                                    fontSize: '0.9rem',
                                    ...priceStyles,
                                    fontWeight: 600
                                }}>
                                    = {formatPrice(productDiscountedPrice)}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2" sx={{ 
                                fontSize: '0.9rem',
                                ...priceStyles,
                                fontWeight: 600
                            }}>
                                {formatPrice(productPrice)}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Components Total Row - Always visible to maintain consistent height */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1,
                    py: 1,
                    px: 1.5,
                    backgroundColor: 'grey.50',
                    borderRadius: 1
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {t("ComponentsTotal")}
                        </Typography>
                        {(() => {
                            const hasDiscountedComponents = components.some(component => 
                                component.included && (component.discount || 0) > 0
                            );
                            return hasDiscountedComponents && componentTotal > 0 && (
                                <Tooltip 
                                    title={t("IncludeDiscountForSomeOrAllItems")}
                                    arrow
                                    placement="top"
                                >
                                    <FiberManualRecordIcon 
                                        sx={{ 
                                            color: 'error.main', 
                                            fontSize: '0.5rem',
                                            cursor: 'help'
                                        }} 
                                    />
                                </Tooltip>
                            );
                        })()}
                    </Box>
                    {componentTotal > 0 ? (
                        <Typography variant="body2" sx={{ ...priceStyles, fontWeight: 600 }}>
                            {formatPrice(componentTotal)}
                        </Typography>
                    ) : (
                        <Typography variant="body2" sx={{ 
                            fontWeight: 400, 
                            color: 'text.secondary',
                            fontStyle: 'italic'
                        }}>
                            {t("NoComponentsAvailable", "Nessun componente")}
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Detailed Breakdown (Collapsible) */}
            {components.length > 0 && (
                <Box sx={{ 
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 1
                }}>
                    <Typography 
                        variant="caption" 
                        onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
                        sx={{ 
                            color: 'primary.main',
                            cursor: 'pointer',
                            display: 'block',
                            textAlign: 'center',
                            fontWeight: 500,
                            '&:hover': { color: 'primary.dark', textDecoration: 'underline' }
                        }}
                    >
                        {isBreakdownExpanded ? t("Hide detailed breakdown") : t("Show detailed breakdown")}
                    </Typography>
                    
                    {/* Component Details Table */}
                    {isBreakdownExpanded && (
                    <Box sx={{ mt: 1 }}>
                        <Table size="small" sx={{ 
                            tableLayout: 'fixed',
                            width: '100%',
                            '& .MuiTableCell-root': {
                                border: 'none',
                                py: 0.5,
                                px: 1,
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                                verticalAlign: 'top'
                            }
                        }}>
                            <TableBody>
                                {components.filter(c => c.included).map((component, index) => {
                                    const compPrice = parseFloat(component.price?.toString() || '0') || 0;
                                    const compDiscount = component.discount || 0;
                                    const compQuantity = component.quantity || 1;
                                    const compDiscountedPrice = calculateDiscountedPrice(compPrice, compDiscount);
                                    const compTotal = compDiscountedPrice * compQuantity;
                                    
                                    return (
                                        <TableRow 
                                            key={index}
                                            sx={{ 
                                                backgroundColor: index % 2 === 1 ? 'grey.50' : 'transparent',
                                                '&:hover': {
                                                    backgroundColor: index % 2 === 1 ? 'grey.100' : 'grey.50'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{ width: '60%' }}>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    overflow: 'hidden'
                                                }}>
                                                    <Typography variant="body2" sx={{ 
                                                        fontWeight: 500,
                                                        fontSize: '0.8rem',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        flex: 1
                                                    }}>
                                                        {component.name}
                                                    </Typography>
                                                    {compQuantity > 1 && (
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'text.secondary', 
                                                            fontSize: '0.7rem',
                                                            flexShrink: 0
                                                        }}>
                                                            (×{compQuantity})
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right" sx={{ width: '40%' }}>
                                                {compDiscount > 0 ? (
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-end',
                                                        gap: 0.5,
                                                        flexWrap: 'nowrap'
                                                    }}>
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'text.secondary',
                                                            textDecoration: 'line-through',
                                                            fontSize: '0.7rem',
                                                            ...priceStyles
                                                        }}>
                                                            {formatPrice(compPrice)}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'error.main', 
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            -{compDiscount}%
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ 
                                                            fontSize: '0.8rem',
                                                            ...priceStyles,
                                                            fontWeight: 600
                                                        }}>
                                                            = {formatPrice(compTotal)}
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography variant="caption" sx={{ 
                                                        fontSize: '0.8rem',
                                                        ...priceStyles,
                                                        fontWeight: 600
                                                    }}>
                                                        {formatPrice(compPrice)}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                    )}
                </Box>
            )}

            {/* Final Total - Redesigned */}
            <Box sx={{ 
                mt: 2,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'baseline'
                }}>
                    <Typography variant="subtitle1" sx={{ 
                        fontWeight: 600, 
                        color: 'text.primary',
                        fontSize: '1rem'
                    }}>
                        {t("TotalPrice")}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ 
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            fontStyle: 'italic'
                        }}>
                            ({t('WithoutTaxes')})
                        </Typography>
                        <Typography variant="h5" sx={{ 
                            color: 'primary.main',
                            fontSize: '1.5rem',
                            ...priceStyles,
                            fontWeight: 700
                        }}>
                            {formatPrice(totalPrice)}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ProductPriceSummary;