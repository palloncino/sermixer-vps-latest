import { Button, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../components/FilterBar";
import FlashMessage from "../../components/FlashMessage";
import Loading from "../../components/Loading";
import UsersList from "../../components/UsersList/index.tsx";
import { ROUTES, getUsersFiltersConfig } from "../../constants/index.ts";
import { useAppState } from "../../state/stateContext";
import { isAdmin } from "../../utils/isWho";
import { WhitePaperContainer } from "../documents/styled-components/index.ts";

const StyledContainer = styled(Container)`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const UsersListPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, users, deleteUsers, getUsers, loadingUsers } = useAppState();
  const [filters, setFilters] = useState<any>({ search: '', role: 'all' });
  const [successMessage, setSuccessMessage] = useState("");
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('lastName');

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const handleDeleteUsers = async (id: number) => {
    try {
      const userConfirmed = window.confirm(
        t("ConfirmDeletionUserAlertMessage")
      );

      if (userConfirmed) {
        const response = await deleteUsers([id]);
        const { message } = response;
        setSuccessMessage(message);
        getUsers(); // Refresh users list after deletion
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredItems = useMemo(() => {
    if (loadingUsers || users.length === 0) return [];

    return users.filter(user => {
      const searchMatch = !filters.search || 
        (user.firstName && user.firstName.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.companyName && user.companyName.toLowerCase().includes(filters.search.toLowerCase()));

      const roleMatch = filters.role === 'all' || user.role === filters.role;

      return searchMatch && roleMatch;
    }).sort((a, b) => {
      if (orderBy === 'name') {
        const aName = `${a.firstName} ${a.lastName}`;
        const bName = `${b.firstName} ${b.lastName}`;
        return order === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
      }
      if (orderBy === 'email') {
        return order === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
      }
      return 0;
    });
  }, [loadingUsers, users, filters, order, orderBy]);

  return (
    <WhitePaperContainer>
      <StyledContainer maxWidth="lg">
        {successMessage && (
          <FlashMessage message={successMessage} type="success" />
        )}
        {loadingUsers ? (
          <Loading />
        ) : (
          <>
            <Grid
              container
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={12} md={8}>
                <Typography variant="h4">{t("UsersListPageHeadTitle")}</Typography>
                <Typography variant="subtitle1">{t("UsersListPageHeadDesc")}</Typography>
              </Grid>
              <Grid item xs={12} md={4} display="flex" justifyContent="flex-end">
                <Button
                  disabled={!isAdmin(user)}
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to={ROUTES().profile}
                >
                  {t("MyUserProfile")}
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <FilterBar
                  filters={filters}
                  filtersConfig={getUsersFiltersConfig()}
                  onFilterChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={12}>
                <UsersList
                  users={filteredItems}
                  handleDeleteUsers={handleDeleteUsers}
                  search={filters.search}
                  onRequestSort={handleRequestSort}
                  order={order}
                  orderBy={orderBy}
                />
              </Grid>
            </Grid>
          </>
        )}
      </StyledContainer>
    </WhitePaperContainer>
  );
};

export default UsersListPage;
