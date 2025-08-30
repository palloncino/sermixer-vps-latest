import { Box, Container, Grid, Typography } from "@mui/material";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFlashMessage } from "state/FlashMessageContext";
import { ClientType, DocumentDataType, ProductType, QuoteHeadDetailsType } from "types";
import ClientSelector from "../../components/ClientSelector/index";
import FilterBar from "../../components/FilterBar/index";
import FlashMessage from "../../components/FlashMessage/index";
import Loading from "../../components/Loading/index.js";
import QuoteDetails from "../../components/QuoteDetails/index.js";
import QuoteProductList from "../../components/QuoteProductList/index.js";
import SummaryQuote from "../../components/SummaryQuote/index";
import { getProductsFiltersConfig } from "../../constants/index";
import { useDocumentContext } from "../../state/documentContext";
import { useAppState } from "../../state/stateContext";
import applyFilters from "../../utils/apply-filters.js";
import { WhitePaperContainer } from "./styled-components/index";

const CreateQuotePage: FC<any> = () => {
  const { t } = useTranslation();
  const { showMessage } = useFlashMessage();
  const { products, getProducts } = useAppState();
  const { createDocument, loading } = useDocumentContext();

  const [quoteHeadDetails, setQuoteHeadDetails] = useState<QuoteHeadDetailsType | {}>({});
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [addedProducts, setAddedProducts] = useState<ProductType[]>([]);
  const [filters, setFilters] = useState<any>({ priceRange: [0, 100000] });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [discount, setDiscount] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  
  // Memoize discount to prevent unnecessary re-renders
  const memoizedDiscount = useMemo(() => discount, [discount]);
  
  // Log after state is initialized
  console.log('__CreateQuotePage: Component rendered', {
    quoteHeadDetails,
    selectedClient,
    addedProductsLength: addedProducts.length,
    discount,
    addedProductsReference: addedProducts
  });

  // Fetch products when the component loads
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Set maxPrice and priceRange filter after fetching products
  useEffect(() => {
    if (products.length > 0) {
      const newMaxPrice = Math.max(...products.map(product => product.price));
      setMaxPrice(newMaxPrice);

      // Initialize priceRange to span from 0 to newMaxPrice
      setFilters(prevFilters => ({
        ...prevFilters,
        priceRange: [0, newMaxPrice]
      }));
    }
  }, [products]);

  const handleFilterChange = useCallback((filterName: string, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value,
    }));
  }, []);

  const filteredItems = useMemo(() => {
    if (products.length === 0) {
      return [];
    }


    const filteredProducts = applyFilters(products, filters);

    return filteredProducts;
  }, [products, filters]);

  const handleAddToQuote = useCallback((_id: string) => {
    const productFound = products.find(({ id }) => id === _id);
    if (productFound) {
      const updatedAddedProducts = [...addedProducts, {
        ...productFound,
        components: productFound.components.map(component => ({
          ...component,
          quantity: component.quantity || 1 // Ensure quantity is set
        }))
      }];
      setAddedProducts(updatedAddedProducts);
      showMessage(t('ProductAdded'), 'success');
    } else {
      showMessage(`Could not find product with id: ${_id}.`, 'error');
      console.error(`Could not find product with id: ${_id}.`);
    }
  }, [products, addedProducts, showMessage, t]);

  const handleSubmit = useCallback(async (_editedSummaryPayload: DocumentDataType) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const document = await createDocument(_editedSummaryPayload);
      setMessage({
        type: "success",
        text: t("DocumentCreatedMessage", { hash: document.hash }),
      });
      showMessage(t("DocumentCreatedMessage", { hash: document.hash }), 'success');
      localStorage.removeItem('summaryQuoteData');
    } catch (error: any) {
      showMessage(typeof error.message === 'string' ? error.message : `${error}`, 'error');
      setMessage({ type: "error", text: typeof error.message === 'string' ? error.message : `${error}` });
    }
  }, [createDocument, showMessage, t]);

  // Optimized callbacks to prevent unnecessary re-renders
  const handleQuoteDetailsChange = useCallback((details: QuoteHeadDetailsType) => {
    console.log('__CreateQuotePage: handleQuoteDetailsChange called', { details });
    setQuoteHeadDetails(details);
  }, []);

  const handleClientChange = useCallback((client: ClientType | null) => {
    console.log('__CreateQuotePage: handleClientChange called', { client });
    setSelectedClient(client);
  }, []);

  const handleAddedProductsChange = useCallback((products: ProductType[]) => {
    console.log('__CreateQuotePage: handleAddedProductsChange called with products length:', products.length);
    setAddedProducts(products);
  }, []);

  const productsFiltersConfig = useMemo(() => {
    const config = getProductsFiltersConfig();
    const priceRangeFilter = config.find(filter => filter.id === "priceRange");
    if (priceRangeFilter) {
      priceRangeFilter.max = maxPrice;
      priceRangeFilter.defaultValue = filters.priceRange; // Use filters.priceRange as defaultValue
    }
    return config;
  }, [maxPrice, filters.priceRange]);

  if (loading) {
    return <Loading />
  }

  return (
    <WhitePaperContainer>
      <Container sx={{ mt: '20px', pb: "100px" }}>
        {message.text && (
          <Box mb={2} pt={2}>
            <FlashMessage message={message.text} type={message.type} />
          </Box>
        )}

        <Grid container spacing={3}>
          {/* HEAD DETAILS */}
          <Grid item xs={12} md={4}>
            <QuoteDetails onDetailsChange={handleQuoteDetailsChange} />
          </Grid>

          {/* CLIENT SELECTION */}
          <Grid item xs={12} md={8}>
            <ClientSelector onClientChange={handleClientChange} />
          </Grid>

          {/* ADD PRODUCTS */}
          <Grid item xs={12}>
            <FilterBar
              filters={filters}
              filtersConfig={productsFiltersConfig}
              onFilterChange={handleFilterChange}
            />
            {products.length === 0 ? (
              <Loading />
            ) : (
              <QuoteProductList
                products={filteredItems}
                onAddToQuote={handleAddToQuote}
                highlightText={filters.search}
              />
            )}
          </Grid>

          {/* SUMMARY QUOTE */}
          <Grid item xs={12}>
            <SummaryQuote
              quoteHeadDetails={quoteHeadDetails}
              selectedClient={selectedClient}
              addedProducts={addedProducts}
              onAddedProductsChange={handleAddedProductsChange}
              onQuoteHeadDetailsChange={handleQuoteDetailsChange}
              onSelectedClientChange={handleClientChange}
              handleSubmit={handleSubmit}
              discount={memoizedDiscount}
            />
          </Grid>
        </Grid>
      </Container>
    </WhitePaperContainer>
  );
};

export default React.memo(CreateQuotePage);
