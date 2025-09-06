import React from 'react';
import styled from 'styled-components';
import { PALETTE } from '../../constants/index.ts';

const StyledFooter = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%);
  color: #fff;
  width: 100%;
  height: 210px;
  bottom: 0;
  z-index: 1100;
  box-shadow: 0 -6px 30px rgba(0, 0, 0, 0.3);
  position: fixed;
  border-top: 2px solid #000000;
  
  /* Add subtle pattern overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: ${PALETTE.HeaderPattern2};
    background-size: 88px 24px;
    background-repeat: repeat;
    opacity: 0.08;
    pointer-events: none;
    z-index: 1;
  }
`;

const StyledContainer = styled.div`
  max-width: 1360px;
  margin: auto;
  padding: 16px 24px;
  height: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <StyledContainer>
        {/* Footer content will be added here in the future */}
      </StyledContainer>
    </StyledFooter>
  );
};

export default Footer;
