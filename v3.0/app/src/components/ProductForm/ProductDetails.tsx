import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getProductsFiltersConfig } from '../../constants';
import { ProductType } from "../../types";
import EuroTextField from "../EuroTextField";
import ImageUpload from "../ImageUpload";
import MarkdownEditor from "../MarkdownEditor";
import Loading from "components/Loading";
import { debounce } from 'lodash';
import { useFlashMessage } from "state/FlashMessageContext";

interface ProductDetailsProps {
  product: ProductType;
  onProductChange: (updatedFields: Partial<ProductType>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  categoryOptions: { value: string; label: string }[];
  previewUrl: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onProductChange,
  onImageChange,
  previewUrl,
}) => {
  const { t } = useTranslation();
  const { showMessage } = useFlashMessage();
  const [tempDescription, setTempDescription] = useState(product.description || '');
  const [isDirty, setIsDirty] = useState(false); // Track if there are unsaved changes

  // Debounced save function
  const debouncedSaveDescription = useCallback(
    debounce((description: string) => {
      onProductChange({ description });
      showMessage(t("Description saved successfully"), 'success');
      setIsDirty(false); // Reset dirty state after saving
    }, 500),
    []
  );

  useEffect(() => {
    if (isDirty) {
      debouncedSaveDescription(tempDescription);
    }
    return () => {
      debouncedSaveDescription.cancel(); // Cleanup on unmount
    };
  }, [tempDescription, isDirty, debouncedSaveDescription]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    onProductChange({ [name as string]: value });
  };

  const handleDescriptionChange = (value: string) => {
    setTempDescription(value);
    setIsDirty(true); // Mark as dirty when the description changes
  };

  const categoryOptions = getProductsFiltersConfig().find(filter => filter?.id === 'category')?.options || [];

  // Add a check to ensure product is defined before rendering
  if (!product) {
    return <Loading />;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ImageUpload
            previewUrl={previewUrl}
            onChange={onImageChange}
            label={t("UploadProductImage")}
            imageStyle={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("Name")}
            name="name"
            value={product.name || ''}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <EuroTextField
            label={t("Price")}
            value={product.price}
            onChange={(value) => onProductChange({ price: value })}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t("Category")}</InputLabel>
            <Select
              label={t("Category")}
              name="category"
              value={product.category || ''}
              onChange={handleChange}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>{t("Company")}</InputLabel>
            <Select
              label={t("Company")}
              name="company"
              value={product.company || ''}
              onChange={handleChange}
            >
              <MenuItem value="sermixer">{t("Sermixer")}</MenuItem>
              <MenuItem value="s2_truck_service">{t("S2TruckService")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <MarkdownEditor
            label={t("Description")}
            name="description"
            value={tempDescription}
            onChange={handleDescriptionChange}
            readOnly={false}
            minRows={5}
            style={{
              border: isDirty ? '2px solid #f44336' : '1px solid #ccc', // Change border color if dirty
              transition: 'border 0.3s ease',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetails;