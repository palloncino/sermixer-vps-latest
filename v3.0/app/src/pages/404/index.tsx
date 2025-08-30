import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { WhitePaperContainer } from "../documents/styled-components/index.ts";

const StyledContainer = styled(Container)`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const NotFoundPage: React.FC = () => {
  return (
    <WhitePaperContainer>
      <StyledContainer>
        <Typography variant="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sorry, the page you are looking for does not exist.
        </Typography>
        <Button color="primary" component={Link} to="/">
          Go to home
        </Button>
      </StyledContainer>
    </WhitePaperContainer>
  );
};

export default NotFoundPage;
