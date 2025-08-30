import { Container } from "@mui/material";
import React from "react";
import CreateClient from "../../components/ClientCreate";
import PageHeader from "../../components/PageHeader";
import { WhitePaperContainer } from "../documents/styled-components";

const CreateClientPage: React.FC = () => {
  return (
    <WhitePaperContainer>
      <Container maxWidth="md">
        <PageHeader title="Create New Client" margin={'0'} />
        <CreateClient />
      </Container>
    </WhitePaperContainer>
  );
};

export default CreateClientPage;
