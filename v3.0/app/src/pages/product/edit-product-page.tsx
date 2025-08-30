import { Container } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/index.js";
import PageHeader from "../../components/PageHeader/index";
import ProductForm from "../../components/ProductForm/index";
import { useAppState } from "../../state/stateContext";
import { ProductType } from "../../types/index";
import { WhitePaperContainer } from "../documents/styled-components/index";
import { useFlashMessage } from '../../state/FlashMessageContext';

const EditProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const { showMessage } = useFlashMessage();
  const { handleSaveProduct, getProductById } = useAppState(); // Import handleSaveProduct and getProductById
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await getProductById(parseInt(productId, 10));
          if (response.product) {
            setProduct(response.product);
          }
        } catch (err) {
          console.error("EditProductPage: error fetching product", err);
          setError(t('ErrorFetchingProduct'));
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [productId, getProductById, t]);

  const handleProductChange = useCallback((updatedFields: Partial<ProductType>) => {
    setProduct((prev) => {
      if (prev) {
        const updatedProduct = { ...prev, ...updatedFields };
        // Prevent unnecessary re-renders by only updating the product if there are actual changes
        if (JSON.stringify(prev) !== JSON.stringify(updatedProduct)) {
          return updatedProduct;
        }
      }
      return prev; // Return the previous product state if nothing has changed
    });
  }, []);

  const handleSave = async (updatedProduct: ProductType) => {
    setLoading(true);
    setError(undefined);
    setSuccessMessage(undefined);
    try {
      const response = await handleSaveProduct(updatedProduct, true); // Pass true for isEditing
      if (response && response.product) {
        setProduct(response.product);
        setSuccessMessage(t('ProductUpdatedSuccessfully'));
        showMessage(t('ProductUpdatedSuccessfully'), 'success');
      }
    } catch (err) {
      console.error("EditProductPage: error saving product", err);
      setError(t('ErrorUpdatingProduct'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <WhitePaperContainer>
        <Container>{t('ProductNotFound')}</Container>
      </WhitePaperContainer>
    )
  }

  return (
    <WhitePaperContainer>
      <Container>
        <PageHeader title={t('EditProduct')} margin={'0'} />
        <ProductForm
          initialProduct={product}
          onSave={handleSave}
          loading={loading}
          errorMessage={error}
          successMessage={successMessage}
        />
      </Container>
    </WhitePaperContainer>
  );
};

export default EditProductPage;
