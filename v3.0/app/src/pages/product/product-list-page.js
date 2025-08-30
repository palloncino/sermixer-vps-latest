import { ViewList, ViewModule } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { useFlashMessage } from "state/FlashMessageContext";
import FilterBar from "../../components/FilterBar";
import FlashMessage from "../../components/FlashMessage";
import Loading from "../../components/Loading";
import PageHeader from "../../components/PageHeader";
import ProductGrid from "../../components/ProductGrid";
import ProductList from "../../components/ProductList";
import { ROUTES, getProductsFiltersConfig } from "../../constants/index";
import { useAppState } from "../../state/stateContext";
import { isAdmin } from "../../utils/isWho.js";
import { WhitePaperContainer } from "../documents/styled-components/index";

function ProductListPage() {
  const { t } = useTranslation();
  const { showMessage } = useFlashMessage();
  const { user, products, deleteProducts, getProducts, loadingProducts } =
    useAppState();
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    priceRange: [0, 1000000],
    company: 'all'
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list | grid

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterId]: value
    }));
  };

  const handleDeleteProducts = async (id) => {
    try {
      const userConfirmed = window.confirm(
        t("ConfirmDeletionProductAlertMessage")
      );

      if (userConfirmed) {
        const response = await deleteProducts([id]);
        const { message } = response;
        setSuccessMessage(message);
        showMessage(message, 'success')
        getProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewChange = (event, nextView) => {
    if (nextView !== null) {
      setViewMode(nextView);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const price = Number(product.price); // Ensure price is a number
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'all' || product.category === filters.category;
      const matchesPriceRange = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      const matchesCompany = filters.company === 'all' || product.company === filters.company;

      return matchesSearch && matchesCategory && matchesPriceRange && matchesCompany;
    });
  }, [products, filters]);

  return (
    <WhitePaperContainer>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {successMessage && (
          <Box sx={{ pt: 2, mb: 2 }}>
            <FlashMessage message={successMessage} type="success" />
          </Box>
        )}
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 0 }}
        >
          <Grid item>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              aria-label="View mode"
            >
              <ToggleButton value="list" aria-label="list">
                <ViewList />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid">
                <ViewModule />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <PageHeader title={t("ProductListPageHeadTitle")} margin={'0'} />
          <Grid item>
            <Button
              disabled={!isAdmin(user)}
              variant="contained"
              color="primary"
              component={RouterLink}
              to={ROUTES().createProduct}
              sx={{ mr: 2 }}
            >
              {t("CreateNewProduct")}
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <FilterBar
              filters={filters}
              filtersConfig={getProductsFiltersConfig()}
              caseSensitive={false}
              onFilterChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            {loadingProducts ? (
              <Loading />
            ) : viewMode === "list" ? (
              <ProductList
                search={filters.search} // for highlighting the text
                products={filteredProducts}
                handleDeleteProducts={handleDeleteProducts}
              />
            ) : (
              <ProductGrid // You need to create this component similar to ProductList but for grid view
                products={filteredProducts}
                handleDeleteProducts={handleDeleteProducts}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </WhitePaperContainer>
  );
}

export default ProductListPage;
