import { Box, Button, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditClient from "../../components/ClientEdit";
import FlashMessage from "../../components/FlashMessage/index";
import Loading from "../../components/Loading/index.js";
import PageHeader from "../../components/PageHeader";
import { ROUTES, SectionBorderContainer } from "../../constants/index";
import { useAppState } from "../../state/stateContext";
import { ClientType } from '../../types/index';
import { WhitePaperContainer } from "pages/documents/styled-components";

const EditClientPage: React.FC = () => {
    const { t } = useTranslation();
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();
    const { clients, editClient, editClientIsLoading, getClientsIsLoading, getClients } = useAppState();
    const [theClient, setTheClient] = useState<ClientType | undefined>(undefined); // Start with undefined to distinguish unloaded state
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!clients.length) {
            getClients();
        }
    }, [getClients, clients.length]);

    useEffect(() => {
        const foundClient = clients.find(({ id }) => id.toString() === clientId);
        setTheClient(foundClient);
    }, [clientId, clients]);

    const handleSave = async (editedClient: ClientType) => {
        try {
            const data = await editClient(editedClient);
            setMessage(`Client updated successfully. ID: ${data.id}, Name: ${data.firstName} ${data.lastName}`);
        } catch (error: any) {
            console.error({ error });
            setErrorMessage(`Failed to edit client: ${error.message}`);
        }
    };

    const handleCancel = () => navigate(-1);

    if (getClientsIsLoading || editClientIsLoading || theClient === undefined) {
        return <Loading />;
    }

    if (!theClient) {
        return (
            <>
                <Box my={2}>
                    <FlashMessage message={t("404ClientNotFoundErrorMessage", { id: clientId })} type="error" />
                </Box>
                <Button component={Link} to={ROUTES().clientList} variant="contained">
                    {t("BackToClientsList")}
                </Button>
            </>
        );
    }

    return (
        <WhitePaperContainer>
            <Container maxWidth={'lg'}>
                <PageHeader title={t("EditingClient")} description={`${theClient.firstName} ${theClient.lastName}`} margin={'0'} />
                <Box my={4}>
                    {errorMessage && <FlashMessage message={errorMessage} type="error" />}
                    {message && <FlashMessage message={message} type="success" />}
                    <Typography component="p" gutterBottom>
                        {t("ID")}: {theClient.id}.{" "}
                        <Link to={ROUTES(theClient.id).clientPage} style={{ textDecoration: "none" }}>
                            {t("ViewDetails")}.
                        </Link>
                    </Typography>
                    <EditClient client={theClient} onSave={handleSave} onCancel={handleCancel} />
                </Box>
            </Container>
        </WhitePaperContainer>
    );
};

export default EditClientPage;
