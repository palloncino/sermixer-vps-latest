import { Box, Button, Card, CardContent, Grid, TextField } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ClientType } from "../../types";

interface EditClientProps {
    client: ClientType;
    onSave: (client: ClientType) => void;
    onCancel: () => void;
}

const EditClient: React.FC<EditClientProps> = ({ client, onSave, onCancel }) => {
    const { t } = useTranslation();
    const [editedClient, setEditedClient] = useState<ClientType>({ ...client });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes("address.")) {
            const addressField = name.split(".")[1];
            setEditedClient(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setEditedClient(prev => ({ ...prev, [name]: value }));
        }
    };

    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("FirstName")}
                            name="firstName"
                            value={editedClient.firstName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("LastName")}
                            name="lastName"
                            value={editedClient.lastName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("FiscalCode")}
                            name="fiscalCode"
                            value={editedClient.fiscalCode}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("VATNumber")}
                            name="vatNumber"
                            value={editedClient.vatNumber}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("CompanyName")}
                            name="companyName"
                            value={editedClient.companyName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("Email")}
                            name="email"
                            value={editedClient.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("MobileNumber")}
                            name="mobileNumber"
                            value={editedClient.mobileNumber}
                            onChange={handleChange}
                        />
                    </Grid>
                    {/* Address Fields */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t("Street")}
                            name="address.street"
                            value={editedClient.address.street}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            fullWidth
                            label={t("City")}
                            name="address.city"
                            value={editedClient.address.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            fullWidth
                            label={t("ZipCode")}
                            name="address.zipCode"
                            value={editedClient.address.zipCode}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField
                            fullWidth
                            label={t("Country")}
                            name="address.country"
                            value={editedClient.address.country}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <ButtonContainer>
                    <Button variant="contained" onClick={() => onSave(editedClient)} sx={{ mr: 2 }}>
                        {t("SaveChanges")}
                    </Button>
                    <Button variant="outlined" onClick={onCancel}>
                        {t("Cancel")}
                    </Button>
                </ButtonContainer>
            </CardContent>
        </Card>
    );
};

export default EditClient;

const ButtonContainer = styled(Box)`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;
