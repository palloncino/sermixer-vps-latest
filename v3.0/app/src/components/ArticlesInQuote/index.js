import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const ArticlesInQuote = ({ addedProducts = [], setAddedProducts }) => {
  const { t } = useTranslation();

  const handleRemoveProduct = (index) => {
    setAddedProducts(addedProducts.filter((_, idx) => idx !== index));
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        {t("ArticlesInQuote")}
      </Typography>
      {addedProducts.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("Article")}</TableCell>
                <TableCell>{t("Price")}</TableCell>
                <TableCell>{t("Actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addedProducts.map(({ name, price }, index) => (
                <TableRow key={index}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{price}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => handleRemoveProduct(index)}>
                      {t("Remove")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          {t("NoItemsYet")}
        </Typography>
      )}
    </>
  );
};

export default ArticlesInQuote;
