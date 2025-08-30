import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import DoneIcon from '@mui/icons-material/Done';

interface StatusCellProps {
  statuses: {
    [key: string]: boolean;
  };
  compact?: boolean;
}

// Status icon mapping
const getStatusIcon = (status: string, isActive: boolean) => {
  if (!isActive) return null;
  
  switch (status) {
    case 'CLIENT_VIEWED_DOC':
      return <CheckCircleIcon fontSize="small" style={{ color: '#10B981' }} />;
    case 'YOUR_TURN':
      return <PendingIcon fontSize="small" style={{ color: '#F59E0B' }} />;
    case 'FINALIZED':
      return <DoneIcon fontSize="small" style={{ color: '#059669' }} />;
    case 'REJECTED':
      return <CancelIcon fontSize="small" style={{ color: '#DC2626' }} />;
    default:
      return <CheckCircleIcon fontSize="small" style={{ color: '#6B7280' }} />;
  }
};

const StatusCell: React.FC<StatusCellProps> = ({ statuses }) => {
  const { t } = useTranslation();

  // Check if there are any active statuses
  const activeStatuses = Object.entries(statuses).filter(([_, value]) => value);
  const hasActiveStatus = activeStatuses.length > 0;

  if (!hasActiveStatus) {
    return (
      <Tooltip title="No active status" arrow>
        <NoStatusDot />
      </Tooltip>
    );
  }

  return (
    <StatusContainer>
      {activeStatuses.map(([status, _]) => (
        <Tooltip key={status} title={t(status)} arrow>
          <StatusIconWrapper>
            {getStatusIcon(status, true)}
          </StatusIconWrapper>
        </Tooltip>
      ))}
    </StatusContainer>
  );
};

const StatusContainer = styled.div`
  display: flex;
  gap: 0.25rem;
  justify-content: center;
  align-items: center;
`;

const StatusIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const NoStatusDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #B0BEC5;
  border: 1.5px solid #78909C;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.3);
    box-shadow: 0 0 10px rgba(176, 190, 197, 0.5);
  }
`;

export default StatusCell;
