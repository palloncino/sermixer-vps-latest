import React, { useState } from "react";
import { Grid, Pagination, Box } from "@mui/material";
import ProductCard from "../ProductCard";

const ProductGrid = ({ products, handleDeleteProducts }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 50;

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Calculate the products to be displayed on the current page
  const displayedProducts = products.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box>
      <Grid container spacing={2}>
        {displayedProducts.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <ProductCard
              product={product}
              handleDeleteProducts={handleDeleteProducts}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ProductGrid;
