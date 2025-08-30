import { Box, Button, Grid } from "@mui/material";
import Loading from "components/Loading";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { getProductsFiltersConfig } from '../../constants';
import NA from '../../media/fallbackProduct.png';
import { ComponentType, ProductFormProps, ProductType } from "../../types";
import FlashMessage from "../FlashMessage";
import ComponentList from "./ComponentList";
import ProductDetails from "./ProductDetails";

const ProductForm: FC<ProductFormProps> = ({
  initialProduct,
  onSave,
  loading,
  errorMessage,
  successMessage,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType>({
    ...initialProduct,
    components: initialProduct.components || [],
  });
  const [blobUrls, setBlobUrls] = useState<{ [key: string]: string }>({});

  // Add this useEffect hook to update the form when initialProduct changes
  useEffect(() => {
    setProduct({
      ...initialProduct,
      components: initialProduct.components || [],
    });
  }, [initialProduct]);

  useEffect(() => {
    return () => {
      Object.values(blobUrls).forEach(URL.revokeObjectURL);
    };
  }, [blobUrls, initialProduct]);

  const getPreviewUrl = useCallback((image: File | undefined, imgUrl: string | undefined, key: string) => {
    if (image instanceof File) {
      if (!blobUrls[key]) {
        const newUrl = URL.createObjectURL(image);
        setBlobUrls(prev => ({ ...prev, [key]: newUrl }));
        return newUrl;
      }
      return blobUrls[key];
    }
    return imgUrl || NA;
  }, [blobUrls]);

  const handleProductChange = useCallback((updatedFields: Partial<ProductType>) => {
    setProduct((prev) => {
      return { ...prev, ...updatedFields };
    });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct(prev => ({ ...prev, image: file }));
      if (blobUrls['mainProduct']) {
        URL.revokeObjectURL(blobUrls['mainProduct']);
      }
      const newUrl = URL.createObjectURL(file);
      setBlobUrls(prev => ({ ...prev, mainProduct: newUrl }));
    }
  };

  const handleComponentChange = (index: number, updatedComponent: Partial<ComponentType>) => {
    setProduct((prev) => {
      const updatedComponents = prev.components!.map((component, i) =>
        i === index ? { ...component, ...updatedComponent, image: updatedComponent.image || component.image } : component
      );
      return { ...prev, components: updatedComponents };
    });
  };

  const handleComponentImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleComponentChange(index, { image: file });
      if (blobUrls[`component_${index}`]) {
        URL.revokeObjectURL(blobUrls[`component_${index}`]);
      }
      const newUrl = URL.createObjectURL(file);
      setBlobUrls(prev => ({ ...prev, [`component_${index}`]: newUrl }));
    }
  };

  const handleAddComponent = () => {
    setProduct((prev) => {
      const updatedComponents = [...prev.components!, { id: uuidv4(), name: "", price: 0, description: "" }];
      return { ...prev, components: updatedComponents };
    });
  };

  const handleRemoveComponent = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      components: prev.components!.filter((_, i) => i !== index),
    }));
  };

  const handleReorderComponents = (newComponents: ComponentType[]) => {
    setProduct((prev) => ({
      ...prev,
      components: newComponents,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({...product, image: product.image});
  };

  const categoryOptions = getProductsFiltersConfig().find(filter => filter.id === 'category')?.options || [];

  if (!product) {
    return <Loading />;
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {errorMessage && <FlashMessage message={errorMessage} type="error" />}
          {successMessage && <FlashMessage message={successMessage} type="success" />}
        </Grid>
        <Grid item xs={12} md={6}>
          <ProductDetails
            product={product}
            onProductChange={handleProductChange}
            onImageChange={handleImageChange}
            categoryOptions={categoryOptions}
            previewUrl={getPreviewUrl(product.image, product.imgUrl, 'mainProduct')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ComponentList
            components={product.components!}
            onComponentChange={handleComponentChange}
            onComponentImageChange={handleComponentImageChange}
            onAddComponent={handleAddComponent}
            onRemoveComponent={handleRemoveComponent}
            onReorderComponents={handleReorderComponents}
            getPreviewUrl={getPreviewUrl}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" color="primary" disabled={loading} onClick={() => navigate(-1)}>
              {t("Back")}
            </Button>
            <Button variant="contained" color="primary" disabled={loading} onClick={handleSubmit}>
              {t("Save")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(ProductForm);
