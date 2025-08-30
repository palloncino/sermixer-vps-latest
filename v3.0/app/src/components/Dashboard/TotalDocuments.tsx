import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PALETTE } from '../../constants';

interface TotalDocumentsProps {
  count: number;
}

const TotalDocuments: React.FC<TotalDocumentsProps> = ({ count }) => {
  const { t } = useTranslation();
  
  return (
    <TotalContainer>
      <TotalTitle>{t('Total Documents')}</TotalTitle>
      <TotalCount>{count}</TotalCount>
      <TotalSubtext>{t('in system')}</TotalSubtext>
    </TotalContainer>
  );
};

const TotalContainer = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #667eea;
  }
`;

const TotalTitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TotalCount = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const TotalSubtext = styled.div`
  font-size: 0.875rem;
  color: #4a4a4a;
  font-weight: 500;
`;

export default TotalDocuments;