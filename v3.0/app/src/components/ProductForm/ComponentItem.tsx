import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Grid, IconButton, TextField } from "@mui/material";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import NA from '../../media/fallbackProduct.png';
import { ComponentType } from "../../types";
import EuroTextField from "../EuroTextField";
import ImageUpload from "../ImageUpload";

interface ComponentItemProps {
  component: ComponentType;
  index: number;
  onChange: (updatedComponent: Partial<ComponentType>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  getPreviewUrl: (image: File | undefined, imgUrl: string | undefined, key: string) => string;
}

const ComponentItem: React.FC<ComponentItemProps> = ({
  component,
  index,
  onChange,
  onImageChange,
  onRemove,
  getPreviewUrl,
}) => {
  const { t } = useTranslation();

  // Memoize handlers to prevent unnecessary re-renders
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  }, [onChange]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onChange({ image: file });
      onImageChange(e);
    }
  }, [onChange, onImageChange]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box height="200px">
            <ImageUpload
              previewUrl={getPreviewUrl(component.image, component.imgUrl, `component_${index}`)}
              onChange={handleImageChange}
              label={t("UploadComponentImage")}
              imageStyle={{
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label={t("ComponentName")}
              name="name"
              value={component.name}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
            />
            <TextField
              label={t("ComponentDescription")}
              name="description"
              value={component.description}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <EuroTextField
                label={t("ComponentPrice")}
                value={component.price}
                onChange={(value) => onChange({ price: value })}
                size="small"
                variant="outlined"
              />
              <IconButton onClick={onRemove} size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Wrap the component with React.memo
export default React.memo(ComponentItem);
