import {
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
  Box
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from 'styled-components';
import { WhitePaperContainer } from "./documents/styled-components";
import Loading from "../components/Loading";

const Dashboard = React.lazy(() => import("../components/Dashboard"));
const RecentDocuments = React.lazy(() => import("../components/RecentDocuments"));

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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <WhitePaperContainer>
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          </WhitePaperContainer>
          
          <Suspense fallback={<Loading />}>
            <RecentDocuments />
          </Suspense>
        </Box>
      </MobileContainer>
    );
  }

  return (
    <DesktopContainer>
      <Box sx={{ width: '100%', maxWidth: '1400px', margin: '0 auto', p: 2 }}>
        <Grid container spacing={3} sx={{ height: 'calc(100vh - 300px)' }}>
          {/* Chat Column */}
          <Grid item xs={12} lg={7}>
            <WhitePaperContainer>
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            </WhitePaperContainer>
          </Grid>
          
          {/* Recent Documents Column */}
          <Grid item xs={12} lg={5}>
            <Suspense fallback={<Loading />}>
              <RecentDocuments />
            </Suspense>
          </Grid>
        </Grid>
      </Box>
    </DesktopContainer>
  );
};

// Styled Components
const DesktopContainer = styled.div`
  display: flex;
  overflow: hidden;
  margin-top: 10px;
`;

const MobileContainer = styled.div`
  padding: 0.75rem;
  min-height: 100vh;
  background-color: #fafafa;
`;

export default Homepage;
