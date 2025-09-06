import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Paper,
    Divider,
    Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../state/stateContext";
import Highlight from "../../components/HighlightText"; // Import your Highlight component
import Button from "../Button"; // Import your custom Button component
import { CheckCircle, People, Search } from "@mui/icons-material";

const ClientSelector = ({ onClientChange }) => {
    const { t } = useTranslation();
    const { clients, getClients, getClientsIsLoading, getClientsError } = useAppState();
    const [selectedClient, setSelectedClient] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 8; // Reduced from 10 for more compact display

    useEffect(() => {
        if (clients.length === 0) {
            getClients();
        }
    }, [getClients]);

    useEffect(() => {
        onClientChange(selectedClient);
    }, [selectedClient, onClientChange]);

    const handleSelectClient = (client) => {
        setSelectedClient(client);
    };

    const handleDeselectClient = () => {
        setSelectedClient(null);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const filteredClients = useMemo(() => {
        return clients.filter((client) =>
            client.companyName.toLowerCase().includes(search.toLowerCase())
        );
    }, [clients, search]);

    const currentPageClients = useMemo(() => {
        return filteredClients.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    }, [filteredClients, page]);

    if (getClientsIsLoading) {
        return <Typography>{t("LoadingClients")}</Typography>;
    }

    if (getClientsError) {
        return <Typography color="error">{t("ErrorLoadingClients")}: {getClientsError}</Typography>;
    }

    return (
        <Paper 
            elevation={2} 
            sx={{ 
                backgroundColor: 'background.paper', 
                borderRadius: 2, 
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            {/* Header */}
            <Box 
                sx={{ 
                    px: 2.5, 
                    py: 1.5, 
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                <People fontSize="small" />
                <Typography variant="subtitle1" fontWeight={600}>
                    {t("ClientSelection")}
                </Typography>
            </Box>

            <Box sx={{ p: 2.5 }}>
            
            {selectedClient ? (
                <Box sx={{ position: "relative" }}>
                    {/* CheckCircle icon for the selected client */}
                    <CheckCircle
                        color="success"
                        sx={{
                            position: "absolute",
                            top: -8,
                            left: -8,
                            fontSize: "1.5rem",
                        }}
                    />

                    {/* Selected Client Details */}
                    <Paper 
                        elevation={1} 
                        sx={{ 
                            border: "2px solid", 
                            borderColor: "success.main", 
                            borderRadius: 2, 
                            backgroundColor: 'success.50',
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            {t("ClientName")}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {`${selectedClient.firstName} ${selectedClient.lastName}`}
                                        </Typography>
                                    </Box>
                                    <CheckCircle color="success" fontSize="small" />
                                </Box>
                                
                                <Box>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        {t("CompanyName")}
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                        {selectedClient.companyName}
                                    </Typography>
                                </Box>
                                
                                <Stack direction="row" spacing={3}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            {t("VAT")}
                                        </Typography>
                                        <Typography variant="body1" fontFamily="monospace">
                                            {selectedClient.vatNumber}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                            {t("Email")}
                                        </Typography>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                                            {selectedClient.email}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Stack>
                        </Box>
                        
                        <Divider />
                        
                        <Box sx={{ p: 1.5, textAlign: 'center', backgroundColor: 'background.default' }}>
                            <Button 
                                variant="outlined" 
                                onClick={handleDeselectClient} 
                                size="small"
                                color="primary"
                            >
                                {t("DeselectClient")}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            ) : (
                <>
                    {/* Search Filter */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Search fontSize="small" />
                            {t("SearchCompany")}
                        </Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={search}
                            onChange={handleSearchChange}
                            size="small"
                            placeholder={t("SearchCompanyPlaceholder")}
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'background.default'
                                }
                            }}
                        />
                    </Box>

                    {/* Client List */}
                    <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <TableContainer>
                            <Table size="small" aria-label="client table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'background.default' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>{t('ID')}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>{t('CompanyName')}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>{t('VAT')}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>{t('Actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentPageClients.map((client) => (
                                        <TableRow key={client.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                                            <TableCell sx={{ fontSize: '0.875rem' }}>{client.id}</TableCell>

                                            {/* Company Name with Tooltip and Highlight */}
                                            <TableCell>
                                                <Tooltip title={client.companyName} arrow>
                                                    <Box
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: '150px',
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        <Highlight text={client.companyName} search={search} />
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>

                                            {/* VAT with Tooltip */}
                                            <TableCell>
                                                <Tooltip title={client.vatNumber} arrow>
                                                    <Box
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: '120px',
                                                            fontSize: '0.875rem',
                                                            fontFamily: 'monospace',
                                                        }}
                                                    >
                                                        {client.vatNumber}
                                                    </Box>
                                                </Tooltip>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleSelectClient(client)}
                                                    sx={{ 
                                                        fontSize: '0.75rem',
                                                        px: 1.5,
                                                        py: 0.5,
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    {t('Select')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Pagination */}
                        {filteredClients.length > itemsPerPage && (
                            <Box sx={{ display: "flex", justifyContent: "center", p: 1.5, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'background.default' }}>
                                <Pagination
                                    size="small"
                                    count={Math.ceil(filteredClients.length / itemsPerPage)}
                                    page={page}
                                    onChange={handleChangePage}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            fontSize: '0.75rem',
                                            minWidth: '32px',
                                            height: '32px'
                                        }
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </>
            )}
            </Box>
        </Paper>
    );
};

export default ClientSelector;