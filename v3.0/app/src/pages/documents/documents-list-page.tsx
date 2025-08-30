import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useDocumentContext } from '../../state/documentContext';
import { useFlashMessage } from 'state/FlashMessageContext';
import DocumentsList from '../../components/DocumentsList';
import FilterBar from '../../components/FilterBar';
import { getDocumentsFiltersConfig } from '../../constants';
import { format } from 'date-fns';
import { WhitePaperContainer } from './styled-components';
import Loading from '../../components/Loading';
import PageHeader from '../../components/PageHeader';
import { useTranslation } from 'react-i18next';

const DocumentsListPage: React.FC = () => {
  const { t } = useTranslation();
  const { getAllDocuments, allDocumentsData, loading, error, deleteDocuments } = useDocumentContext();
  const { showMessage } = useFlashMessage();
  const [filters, setFilters] = useState({
    search: '',
    company: 'all',
    dateRange: [
      format(new Date(new Date().setDate(new Date().getDate() - 30)), 'yyyy-MM-dd'),
      format(new Date(), 'yyyy-MM-dd')
    ],
  });

  const filtersConfig = getDocumentsFiltersConfig();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        await getAllDocuments();
      } catch (error) {
        console.error('Error fetching documents:', error);
        showMessage('Failed to load documents', 'error');
      }
    };

    fetchDocuments();
  }, [getAllDocuments, showMessage]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterId]: value
    }));
  };

  const handleDeleteDocument = async (documentId: number) => {
    try {
      const response = await deleteDocuments(documentId); // Pass a single ID
      if (response.message) {
        showMessage(response.message, 'success');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      getAllDocuments();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom color="error">
          {t("ErrorLoadingDocuments")}
        </Typography>
        <Typography variant="subtitle1">
          {t("ErrorLoadingDocumentsMessage")}
        </Typography>
      </Container>
    );
  }

  return (
    <WhitePaperContainer>
      <Container maxWidth={'lg'}>
        <PageHeader
          title={t("DocumentsListPageTitle")}
          description={t("DocumentsListPageDescription")}
          margin={'0'}
        />
        <FilterBar
          filters={filters}
          filtersConfig={filtersConfig}
          onFilterChange={handleFilterChange}
        />
        <DocumentsList
          documents={allDocumentsData || []}
          filters={filters}
          onFilterChange={handleFilterChange}
          onDeleteDocument={handleDeleteDocument}
        />
      </Container>
    </WhitePaperContainer>
  );
};

export default DocumentsListPage;
