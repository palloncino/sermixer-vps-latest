import {
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Tooltip,
    Box
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useParams } from "react-router-dom";
import { useFlashMessage } from "state/FlashMessageContext";
import PageHeader from "../../components/PageHeader";
import { ROUTES } from "../../constants";
import { useAppState } from "../../state/stateContext";
import { ClientType } from '../../types';
import { WhitePaperContainer } from "../documents/styled-components";
import Loading from "components/Loading";

const ClientPage: FC = () => {
    const { t } = useTranslation();
    const { clientId } = useParams<{ clientId: string }>();
    const { clients, getClients } = useAppState(); // assuming getClients is from the state context
    const [theClient, setTheClient] = useState<ClientType | null>(null);
    const [loading, setLoading] = useState(true); // Loading state
    const location = useLocation();
    const { showMessage } = useFlashMessage();

    const fetchClients = async () => {
        setLoading(true);
        await getClients();  // This should fetch the clients and update the state
        setLoading(false);
    };

    // Fetch clients if the list is empty on page load
    useEffect(() => {

        fetchClients();
    }, [getClients, clients.length]);

    // Find the client based on clientId after clients are fetched
    useEffect(() => {
        const foundClient = clients.find(({ id }) => `${id}` === `${clientId}`);
        setTheClient(foundClient || null);
    }, [clientId, clients]);

    // Show success message if the client was just created
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('created') === 'true') {
            showMessage(t('ClientCreatedSuccesfully'), 'success');
            fetchClients();
        }
    }, [location, showMessage, t]);

    // Show loading state while clients are being fetched
    if (loading) {
        return (
            <Loading />
        );
    }

    // Show 404 if the client is not found after fetching
    if (!theClient) {
        console.log("404 Error: No client found");
        return (
            <Container maxWidth="sm" sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h4" gutterBottom color="error">
                    {t("404ClientNotFound")}
                </Typography>
                <Typography variant="subtitle1">
                    {t("404ClientNotFoundErrorMessage", { id: clientId })}
                </Typography>
                <Button variant="contained" color="primary" component={Link} to={ROUTES().clientList}>
                    {t("BackToClientsList")}
                </Button>
            </Container>
        );
    }

    return (
        <WhitePaperContainer>
            <Container maxWidth="lg">
                <PageHeader
                    title={theClient.companyName || t("Client")}
                    description={t("ClientPageTitle")}
                    margin="0"
                />
                <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={12} container justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={ROUTES(clientId).editClient}
                        >
                            {t("EditClient")}
                        </Button>
                    </Grid>
                </Grid>
                <Card sx={{ width: "100%", borderRadius: 1, boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12)' }}>
                    <CardContent sx={{ padding: '16px 24px' }}>
                        <Table size="small">
                            <TableBody>
                                {[
                                    { label: t("ID"), value: theClient.id },
                                    { label: t("FiscalCode"), value: theClient.fiscalCode },
                                    { label: t("VAT Number"), value: theClient.vatNumber },
                                    { label: t("First Name"), value: theClient.firstName },
                                    { label: t("Last Name"), value: theClient.lastName },
                                    { label: t("Company Name"), value: theClient.companyName },
                                    { label: t("Email"), value: theClient.email },
                                    { label: t("Mobile Number"), value: theClient.mobileNumber },
                                    {
                                        label: t("Address"),
                                        value: `${theClient.address?.street}, ${theClient.address?.city}, ${theClient.address?.zipCode}, ${theClient.address?.country}`,
                                    },
                                    {
                                        label: t("Registered"),
                                        value: new Date(theClient.createdAt).toLocaleDateString(),
                                    },
                                    {
                                        label: t("Last Updated"),
                                        value: new Date(theClient.updatedAt).toLocaleDateString(),
                                    },
                                ].map(({ label, value }) => (
                                    <TableRow key={label}>
                                        <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', padding: '8px' }}>
                                            {label}
                                        </TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '8px' }}>
                                            <Tooltip title={value} arrow>
                                                <Box>{value}</Box>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Container>
        </WhitePaperContainer>
    );
};

export default ClientPage;
