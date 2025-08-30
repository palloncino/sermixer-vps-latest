import React from 'react';
import { useTranslation } from "react-i18next";
import { dateText } from '../../utils/date-text.ts';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

function ProductView({ product }) {
  const { t } = useTranslation();
  const {
    title,
    imgUrl,
    category,
    description,
    dateCreated,
    dateLastUpdate,
    price,
  } = product;

  return (
    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
      <CardMedia
        component="img"
        sx={{ width: { xs: '100%', sm: 300, md: 250 }, height: 'auto' }} // Adjust based on your preference
        image={imgUrl}
        alt={title}
      />
      <CardContent sx={{ flex: 1, padding: 3 }}>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {t('Category')}: {category}
        </Typography>
        <Typography variant="body2" paragraph>
          {description}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">
            {t('Created')}: {dateText(dateCreated)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
            {t('LastUpdate')}: {dateText(dateLastUpdate)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
            {t('Price')}: {price} {t('EUR')}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProductView;