import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Loading from "../../components/Loading/index.js";
import PageHeader from "../../components/PageHeader/index.tsx";
import { ROUTES, SectionBorderContainer } from "../../constants/index.ts";
import { useAppState } from "../../state/stateContext";
import { UserType } from '../../types/index.ts';
import { WhitePaperContainer } from "../documents/styled-components/index.ts";

const HeadContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const StyledCard = styled(Card)`
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  background-color: #f9f9f9;
`;

const UserPage: FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const { users, getUsers, loadingUsers } = useAppState();
  const [theUser, setTheUser] = useState<UserType | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!users.length) {
      getUsers();
    } else {
      setIsLoading(false);
    }
  }, [getUsers, users.length]);

  useEffect(() => {
    const foundUser = users.find(({ id }) => id.toString() === userId);
    setTheUser(foundUser || null);
    setIsLoading(false);
  }, [userId, users]);

  const handleCloseDialog = () => setOpenDialog(false);

  if (isLoading || loadingUsers) {
    return <Loading />;
  }

  if (!theUser) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" gutterBottom color="error">
          {t("404UserNotFound")}
        </Typography>
        <Typography variant="subtitle1">
          {t("404UserNotFoundErrorMessage", { id: userId })}
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
      <Container maxWidth={'lg'}>
        <PageHeader title={t("UserPageTitle")} description={t("UserPageDescription")} margin={'0'} />
          <StyledCard>
            <CardContent>
              <HeadContainer>
                <Typography variant="h4" gutterBottom>
                  {`${theUser.firstName} ${theUser.lastName}`}
                </Typography>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to={ROUTES(userId).editUser}
                  >
                    {t("EditUser")}
                  </Button>
                </CardActions>
              </HeadContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <StyledTableCell>{t("ID")}</StyledTableCell>
                    <TableCell>{theUser.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>{t("Username")}</StyledTableCell>
                    <TableCell>{theUser.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>{t("Email")}</StyledTableCell>
                    <TableCell>{theUser.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>{t("Company")}</StyledTableCell>
                    <TableCell>{theUser.companyName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>{t("Role")}</StyledTableCell>
                    <TableCell>{theUser.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>{t("Registered")}</StyledTableCell>
                    <TableCell>{new Date(theUser.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell>{t("Last Updated")}</StyledTableCell>
                    <TableCell>{new Date(theUser.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </StyledCard>
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
            <DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
          </Dialog>
      </Container>
    </WhitePaperContainer>
  );
};

export default UserPage;
