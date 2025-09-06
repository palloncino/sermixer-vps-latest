import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Highlight from "../../components/HighlightText/index";
import { useAppState } from "../../state/stateContext";
import { dateText } from "../../utils/date-text.ts";
import Button from "../Button";

function QuotesList({ quotes, handleDeleteQuotes, search }) {
  const { t } = useTranslation();
  const { users, getUsers, getUsersIsLoading } = useAppState();
  const [orderDirection, setOrderDirection] = useState("asc");
  const [orderBy, setOrderBy] = useState("issuedDate"); // Adjust to sort by date as default
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getUsers();
  }, []);

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    const getValue = (obj, path) =>
      path.split(".").reduce((acc, part) => acc && acc[part], obj);
    const compare = (getValue(a, orderBy) || "")
      .toString()
      .localeCompare((getValue(b, orderBy) || "").toString(), undefined, {
        numeric: true,
      });
    return orderDirection === "asc" ? compare : -compare;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowClick = (quoteId) => {
    navigate(`/quote/${quoteId}`);
  };

  const isExpired = (_quote) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(_quote.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today ? "#d32f2f" : "inherit";
  };

  const getUserDetails = (_id, returnKey) => {
    if (getUsersIsLoading) {
      return "Loading ...";
    }
    const userDetail = users.find(({ id }) => id === _id);
    if (userDetail) {
      return userDetail[returnKey];
    }
    return "";
  };

  const currentPageQuotes = sortedQuotes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{t("QuoteID")}</TableCell>
            <TableCell align="right">{t("MainCompany")}</TableCell>
            <TableCell align="right">{t("ClientCompany")}</TableCell>
            <TableCell align="right">{t("TotalPrice")}</TableCell>
            <TableCell align="right">{t("CreatedDate")}</TableCell>
            <TableCell align="right">{t("UpdatedDate")}</TableCell>
            <TableCell align="right">{t("Actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageQuotes.map((quote, index) => (
            <TableRow
              key={`${quote.id}_${index}`}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
              }}
              hover
              onClick={() => handleRowClick(quote.id)}
            >
              <TableCell component="th" scope="row">
                {quote.id}
              </TableCell>
              <TableCell align="right">{quote.company}</TableCell>
              <TableCell align="right">
                <Highlight
                  text={quote.commissioner?.companyName || "N/A"}
                  search={search}
                />
              </TableCell>
              <TableCell align="right">
                {t("EUR")}
                {quote.total}
              </TableCell>
              <TableCell align="right">
                {quote.createdAt
                  ? dateText(quote.createdAt, "long")
                  : "Not available"}
              </TableCell>
              <TableCell align="right">
                {quote.updatedAt
                  ? dateText(quote.updatedAt, "long")
                  : "Not available"}
              </TableCell>
              <TableCell align="right">
                <Tooltip title={t('Delete')}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuotes(quote.id);
                    }}
                    sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ padding: 2 }}>
        <Pagination
          component="div"
          count={Math.ceil(quotes.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </Box>
    </TableContainer>
  );
}

export default QuotesList;
