import { Button, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import ClientsList from "../../components/ClientsList/index";
import FilterBar from "../../components/FilterBar";
import FlashMessage from "../../components/FlashMessage";
import Loading from "../../components/Loading";
import { ROUTES, getClientsFiltersConfig } from "../../constants/index";
import { useAppState } from "../../state/stateContext";
import { isAdmin } from "../../utils/isWho";
import { WhitePaperContainer } from "../documents/styled-components/index";

const StyledContainer = styled(Container)`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const ClientListPage: React.FC = () => {
    const { t } = useTranslation();
    const { user, clients, deleteClients, getClients, loadingClients } = useAppState();
    const [filters, setFilters] = useState({ search: '', address: '' });
    const [successMessage, setSuccessMessage] = useState("");
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('companyName');

    useEffect(() => {
        getClients();
    }, [getClients]);

    const handleFilterChange = (filterId: string, value: any) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterId]: value,
        }));
    };

    const handleDeleteClients = async (selectedIds: number[]) => {
        for (const id of selectedIds) {
            await deleteClients([id]);
        }
        getClients(); // Refresh clients list after deletion
    };

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredItems = useMemo(() => {
        if (clients.length === 0) return [];
    
        const searchTerm = (filters.search || '').toLowerCase();
    
        return clients
          .filter(client => {
            const matchesSearchTerm = (
              (client.companyName && client.companyName.toLowerCase().includes(searchTerm)) ||
              (client.email && client.email.toLowerCase().includes(searchTerm)) ||
              (client.vatNumber && client.vatNumber.toLowerCase().includes(searchTerm)) ||
              (client.address?.street && client.address.street.toLowerCase().includes(searchTerm)) ||
              (client.address?.city && client.address.city.toLowerCase().includes(searchTerm)) ||
              (client.address?.zipCode && client.address.zipCode.toLowerCase().includes(searchTerm)) ||
              (client.address?.country && client.address.country.toLowerCase().includes(searchTerm)) ||
              (client.firstName && client.firstName.toLowerCase().includes(searchTerm)) ||
              (client.lastName && client.lastName.toLowerCase().includes(searchTerm)) ||
              (client.mobileNumber && client.mobileNumber.toLowerCase().includes(searchTerm))
            );
    
            return matchesSearchTerm;
          })
          .sort((a, b) => {
            if (orderBy === 'companyName') {
              return order === 'asc'
                ? a.companyName.localeCompare(b.companyName)
                : b.companyName.localeCompare(a.companyName);
            }
            return 0;
          });
    }, [clients, filters, order, orderBy]);
    
    

    return (
        <WhitePaperContainer>
            <StyledContainer maxWidth="lg">
                {successMessage && (
                    <FlashMessage message={successMessage} type="success" />
                )}
                {loadingClients ? (
                    <Loading />
                ) : (
                    <>
                        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h4">{t("ClientsListPageHeadTitle")}</Typography>
                                <Typography variant="subtitle1">{t("ClientsListPageHeadDesc")}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
                                <Button
                                    disabled={!isAdmin(user)}
                                    variant="contained"
                                    color="primary"
                                    component={RouterLink}
                                    to={ROUTES().createClient}
                                >
                                    {t("CreateNewClient")}
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <FilterBar
                                    filters={filters}
                                    filtersConfig={getClientsFiltersConfig()}
                                    onFilterChange={handleFilterChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ClientsList
                                    clients={filteredItems}
                                    handleDeleteClients={handleDeleteClients}
                                    onSort={handleRequestSort}
                                    order={order}
                                    orderBy={orderBy}
                                    searchTerm={filters.search || ""}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            </StyledContainer>
        </WhitePaperContainer>
    );
};

export default ClientListPage;
