import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import fallbackProductImg from "../../media/fallbackProduct.png";
import { formatPrice } from "../../utils/format-price.ts";
import Button from "../Button";


const CustomCard = styled(Card)`
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  height: 500px;
  overflow: hidden;
  position: relative;
  &:hover {
    box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
  }
`;


const Description = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limit to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OptionalDetails = styled(Box)`
  margin-top: 16px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const CardActionsWrapper = styled(CardActions)`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: white;
  display: flex;
  justify-content: space-between;
`;

const ComponentDetails = styled(Box)`
  margin-top: 16px;
`;

const ProductCard = ({ product, handleDeleteProducts }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderComponentDetails = (components) => {
    if (!components || components.length === 0) {
      return (
        <Typography variant="body2">{t("NoComponentsAvailable")}</Typography>
      );
    }

    return (
      <ComponentDetails>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          {t("Components")}
        </Typography>
        {components.map((component, componentIndex) => (
          <OptionalDetails key={componentIndex}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {component.name}
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Description
                  </TableCell>
                  <TableCell>{component.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Price
                  </TableCell>
                  <TableCell>€{component.price}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </OptionalDetails>
        ))}
      </ComponentDetails>
    );
  };

  // Ensure components are arrays
  const components = Array.isArray(product.components)
    ? product.components
    : [];

  return (
    <CustomCard>
      <CardMedia
        component="img"
        height="190"
        image={
          typeof product.imgUrl === "string"
            ? product.imgUrl
            : fallbackProductImg
        }
        alt={product.name}
        sx={{
          height: '190px',
          objectFit: 'cover'
        }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Description variant="body2" color="text.secondary">
          {product.description}
        </Description>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Category: {product.category}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          <strong>{formatPrice(product.price)}</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        {renderComponentDetails(components)}
        <Divider sx={{ my: 2 }} />
      </CardContent>
      <CardActionsWrapper>
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate(`/product/${product.id}`)}
          sx={{ mr: 1 }}
        >
          {t("ViewMore")}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            if (window.confirm(t("ConfirmDeletionProductAlertMessage"))) {
              handleDeleteProducts(product.id);
            }
          }}
          sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
        >
          <DeleteIcon fontSize="small" />
        </Button>
      </CardActionsWrapper>
    </CustomCard>
  );
};

export default ProductCard;
