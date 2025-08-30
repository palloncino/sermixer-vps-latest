import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from '../../constants/index';
import { useAppState } from "../../state/stateContext";
import { UserType } from "../../types";
import { dateText } from "../../utils/date-text";
import { isAdmin } from "../../utils/isWho";
import Highlight from '../HighlightText/index';

interface UsersListProps {
  users: UserType[];
  handleDeleteUsers: (id: number) => void;
  search: string;
}

const UsersList: React.FC<UsersListProps> = ({ users, handleDeleteUsers, search }) => {
  const { t } = useTranslation();
  const { user } = useAppState();
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof UserType>("lastName");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const handleSortRequest = (column: keyof UserType) => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return orderDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return orderDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const handleChangePage = (event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleRowClick = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  const currentPageUsers: any = sortedUsers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div id="UsersList" className="users-list">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? orderDirection : "asc"}
                  onClick={() => handleSortRequest("id")}
                >
                  {t('ID')}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">{t('Name')}</TableCell>
              <TableCell align="right">{t('Company')}</TableCell>
              <TableCell align="right">{t('Role')}</TableCell>
              <TableCell align="right">{t('Email')}</TableCell>
              <TableCell align="right">{t('Registered')}</TableCell>
              <TableCell align="right">{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageUsers.map((tableRowUser) => (
              <TableRow
                key={tableRowUser.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
                hover
                onClick={() => handleRowClick(tableRowUser.id)}
              >
                <TableCell component="th" scope="row">
                  {tableRowUser.id}
                </TableCell>
                <TableCell align="right">
                  <Highlight text={`${tableRowUser.firstName} ${tableRowUser.lastName}`} search={search} />
                </TableCell>
                <TableCell align="right">
                  <Highlight text={tableRowUser.companyName} search={search} />
                </TableCell>
                <TableCell align="right">{tableRowUser.role}</TableCell>
                <TableCell align="right">
                  <Highlight text={tableRowUser.email} search={search} />
                </TableCell>
                <TableCell align="right">
                  {dateText(tableRowUser.createdAt)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    disabled={!isAdmin(user)}
                    aria-label="edit"
                    component={Link}
                    to={ROUTES(tableRowUser.id).editUser}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    disabled={!isAdmin(user)}
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUsers(tableRowUser.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ padding: 2 }}>
        <Pagination
          count={Math.ceil(users.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </div>
  );
};

export default UsersList;
