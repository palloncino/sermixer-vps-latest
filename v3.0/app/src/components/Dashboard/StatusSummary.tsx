import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface StatusSummaryProps {
  documents: any[];
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ documents }) => {
  const { t } = useTranslation();
  
  const getStatusCount = (status: string) => {
    return documents.filter(doc => doc.status && doc.status[status]).length;
  };

  const getTotalDocuments = documents.length;
  const activeCount = getStatusCount('CLIENT_VIEWED_DOC');
  const pendingCount = getStatusCount('YOUR_TURN');
  const finalizedCount = getStatusCount('FINALIZED');
  const rejectedCount = getStatusCount('REJECTED');

  return (
    <StatusContainer>
      <StatusItem>
        <StatusLabel>{t('Total')}</StatusLabel>
        <StatusCount>{getTotalDocuments}</StatusCount>
        <StatusSubtext>{t('Documents')}</StatusSubtext>
      </StatusItem>
      <StatusItem>
        <StatusLabel>{t('Active')}</StatusLabel>
        <StatusCount style={{ color: '#10b981' }}>{activeCount}</StatusCount>
        <StatusSubtext>{t('Client Viewed')}</StatusSubtext>
      </StatusItem>
      <StatusItem>
        <StatusLabel>{t('Pending')}</StatusLabel>
        <StatusCount style={{ color: '#f59e0b' }}>{pendingCount}</StatusCount>
        <StatusSubtext>{t('Your Turn')}</StatusSubtext>
      </StatusItem>
      <StatusItem>
        <StatusLabel>{t('Finalized')}</StatusLabel>
        <StatusCount style={{ color: '#059669' }}>{finalizedCount}</StatusCount>
        <StatusSubtext>{t('Completed')}</StatusSubtext>
      </StatusItem>
      <StatusItem>
        <StatusLabel>{t('Rejected')}</StatusLabel>
        <StatusCount style={{ color: '#dc2626' }}>{rejectedCount}</StatusCount>
        <StatusSubtext>{t('Declined')}</StatusSubtext>
      </StatusItem>
      <StatusItem>
        <StatusLabel>{t('Success Rate')}</StatusLabel>
        <StatusCount style={{ color: '#2563eb' }}>
          {getTotalDocuments > 0 ? Math.round((finalizedCount / getTotalDocuments) * 100) : 0}%
        </StatusCount>
        <StatusSubtext>{t('Finalized')}</StatusSubtext>
      </StatusItem>
    </StatusContainer>
  );
};

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const StatusTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.5rem;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const StatusItem = styled.div`
  background: #fafafa;
  padding: 1.25rem;
  border-radius: 0;
  border: none;
  box-shadow: none;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    background: #f5f5f5;
    transform: none;
    box-shadow: none;
  }
`;

const StatusLabel = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusCount = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const StatusLink = styled(Link)`
  font-size: 0.75rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

const StatusSubtext = styled.div`
  font-size: 0.625rem;
  color: #6b7280;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default StatusSummary;