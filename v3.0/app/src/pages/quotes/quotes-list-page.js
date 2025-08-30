import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import FilterBar from "../../components/FilterBar";
import FlashMessage from "../../components/FlashMessage";
import QuotesList from "../../components/QuotesList";
import { getQuotesFiltersConfig } from "../../constants/index.ts";
import { useAppState } from "../../state/stateContext";
import applyFilters from "../../utils/apply-filters";

function QuotesListPage() {
  const { t } = useTranslation();
  const { user, quotes, deleteQuotes, getQuotes, getQuotesIsLoading } =
    useAppState();
  const [filters, setFilters] = useState({});
  const [message, setMessage] = useState(null); // Message state

  useEffect(() => {
    getQuotes();
  }, [getQuotes]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleDeleteQuotes = async (id) => {
    try {
      const userConfirmed = window.confirm(
        t("ConfirmDeletionQuoteAlertMessage")
      );

      if (userConfirmed) {
        const response = await deleteQuotes([id]);
        const { message } = response;
        setMessage({ type: "success", text: message });
      }
    } catch (error) {
      setMessage({ type: "success", text: error });
      console.error(error);
    }
  };

  const filteredItems = useMemo(() => {
    return getQuotesIsLoading || quotes.length === 0
      ? []
      : applyFilters(quotes, filters);
  }, [getQuotesIsLoading, quotes, filters]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {message && (
        <Box my={2}>
          <FlashMessage message={message.text} type={message.type} />
        </Box>
      )}
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {t("QuoteListPageHeadTitle")}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {t("QuoteListPageHeadDesc")}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <FilterBar
            filters={filters}
            filtersConfig={getQuotesFiltersConfig()}
            caseSensitive={false}
            onFilterChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12}>
          {getQuotesIsLoading ? (
            <CircularProgress />
          ) : (
            <QuotesList
              search={filters.search}
              quotes={filteredItems}
              handleDeleteQuotes={handleDeleteQuotes}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default QuotesListPage;
