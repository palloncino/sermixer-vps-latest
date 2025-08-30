import React, { useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import styled from "styled-components";
import { UserType } from "../../types";

interface EditUserProps {
  user: UserType;
  onSave: (user: UserType) => void;
  onCancel: () => void;
}

const EditUser: React.FC<EditUserProps> = ({ user, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [editedUser, setEditedUser] = useState<UserType>({ ...user });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
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
              value={editedUser.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("LastName")}
              name="lastName"
              value={editedUser.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("Username")}
              name="username"
              value={editedUser.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("Email")}
              name="email"
              value={editedUser.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="company-select-label">{t("Company")}</InputLabel>
              <Select
                labelId="company-select-label"
                id="company-select"
                name="companyName"
                value={editedUser.companyName}
                onChange={handleSelectChange}
              >
                <MenuItem value="sermixer">{t('Sermixer')}</MenuItem>
                <MenuItem value="s2_truck_service">{t('S2TruckService')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">{t("Role")}</InputLabel>
              <Select
                labelId="role-select-label"
                id="role-select"
                name="role"
                value={editedUser.role}
                onChange={handleSelectChange}
              >
                <MenuItem value="user">{t("User")}</MenuItem>
                <MenuItem value="admin">{t("Admin")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <ButtonContainer>
          <Button variant="contained" onClick={() => onSave(editedUser)} sx={{ mr: 2 }}>
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

export default EditUser;

const ButtonContainer = styled(Box)`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
`;
