import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DocumentDataType } from 'types';
import { useDocumentContext } from "../../state/documentContext";
import { useAppState } from "../../state/stateContext";
import { calculatePriceSummary } from "../../utils/calculate-price-summary";
import { determineActor } from "../../utils/determine-actor";
import EuroTextField from "../EuroTextField/index";
import FormattedPrice from "../FormattedPrice/index";

const PriceSummary: React.FC = () => {
  const { t } = useTranslation();
  const [expandedDetails, setExpandedDetails] = useState(false);
  const { originalDocumentData, updatedDocumentData, updateNestedDocumentField } = useDocumentContext();
  const { user } = useAppState();
  const [currentDiscount, setCurrentDiscount] = useState((updatedDocumentData as DocumentDataType).discount || 0);

  const {
    subtotal,
    discountAmount,
    subtotalAfterDiscount,
    taxAmount,
    totalAfterDiscount,
    productDetails
  } = calculatePriceSummary(updatedDocumentData as DocumentDataType, 0.22, currentDiscount);

  const handleDiscountChange = (value: string) => {
    const discountValue = parseFloat(value) || 0;
    setCurrentDiscount(discountValue);
    updateNestedDocumentField(['discount'], discountValue); // Update to root level
  };

  const handleExpandDetails = () => {
    setExpandedDetails((prev) => !prev);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Accordion
        expanded={expandedDetails}
        onChange={handleExpandDetails}
        elevation={0}
        sx={{
          border: '1px solid #e0e0e0',
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{t("TotalPriceSummary")}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("Product")}</TableCell>
                  <TableCell align="right">{t("BasePrice")}</TableCell>
                  <TableCell align="right">{t("Discount")}</TableCell>
                  <TableCell align="right">{t("Components")}</TableCell>
                  <TableCell align="right">{t("Total")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productDetails.map((product, index) => (
                  <React.Fragment key={index}>
                    <TableRow sx={{ backgroundColor: 'white' }}>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>{product.name}</TableCell>
                      <TableCell align="right"><FormattedPrice value={product.basePrice} /></TableCell>
                      <TableCell align="right">
                        {product.discount > 0 ? (
                          <FormattedPrice value={-product.discountAmount} />
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <FormattedPrice value={product.components.reduce((sum, comp) => sum + (comp.price * comp.quantity), 0)} />
                      </TableCell>
                      <TableCell align="right"><FormattedPrice value={product.total} /></TableCell>
                    </TableRow>
                    {product.components.map((component, cIndex) => (
                      <TableRow key={`${index}-${cIndex}`} sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ pl: 4 }}>{component.name} (x{component.quantity})</TableCell>
                        <TableCell align="right"><FormattedPrice value={component.price} /></TableCell>
                        <TableCell colSpan={3} />
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ width: '50%', mt: 2, ml: 'auto', p: 2, border: '1px solid #e0e0e0' }}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1">{t("Subtotal")}:</Typography>
          <Typography variant="body1">
            {discountAmount > 0 ? (
              <>
                <span style={{ textDecoration: 'line-through', marginRight: '8px' }}>
                  <FormattedPrice value={subtotal} />
                </span>
                <FormattedPrice value={subtotalAfterDiscount} />
              </>
            ) : (
              <FormattedPrice value={subtotal} />
            )}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body1">{t("Tax")}: <span style={{fontSize: '.8rem', color: 'grey'}}>(22%)</span></Typography>
          <Typography variant="body1"><FormattedPrice value={taxAmount} /></Typography>
        </Box>
        {user?.id ? (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body1">{t("Discount")}:</Typography>
            <EuroTextField
              value={currentDiscount.toString()}
              onChange={handleDiscountChange}
              fullWidth={false}
              readOnly={false}
              sx={{ minWidth: '200px' }}
            />
          </Box>
        ) : (
          <>
          </>
        )}
        <Divider sx={{ my: 1 }} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {t("Total")}:
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            <FormattedPrice value={totalAfterDiscount} />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PriceSummary;
