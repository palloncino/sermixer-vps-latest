import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const TOGGLE_WIDTH = 200;

export type StatusName =
  | "DOCUMENT_OPENED"
  | "EMAIL_OTP"
  | "CLIENT_SIGNATURE"
  | "STORAGE_CONFIRMATION"
  | "EXPIRED"
  | "REJECTED";

export type StatusStep = {
  name: StatusName;
  value: boolean;
};

type StepProgressProps = {
  documentStatus: StatusStep[];
};

const StepProgress = ({ documentStatus }: StepProgressProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true)
    }, 300)
  }, [])

  const steps = [
    { name: "DOCUMENT_OPENED", group: "success" },
    { name: "EMAIL_OTP", group: "success" },
    { name: "CLIENT_SIGNATURE", group: "success" },
    { name: "STORAGE_CONFIRMATION", group: "factory" },
    { name: "EXPIRED", group: "danger" },
    { name: "REJECTED", group: "danger" },
  ];

  const getStepStatus = (stepName: StatusName) => {
    const step = documentStatus.find(s => s.name === stepName);
    return step ? step.value : false;
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ProgressContainer id="StepProgress">
      <ToggleLabel onClick={toggleDrawer} is_open={isOpen}>
        <IconButton style={{ color: 'white' }}>
          <HistoryIcon />
        </IconButton>
        <Typography variant="body2" color="white" style={{ marginLeft: '0.5rem' }}>
          {t('Status')}
        </Typography>
        <IconButton style={{ color: 'white' }}>
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </ToggleLabel>
      <Drawer is_open={isOpen}>
        <StyledPaper>
          <ProgressContent>
            <StepsContainer>
              {steps.map((step, index) => (
                <StepBox key={index} group={step.group} completed={getStepStatus(step.name)}>
                  <Typography variant="body2" color="inherit">
                    {t(`${step.name}`)}
                  </Typography>
                </StepBox>
              ))}
            </StepsContainer>
          </ProgressContent>
        </StyledPaper>
      </Drawer>
    </ProgressContainer>
  );
};

const ProgressContainer = styled(Grid)`
  height: auto;
  display: flex;
  box-sizing: border-box;
  position: fixed;
  z-index: 900;
  left: 0;
  bottom: 0;
  width: 100%;
`;

const ToggleLabel = styled(Box)<{ is_open: boolean }>`
  box-sizing: border-box;
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${TOGGLE_WIDTH}px;
  height: 64px; /* Matching height */
  position: absolute;
  left: 0;
  bottom: 0;
  border-top-right-radius: 8px;
  z-index: 1000; /* Ensure it's above the drawer */
`;

const Drawer = styled(Box)<{ is_open: boolean }>`
  border-top: 2px solid #ccc;
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: #fff;
  transition: transform 0.3s ease;
  transform: translateY(${(props) => (props.is_open ? '0' : '100%')});
`;

const StyledPaper = styled("div")`
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  width: calc(100% - ${TOGGLE_WIDTH}px);
  margin-left: ${TOGGLE_WIDTH}px;
  border-radius: 8px 8px 0 0;
  height: 64px; /* Matching height */
`;

const ProgressContent = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 1rem;
  width: 100%;
`;

const StepsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StepBox = styled(Box)<{ group: string; completed: boolean }>`
  flex: 1;
  padding: 0.5rem;
  margin: 0 0.5rem;
  text-align: center;
  background-color: ${({ completed, group }) => {
    if (group === "success") return completed ? "#4caf50" : "#F4F4F4";
    if (group === "factory") return completed ? "#2196f3" : "#F4F4F4";
    if (group === "danger") return completed ? "#f44336" : "#F4F4F4";
    return "#F4F4F4";
  }};
  color: ${({ completed }) => (completed ? "white" : "#333")};
  border-radius: 4px;
  min-width: 100px;
`;

export default StepProgress;
