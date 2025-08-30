import React, { useState } from "react";
import {
    IconButton,
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
    Box,
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../constants";
import { ClientType } from "../../types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Highlight from "../HighlightText";

interface ClientsListProps {
    clients: ClientType[];
    handleDeleteClients: (selectedIds: number[]) => void;
    onSort: (property: string) => void;
    order: 'asc' | 'desc';
    orderBy: string;
    searchTerm: string;
}

const ClientsList: React.FC<ClientsListProps> = ({
    clients,
    handleDeleteClients,
    onSort,
    order,
    orderBy,
    searchTerm,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
        onSort(property);
    };

    return (
        <Paper elevation={0} sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)' }}>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'companyName'}
                                    direction={orderBy === 'companyName' ? order : 'asc'}
                                    onClick={createSortHandler('companyName')}
                                    sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                                >
                                    {t('CompanyName')}
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>{t('Email')}</TableCell>
                            <TableCell>{t('VATCode')}</TableCell>
                            <TableCell>{t('Address')}</TableCell>
                            <TableCell>{t('Actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                            <TableRow key={client.id} hover>
                                <TableCell>
                                    <Tooltip title={client.companyName}>
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '150px',
                                            }}
                                        >
                                            <Highlight text={client.companyName} search={searchTerm} />
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={client.email}>
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '150px',
                                            }}
                                        >
                                            <Highlight text={client.email} search={searchTerm} />
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={client.vatNumber}>
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '100px',
                                            }}
                                        >
                                            <Highlight text={client.vatNumber} search={searchTerm} />
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={`${client.address?.street}, ${client.address?.city}, ${client.address?.zipCode}`}>
                                        <Box
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                maxWidth: '200px',
                                            }}
                                        >
                                            <Highlight text={`${client.address?.street}, ${client.address?.city}, ${client.address?.zipCode}`} search={searchTerm} />
                                        </Box>
                                    </Tooltip>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => navigate(ROUTES(client.id).clientPage)}
                                        aria-label={t('View')}
                                        size="small"
                                    >
                                        <VisibilityIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => navigate(ROUTES(client.id).editClient)}
                                        aria-label={t('Edit')}
                                        size="small"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteClients([client.id])}
                                        aria-label={t('Delete')}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={clients.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                labelRowsPerPage={t('Rows per page')}
                sx={{ borderTop: '1px solid rgba(224, 224, 224, 0.5)', mt: 1 }}
            />
        </Paper>
    );
};

export default ClientsList;
