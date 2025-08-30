import * as Icons from '@mui/icons-material'; // Import all icons here
import { Button, Container, Dialog, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import Loading from "../../components/Loading/index.js";
import ProductForm from "../../components/ProductForm/index";
import ProductSearchModal from "../../components/ProductSearchModal";
import { useFlashMessage } from "../../state/FlashMessageContext";
import { useAppState } from "../../state/stateContext";
import { ProductType } from "../../types/index";
import { WhitePaperContainer } from "../documents/styled-components";

const CreateProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { handleSaveProduct } = useAppState(); // Import handleSaveProduct from useAppState
  const { showMessage } = useFlashMessage();
  const { getProducts, products } = useAppState(); // Add this line to get the products from the app state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  const [product, setProduct] = useState<ProductType>({
    name: "",
    description: "",
    price: 0,
    category: "",
    company: "",
    imgUrl: "",
    components: [],
    previewUrl: "",
  });

  useEffect(() => {
    getProducts();
  }, [])

  const handleProductChange = useCallback((updatedFields: Partial<ProductType>) => {
    setProduct((prev) => {
      const updatedProduct = { ...prev, ...updatedFields };
      return updatedProduct;
    });
  }, []);

  const handleSave = async (productToSave: ProductType) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await handleSaveProduct(productToSave, false);
      if (response?.product) {
        navigate(`/product/${response?.product.id}?created=true`);
      }
    } catch (err) {
      console.error("CreateProductPage: error saving product", err);
      setError(t('ErrorCreatingProduct'));
      showMessage(`${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImportProduct = () => {
    setIsSearchModalOpen(true);
  };

  const handleProductSelect = (selectedProduct: ProductType) => {
    setSelectedProduct(selectedProduct);
    setIsSearchModalOpen(false);
    // Update the product state with the selected product
    setProduct({
      ...selectedProduct,
      id: 0, // Reset the id for a new product
      components: selectedProduct.components || [],
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <WhitePaperContainer>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Grid item>
          <Typography variant="h4" component="h1">{t('CreateProduct')}</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleImportProduct}
              startIcon={<Icons.ImportExport />} // Add Import Icon
            >
              {t('ImportProduct')}
            </Button>
          </Grid>
        </Grid>

        <ProductForm
          initialProduct={product}
          onSave={handleSave}
          loading={loading}
          errorMessage={error}
          successMessage={successMessage}
        />

        <Dialog
          open={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{t('ImportProduct')}</DialogTitle>
          <DialogContent>
            <ProductSearchModal
              onClose={() => setIsSearchModalOpen(false)}
              onProductSelect={handleProductSelect}
              showAllByDefault={true}
              products={products}
            />
          </DialogContent>
        </Dialog>
      </Container>
    </WhitePaperContainer>
  );
};

export default CreateProductPage;
