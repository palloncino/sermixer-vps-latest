import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import FlashMessage from "../../components/FlashMessage";
import PageHeader from "../../components/PageHeader";
import { useAppState } from "../../state/stateContext";
import { WhitePaperContainer } from "../documents/styled-components";

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const { signup, signupError, signupSuccessMessage } = useAppState();
  const [formData, setFormData] = useState<UserType>({
    username: "",
    firstName: "",
    lastName: "",
    companyName: "sermixer",
    email: "",
    role: "user",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event: SelectChangeEvent<"sermixer" | "s2_truck_service">) => {
    setFormData({
      ...formData,
      companyName: event.target.value as "sermixer" | "s2_truck_service",
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    signup(formData);
  };

  return (
    <WhitePaperContainer>
      <CompactContainer maxWidth="lg">
        {signupError && <FlashMessage message={signupError} type="error" />}
        {signupSuccessMessage && (
          <FlashMessage message={signupSuccessMessage} type="success" />
        )}
        <Box>
          <PageHeader title={t("Register")} margin={"0"} />

          <CompactForm onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label={t("Username")}
                  name="username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleTextChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label={t("FirstName")}
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleTextChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label={t("LastName")}
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleTextChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="companyName-label">{t("Company")}</InputLabel>
                  <Select
                    labelId="companyName-label"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="sermixer">Sermixer</MenuItem>
                    <MenuItem value="s2_truck_service">S2 Truck Service</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label={t("Email")}
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label={t("Password")}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleTextChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="confirmPassword"
                  label={t("ConfirmPassword")}
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
            <Box my={2} width={"100%"}>
              <CompactButton
                type="submit"
                fullWidth
                variant="contained"
              >
                {t("Register")}
              </CompactButton>
            </Box>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  {t("ChangeToLogin")}
                </Link>
              </Grid>
            </Grid>
          </CompactForm>
        </Box>
      </CompactContainer>
    </WhitePaperContainer>
  );
};

export default SignupPage;


const CompactContainer = styled(Container)`
  max-width: 500px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CompactForm = styled.form`
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CompactButton = styled(Button)`
  margin-top: 12px;
  height: 48px;
  font-size: 0.9rem;
`;