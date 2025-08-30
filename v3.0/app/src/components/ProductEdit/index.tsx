import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import fallbackProductImg from '../../media/fallbackProduct.png';
import { ComponentType, ProductType } from "../../types";

interface EditProductProps {
  product: ProductType;
  onSave: (product: FormData) => void;
  onCancel: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onSave, onCancel }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editedProduct, setEditedProduct] = useState<ProductType>({
    ...product,
    components: Array.isArray(product.components) ? product.components : [],
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        components: Array.isArray(product.components) ? product.components : [],
      });
    }
  }, [product]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleComponentChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedComponents = (editedProduct.components as ComponentType[]).map((component, compIndex) =>
      compIndex === index ? { ...component, [e.target.name]: e.target.value } : component
    );
    setEditedProduct({ ...editedProduct, components: updatedComponents });
  };

  const addComponent = () => {
    setEditedProduct({
      ...editedProduct,
      components: [...(editedProduct.components as ComponentType[]), { name: "", description: "", price: 0 }],
    });
  };

  const removeComponent = (index: number) => {
    setEditedProduct({
      ...editedProduct,
      components: (editedProduct.components as ComponentType[]).filter((_, compIndex) => compIndex !== index),
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
        setEditedProduct({ ...editedProduct, imgUrl: event.target?.result as string });
      };
      fileReader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("id", editedProduct.id.toString());
    formData.append("name", editedProduct.name);
    formData.append("description", editedProduct.description);
    formData.append("price", editedProduct.price.toString());
    formData.append("category", editedProduct.category);
    formData.append("components", JSON.stringify(editedProduct.components));

    if (fileInputRef.current?.files && fileInputRef.current.files[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    onSave(formData);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative", width: "100%", height: "100%", maxHeight: 250 }}>
              <CardMedia
                component="img"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                image={editedProduct.imgUrl || fallbackProductImg}
                alt="Product Image"
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  color: 'primary.main',
                  background: 'white',
                  '&:hover': { background: 'primary.light' }
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <PhotoCamera />
              </IconButton>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label={t("Name")} name="name" value={editedProduct.name} onChange={handleChange} required margin="normal" />
            <TextField fullWidth label={t("Description")} name="description" multiline rows={3} value={editedProduct.description} onChange={handleChange} required margin="normal" />
            <TextField fullWidth label={t("Price")} name="price" type="number" value={editedProduct.price} onChange={handleChange} required margin="normal" />
            <TextField fullWidth label={t("Category")} name="category" value={editedProduct.category} onChange={handleChange} required margin="normal" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>{t('Components')}</Typography>
            {editedProduct.components?.map((component, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={5}>
                  <TextField fullWidth label={t("Component Name")} name="name" value={component.name} onChange={(e) => handleComponentChange(index, e)} margin="normal" />
                </Grid>
                <Grid item xs={5}>
                  <TextField fullWidth label={t("Component Description")} name="description" value={component.description} onChange={(e) => handleComponentChange(index, e)} margin="normal" />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => removeComponent(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button onClick={addComponent} variant="outlined" sx={{ mt: 1 }}>
              {t('AddComponent')}
            </Button>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
              {t('SaveChanges')}
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              {t('Cancel')}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EditProduct;
