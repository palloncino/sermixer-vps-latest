import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Checkbox, Divider, FormControlLabel, Grid, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from "react-markdown";
import { NumericFormat } from 'react-number-format';
import styled from "styled-components";
import EuroTextField from "../../../components/EuroTextField/index.tsx";
import MarkdownEditor from "../../../components/MarkdownEditor/index.tsx";
import { useDiscount } from '../../../hooks/useDiscount.ts';
import { useSharedDocument } from "../../../hooks/useSharedDocument.ts";
import { ProductType } from '../../../types/index.ts';
import ProductComponent from "./ProductComponent.tsx";

interface ProductProps {
    product: ProductType;
    updateProduct: (updatedProduct: ProductType) => void;
}

const Product: React.FC<ProductProps> = ({
    product,
    updateProduct,
}) => {
    const { t } = useTranslation();
    const { theActor } = useSharedDocument();
    const readOnly = theActor?.type !== 'employee';

    const [componentSelection, setComponentSelection] = useState<{ [key: string]: boolean }>({});
    const [editableComponentPrices, setEditableComponentPrices] = useState<{ [key: string]: string }>({});
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [showDiscountInput, setShowDiscountInput] = useState<boolean>(false);
    const [applyToComponents, setApplyToComponents] = useState<boolean>(false);

    const {
        price: editablePrice,
        discount: editableDiscount,
        discountedPrice: editableDiscountedPrice,
        handlePriceChange,
        handleDiscountChange,
        handleDiscountedPriceChange,
        resetDiscount
    } = useDiscount(product.price, product.discount);

    useEffect(() => {
        const selection: { [key: string]: boolean } = {};
        const prices: { [key: string]: string } = {};

        product.components?.forEach((component) => {
            selection[component.name] = component.included ?? true;
            prices[component.name] = `${component.price}`;
        });

        setComponentSelection(selection);
        setEditableComponentPrices(prices);

        if (product.discount) {
            setShowDiscountInput(true); // Ensure discount input is shown if there is an initial discount
        }

    }, [product]);

    const handleProductPriceChange = useCallback((value: string) => {
        if (readOnly) return;
        handlePriceChange(parseFloat(value));
        updateProduct({ ...product, price: parseFloat(value) });
    }, [handlePriceChange, updateProduct, product, readOnly]);

    const handleProductDiscountChange = useCallback((values: { value: string }) => {
        if (readOnly) return;
        const discount = Math.max(1, parseFloat(values.value));
        handleDiscountChange(discount);
        updateProduct({ ...product, discount });

        if (applyToComponents) {
            applyDiscountToComponents(discount);
        }
    }, [applyToComponents, handleDiscountChange, updateProduct, product, readOnly]);

    const handleProductDiscountedPriceChange = useCallback((value: string) => {
        if (readOnly) return;
        const discountedPrice = parseFloat(value);
        handleDiscountedPriceChange(discountedPrice);

        const price = parseFloat(editablePrice);
        const discount = 100 - ((discountedPrice / price) * 100);
        handleDiscountChange(discount);
        updateProduct({ ...product, discount });

        if (applyToComponents) {
            applyDiscountToComponents(discount);
        }
    }, [applyToComponents, handleDiscountChange, handleDiscountedPriceChange, updateProduct, product, editablePrice, readOnly]);

    const applyDiscountToComponents = useCallback((discount: number) => {
        if (readOnly) return;
        const updatedComponents = product.components.map(component => ({
            ...component,
            discount,
            discountedPrice: calculateDiscountedPrice(component.price, discount),
        }));

        updateProduct({ ...product, components: updatedComponents });
    }, [product, updateProduct, readOnly]);

    const toggleDiscountInput = () => {
        if (readOnly) return;
        setShowDiscountInput(!showDiscountInput);
        if (!showDiscountInput) {
            handleDiscountChange(10);
            updateProduct({ ...product, discount: 10 });
        }
    };

    const removeDiscount = () => {
        if (readOnly) return;
        resetDiscount();
        setShowDiscountInput(false);
        setApplyToComponents(false);
        updateProduct({ ...product, discount: null });
    };

    const handleDescriptionChange = (newDescription: string) => {
        if (readOnly) return;
        updateProduct({ ...product, description: newDescription });
    };

    const handleComponentSelection = (name: string) => {
        const updatedSelection = !componentSelection[name];
        setComponentSelection((prev) => ({
            ...prev,
            [name]: updatedSelection,
        }));

        const updatedComponents = product.components.map(component =>
            component.name === name ? { ...component, included: updatedSelection } : component
        );

        updateProduct({ ...product, components: updatedComponents });
    };

    const handleComponentPriceChange = (name: string, value: string) => {
        if (readOnly) return;
        setEditableComponentPrices((prev) => ({
            ...prev,
            [name]: value,
        }));

        const updatedComponents = product.components.map(component =>
            component.name === name ? { ...component, price: parseFloat(value) } : component
        );

        updateProduct({ ...product, components: updatedComponents });
    };

    const handleComponentDiscountChange = (name: string, discount: number | null) => {
        if (readOnly) return;
        const updatedComponents = product.components.map(component =>
            component.name === name ? { ...component, discount } : component
        );

        updateProduct({ ...product, components: updatedComponents });
    };

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleApplyToComponentsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;
        setApplyToComponents(event.target.checked);
        if (event.target.checked && editableDiscount) {
            applyDiscountToComponents(editableDiscount);
        }
    };

    const calculateDiscountedPrice = (price: number, discount: number) => {
        return price - (price * discount) / 100;
    };

    return (
        <div key={product.id} style={{ padding: "1rem" }}>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <StickyImagePreview>
                        {product.imgUrl ? (
                            <img src={product.imgUrl} alt={product.name} />
                        ) : (
                            <Typography variant="subtitle1">{t("NoImageAvailable")}</Typography>
                        )}
                    </StickyImagePreview>
                </Grid>
                <Grid item xs={9}>
                    <Box mb={4} display="flex" alignItems="center">
                        <Box>
                            <Typography gutterBottom variant="h5" component="h2">
                                {product.name}
                            </Typography>
                            <Box display="flex" gap={2}>
                                <Typography variant="body2">
                                    {t("ID")}: <strong>{product.id}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    {t("Category")}: <strong>{product.category}</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" alignItems="flex-start" gap={'1rem'}>
                        {!showDiscountInput ? (
                            <>
                                {readOnly ? (
                                    <Box>
                                        <Typography variant="body2">{t("Price")}: {editablePrice.toFixed(2)} {t("EUR")}</Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <EuroTextField
                                            key={product.id}
                                            label={t("Price")}
                                            value={editablePrice.toString()}
                                            onChange={(value) => handleProductPriceChange(value)}
                                            readOnly={readOnly}
                                        />
                                        <IconButton sx={{ marginTop: '4px' }} onClick={toggleDiscountInput} size="large">
                                            <AddIcon />
                                        </IconButton>
                                    </>
                                )}
                            </>
                        ) : (
                            <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                                <Box sx={{ marginRight: '10px' }}>
                                    {readOnly ? (
                                        <Typography variant="body2">{t("Discount")}: {editableDiscount.toFixed(2)}%</Typography>
                                    ) : (
                                        <NumericFormat
                                            label={t("Discount (%)")}
                                            value={editableDiscount?.toString() || ""}
                                            onValueChange={(values) => handleProductDiscountChange(values)}
                                            customInput={TextField}
                                            decimalScale={2}
                                            suffix="%"
                                            InputProps={{ inputProps: { min: 1, max: 100 } }}
                                            type="text"
                                            readOnly={readOnly}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ marginRight: '10px' }}>
                                    {readOnly ? (
                                        <Typography variant="body2">{t("Discounted Price")}: {editableDiscountedPrice.toFixed(2)} {t("EUR")}</Typography>
                                    ) : (
                                        <EuroTextField
                                            label={t("Discounted Price")}
                                            value={editableDiscountedPrice?.toString() || ""}
                                            onChange={(value) => handleProductDiscountedPriceChange(value)}
                                            readOnly={readOnly}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ marginRight: '10px' }}>
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                                        {editablePrice} {t("EUR")}
                                    </Typography>
                                </Box>
                                {!readOnly && (
                                    <>
                                        <IconButton onClick={removeDiscount} size="large">
                                            <CloseIcon />
                                        </IconButton>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={applyToComponents}
                                                    onChange={handleApplyToComponentsChange}
                                                    disabled={readOnly}
                                                />
                                            }
                                            label={t("ApplyToComponents")}
                                        />
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>

                    <Box>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="Edit" />
                            <Tab label="Preview" />
                        </Tabs>
                        {tabIndex === 0 && (
                            <MarkdownEditor
                                value={product.description}
                                onChange={handleDescriptionChange}
                                readOnly={readOnly}
                            />
                        )}
                        {tabIndex === 1 && (
                            <Box p={2} style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                                <Typography variant="body1">
                                    <ReactMarkdown>{product.description}</ReactMarkdown>
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ my: 4 }}>{t("Components")}</Divider>
                    {product.components && product.components.length > 0 ? (
                        <Box>
                            {product.components.map((component, index) => (
                                <React.Fragment key={index}>
                                    <ProductComponent
                                        component={component}
                                        editablePrice={editableComponentPrices}
                                        componentSelection={componentSelection}
                                        handleComponentSelection={handleComponentSelection}
                                        handleComponentPriceChange={handleComponentPriceChange}
                                        handleComponentDiscountChange={handleComponentDiscountChange} // Added prop for discount change
                                        readOnly={readOnly}
                                    />
                                    <Divider sx={{ my: 2 }} />
                                </React.Fragment>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2">
                            {t("NotAvailable")}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

const StickyImagePreview = styled(Box)`
  position: sticky;
  top: 132px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  img {
    width: 100%;
    height: auto;
  }
`;

export default Product;
