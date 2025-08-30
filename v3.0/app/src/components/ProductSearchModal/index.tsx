import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Box } from '@mui/material';
import { ProductType } from '../../types';
import { useAppState } from '../../state/stateContext';

interface ProductSearchModalProps {
    onClose: () => void;
    onProductSelect: (product: ProductType) => void;
    showAllByDefault: boolean;
    products: ProductType[]; // Add this line
}

const ProductSearchModal: React.FC<ProductSearchModalProps> = ({
    onClose,
    onProductSelect,
    showAllByDefault,
    products // Add this line
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ProductType[]>([]);

    useEffect(() => {
        if (showAllByDefault) {
            setSearchResults(products);
        }
    }, [products, showAllByDefault]);

    useEffect(() => {
    }, [searchResults]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() === '') {
            setSearchResults(showAllByDefault ? products : []);
        } else {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filteredProducts);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ position: 'sticky', top: 0, backgroundColor: 'background.paper', zIndex: 1, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto', maxHeight: '60vh' }}>
                {searchResults.length === 0 ? (
                    <Typography sx={{ p: 2 }}>No products found</Typography>
                ) : (
                    <List>
                        {searchResults.map((product) => (
                            <ListItem
                                key={product.id}
                                button
                                onClick={() => {
                                    onProductSelect(product);
                                    onClose();
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={product.imgUrl || undefined} alt={product.name}>
                                        {product.name.charAt(0)}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={product.name} secondary={`Price: $${product.price}`} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default ProductSearchModal;