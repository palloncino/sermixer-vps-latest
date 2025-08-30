import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    TextField,
    Typography,
    Modal
} from "@mui/material";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import EuroTextField from "../../../components/EuroTextField/index.tsx";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { NumericFormat } from 'react-number-format';
import { ComponentType } from "../../../types/index.ts";
import { useDiscount } from '../../../hooks/useDiscount.ts';
import { PALETTE } from "../../../constants/index.ts";

interface ProductComponentProps {
    component: ComponentType;
    editablePrice: { [key: string]: string };
    componentSelection: { [key: string]: boolean };
    handleComponentSelection: (name: string) => void;
    handleComponentPriceChange: (name: string, value: string) => void;
    handleComponentDiscountChange: (name: string, discount: number | null) => void;
    readOnly: boolean;
}

const ProductComponent: React.FC<ProductComponentProps> = ({
    component,
    editablePrice,
    componentSelection,
    handleComponentSelection,
    handleComponentPriceChange,
    handleComponentDiscountChange,
    readOnly,
}) => {
    const { t } = useTranslation();

    const {
        price,
        discount,
        handleDiscountChange,
        handleDiscountedPriceChange,
        resetDiscount
    } = useDiscount(component.price, component.discount);

    const [showDiscountInput, setShowDiscountInput] = useState<boolean>(false);
    const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);

    useEffect(() => {
        if (component.discount) {
            setShowDiscountInput(true);
        } else {
            setShowDiscountInput(false);
        }
    }, [component.discount]);

    useEffect(() => {
        if (component.discount !== discount && !isNaN(discount)) {
            handleComponentDiscountChange(component.name, discount);
        }
    }, [discount, component.discount, component.name, handleComponentDiscountChange]);

    const toggleDiscountInput = useCallback(() => {
        if (readOnly) return;
        setShowDiscountInput(prev => !prev);
        if (!showDiscountInput) {
            handleDiscountChange(10);
        }
    }, [showDiscountInput, handleDiscountChange, readOnly]);

    const removeDiscount = useCallback(() => {
        if (readOnly) return;
        resetDiscount();
        setShowDiscountInput(false);
    }, [resetDiscount, readOnly]);

    const handleOpenInfoModal = () => {
        setOpenInfoModal(true);
    };

    const handleCloseInfoModal = () => {
        setOpenInfoModal(false);
    };

    const discountedPrice = typeof price === 'number' && typeof discount === 'number'
        ? price - (price * discount) / 100
        : 0;

    return (
        <ComponentContainer disabled={!componentSelection[component.name]}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FlexContainer>
                        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={!!componentSelection[component.name]}
                                        onChange={() => handleComponentSelection(component.name)}
                                        disabled={false}
                                        style={{ padding: '.1rem 1.2rem 0rem .5rem' }}
                                    />
                                }
                                label={component.name}
                                style={{ flexGrow: 1, alignItems: 'flex-start' }}
                            />
                            <IconButton onClick={handleOpenInfoModal}>
                                <InfoIcon />
                            </IconButton>
                        </Box>
                        <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
                            {!showDiscountInput ? (
                                <>
                                    {readOnly ? (
                                        <Box>
                                            <Typography variant="body2">{t("Price")}: {parseFloat(editablePrice[component.name]).toFixed(2)} {t("EUR")}</Typography>
                                        </Box>
                                    ) : (
                                        <>
                                            <EuroTextField
                                                label={t("Price")}
                                                value={editablePrice[component.name] || ""}
                                                onChange={(value) => handleComponentPriceChange(component.name, value)}
                                                readOnly={readOnly || !componentSelection[component.name]}
                                            />
                                            <IconButton onClick={toggleDiscountInput} size="large">
                                                <AddIcon />
                                            </IconButton>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Box sx={{ marginRight: '10px' }}>
                                        {readOnly ? (
                                            <Typography variant="body2">{t("Discount")}: {discount.toFixed(2)}%</Typography>
                                        ) : (
                                            <NumericFormat
                                                label={t("Discount (%)")}
                                                value={discount?.toString() || ""}
                                                onValueChange={(values) => handleDiscountChange(parseFloat(values.value))}
                                                customInput={TextField}
                                                decimalScale={2}
                                                suffix="%"
                                                InputProps={{ inputProps: { min: 1, max: 100 } }}
                                                type="text"
                                                readOnly={readOnly}
                                                sx={{ width: '100px', background: PALETTE.White }}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ marginRight: '10px' }}>
                                        {readOnly ? (
                                            <Typography variant="body2">{t("Discounted Price")}: {discountedPrice.toFixed(2)} {t("EUR")}</Typography>
                                        ) : (
                                            <EuroTextField
                                                label={t("Discounted Price")}
                                                value={discountedPrice?.toString()}
                                                onChange={(value) => handleDiscountedPriceChange(parseFloat(value))}
                                                readOnly={readOnly}
                                                sx={{ width: '180px' }}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ marginRight: '10px' }}>
                                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                                            {typeof price === 'number' ? price.toFixed(2) : '0.00'} {t("EUR")}
                                        </Typography>
                                    </Box>
                                    {!readOnly && (
                                        <IconButton onClick={removeDiscount} size="large">
                                            <CloseIcon />
                                        </IconButton>
                                    )}
                                </>
                            )}
                        </Box>
                    </FlexContainer>
                </Grid>
            </Grid>
            <Modal
                open={openInfoModal}
                onClose={handleCloseInfoModal}
                aria-labelledby="component-info-title"
                aria-describedby="component-info-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4
                }}>
                    {component.imgUrl || component.description ? (
                        <>
                            {component.imgUrl && (
                                <img src={component.imgUrl} alt="Component Image" style={{ width: '200px', height: '200px' }} />
                            )}
                            {component.description && (
                                <Typography id="component-info-description" sx={{ mt: 2 }}>
                                    {component.description}
                                </Typography>
                            )}
                        </>
                    ) : (
                        <Typography>{t('NoAdditionalInfo')}</Typography>
                    )}
                </Box>
            </Modal>
        </ComponentContainer>
    );
};

const FlexContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
`;

const ComponentContainer = styled(Box)<{ disabled: boolean }>`
    margin-bottom: 1rem;
    padding: 1rem;
    border: ${({ disabled }) => (disabled ? '1px solid #e0e0e0' : '1px solid #00000050')};
    border-radius: 4px;
    background: ${({ disabled }) => (disabled ? '#F4F4F4' : '#F4F4F4')};
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    transition: opacity 0.3s ease;
`;

export default ProductComponent;
