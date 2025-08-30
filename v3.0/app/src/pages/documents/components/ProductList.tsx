import React from "react";
import { Box, Card, CardContent, Typography, Grid, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ProductType } from "../../../types";
import EuroTextField from '../../../components/EuroTextField';

interface ProductListProps {
    products: ProductType[];
    onProductsChange: (products: ProductType[]) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductsChange }) => {
    const handleProductChange = (index: number, field: string, value: any) => {
        const updatedProducts = products.map((product, i) => 
            i === index ? { ...product, [field]: value } : product
        );
        onProductsChange(updatedProducts);
    };

    const handleDeleteProduct = (index: number) => {
        const updatedProducts = products.filter((_, i) => i !== index);
        onProductsChange(updatedProducts);
    };

    return (
        <Grid container spacing={2}>
            {products.map((product, index) => (
                <Grid item xs={12} key={product.id}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={3}>
                                    <Box 
                                        component="img" 
                                        src={product.imgUrl} 
                                        alt={product.name}
                                        sx={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 1 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description.substring(0, 100)}...
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <EuroTextField
                                        label="Price"
                                        value={product.price}
                                        onChange={(value) => handleProductChange(index, 'price', value)}
                                        fullWidth
                                    />
                                    <Box sx={{ mt: 1 }}>
                                        <IconButton onClick={() => {/* Edit logic */}}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteProduct(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;