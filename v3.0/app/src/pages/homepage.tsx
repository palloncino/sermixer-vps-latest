import {
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { WhitePaperContainer } from "./documents/styled-components";

const Dashboard = React.lazy(() => import("../components/Dashboard"));

const Homepage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setScreenHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    // Mobile layout - stack vertically
    return (
      <MobileContainer>
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
          {t("Dashboard")}
        </Typography>

        <WhitePaperContainer>
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        </WhitePaperContainer>
      </MobileContainer>
    );
  }

  return (
    <DesktopContainer>
      <WhitePaperContainer>
        <Suspense fallback={<div>Loading...</div>}>
          <Dashboard />
        </Suspense>
      </WhitePaperContainer>
    </DesktopContainer>
  );
};

// Styled Components
const DesktopContainer = styled.div`
  display: flex;
  overflow: hidden;
`;

const MobileContainer = styled.div`
  padding: 0.75rem;
  min-height: 100vh;
  background-color: #fafafa;
`;

export default Homepage;
