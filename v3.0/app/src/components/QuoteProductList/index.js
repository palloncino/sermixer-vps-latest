import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Highlight from '../../components/HighlightText';
import {formatPrice} from '../../utils/format-price';

const QuoteProductList = memo(({ products, onAddToQuote, highlightText }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={0} sx={{ backgroundColor: 'white', borderRadius: 1, boxShadow: '0px 1px 3px rgba(0,0,0,0.12)' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('Image')}</TableCell>
              <TableCell>{t('Name')}</TableCell>
              <TableCell>{t('Price')}</TableCell>
              <TableCell>{t('Category')}</TableCell>
              <TableCell>{t('Company')}</TableCell>
              <TableCell>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  <TableCell align="center">
                    <Tooltip
                      title={
                        <img
                          src={product.imgUrl}
                          alt={product.name}
                          style={{
                            width: '100vw', // Full width of the viewport
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '4px',
                          }}
                        />
                      }
                      placement="top" // Adjust tooltip position to avoid overflow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            maxWidth: 'none', // Remove default max width
                          },
                        },
                      }}
                    >
                      <img
                        src={product.imgUrl}
                        alt={product.name}
                        style={{ width: 'auto', height: '40px', borderRadius: '4px', cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={product.name}>
                      <Box
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '120px',
                        }}
                      >
                        <strong><Highlight text={product.name} search={highlightText} /></strong>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={`${formatPrice(product.price)} ${t('EUR')}`}>
                      <Box
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '80px',
                        }}
                      >
                       <strong>{`${formatPrice(product.price)} ${t('EUR')}`}</strong>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={product.category}>
                      <Box
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '120px',
                        }}
                      >
                        <Highlight text={product.category} search={highlightText} />
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={product.company}>
                      <Box
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '120px',
                        }}
                      >
                        {t(product.company)}
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onAddToQuote(product.id)}
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                      {t('AddToQuote')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)', mt: 1 }}
      />
    </Paper>
  );
});

export default QuoteProductList;