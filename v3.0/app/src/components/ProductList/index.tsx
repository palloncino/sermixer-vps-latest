import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from '../../constants/index';
import { useAppState } from "../../state/stateContext";
import { ProductType } from "../../types/index";
import { dateText } from "../../utils/date-text";
import { formatPrice } from "../../utils/format-price";
import { isAdmin } from "../../utils/isWho.js";
import Highlight from "../HighlightText/index";
import Button from "../Button";

interface ProductListProps {
  products: ProductType[];
  handleDeleteProducts: (id: number) => void;
  search?: string;
  priceRange?: [number, number];
}

const ProductList: React.FC<ProductListProps> = ({ products, handleDeleteProducts, search, priceRange }) => {
  const { t } = useTranslation();
  const { user } = useAppState();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof ProductType>("name");
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleRequestSort = (property: keyof ProductType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredProducts = products.filter(product => {
    const price = parseFloat(product.price);
    if (!priceRange) return true;
    return (priceRange[1] === 100000 || (price >= priceRange[0] && price <= priceRange[1]));
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (orderBy === "price") {
      return order === "asc" ? parseFloat(a.price) - parseFloat(b.price) : parseFloat(b.price) - parseFloat(a.price);
    }
    if (orderBy === "updatedAt") {
      return order === "asc" 
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return order === "asc" ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewProduct = (productId: number) => {
    navigate(ROUTES(productId).productPage);
  };

  const handleEditProduct = (productId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(ROUTES(productId).editProduct);
  };

  const handleDeleteProduct = (productId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    handleDeleteProducts(productId);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'white', borderRadius: 1, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)' }}>
      <TableContainer>
        <Table size="small" aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell width="5%">{t('ID')}</TableCell>
              <TableCell width="10%" align="center">{t('Image')}</TableCell>
              <TableCell width="35%">
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  {t('Name')}
                </TableSortLabel>
              </TableCell>
              <TableCell width="10%" align="right">{t('Category')}</TableCell>
              <TableCell width="10%" align="right">
                <TableSortLabel
                  active={orderBy === "price"}
                  direction={orderBy === "price" ? order : "asc"}
                  onClick={() => handleRequestSort("price")}
                >
                  {t('Price')}
                </TableSortLabel>
              </TableCell>
              <TableCell width="15%" align="right">
                <TableSortLabel
                  active={orderBy === "updatedAt"}
                  direction={orderBy === "updatedAt" ? order : "asc"}
                  onClick={() => handleRequestSort("updatedAt")}
                >
                  {t('LastUpdate')}
                </TableSortLabel>
              </TableCell>
              <TableCell width="15%" align="center">{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell>{product.id}</TableCell>
                  <TableCell align="center">
                    {product.imgUrl ? (
                      <Tooltip
                        title={
                          <img
                            src={product.imgUrl}
                            alt={product.name}
                            style={{
                              width: '200px', // Full-width image inside tooltip
                              height: 'auto',
                              objectFit: 'contain',
                              borderRadius: '4px',
                            }}
                          />
                        }
                        placement="top"
                        componentsProps={{
                          tooltip: {
                            sx: {
                              maxWidth: 'none',
                            },
                          },
                        }}
                      >
                        <img
                          src={product.imgUrl}
                          alt={product.name}
                          style={{ width: "40px", height: "40px", objectFit: "cover", cursor: "pointer", borderRadius: '4px' }}
                        />
                      </Tooltip>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={product.name}>
                      <Typography
                        component="span"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <Highlight text={truncateText(product.name, 50)} search={search} />
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={product.category}>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        <Highlight text={truncateText(product.category, 15)} search={search} />
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    {t('EUR')} {formatPrice(product.price)}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={product.updatedAt ? new Date(product.updatedAt).toLocaleString() : ""}>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {product.updatedAt ? dateText(product.updatedAt) : ""}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Tooltip title={t('View')}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewProduct(product.id)}
                          sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title={t('Edit')}>
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={!isAdmin(user)}
                          onClick={(e) => handleEditProduct(product.id, e)}
                          sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title={t('Delete')}>
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={!isAdmin(user)}
                          onClick={(e) => handleDeleteProduct(product.id, e)}
                          sx={{ minWidth: 'auto', px: 1, py: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ProductList;
