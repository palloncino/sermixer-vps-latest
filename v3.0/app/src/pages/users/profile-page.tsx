import { Button, Card, CardActions, CardContent, Container, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PageHeader from "../../components/PageHeader/index.tsx";
import { ROUTES, SectionBorderContainer } from "../../constants/index.ts";
import { useAppState } from "../../state/stateContext";
import { WhitePaperContainer } from "../documents/styled-components/index.ts";

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAppState();

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom color="error">
          {t("UserDataNA")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={ROUTES().userList}
        >
          {t("BackToUsersList")}
        </Button>
      </Container>
    );
  }

  return (
    <WhitePaperContainer>
      <Container>
        <PageHeader title={t("ProfilePageTitle")} description={t("ProfilePageDescription")} margin={'0'} />
        <SectionBorderContainer>
          <Card sx={{ width: "100%" }}>
            <CardContent>
              <HeadContainer>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={ROUTES(user.id).editUser}
                  >
                    {t("EditUser")}
                  </Button>
                </CardActions>
              </HeadContainer>
              <Table>
                <TableBody>
                  {Object.entries({
                    FirstName: user.firstName,
                    LastName: user.lastName,
                    Username: user.username,
                    Email: user.email,
                    Company: user.companyName,
                    Role: user.role,
                    Registered: new Date(user.createdAt).toLocaleDateString(),
                    LastUpdated: new Date(user.updatedAt).toLocaleDateString(),
                  }).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell>{t(key)}</TableCell>
                      <TableCell>
                        <strong>{value}</strong>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </SectionBorderContainer>
      </Container>
    </WhitePaperContainer>
  );
};

export default Profile;
