import { Typography, styled as muiStyled } from "@mui/material";
import styled from "styled-components";
import { PALETTE } from "../../constants/index.ts";

const PageHeader = ({ title, description = '', margin }: any) => {
  return (
    <FullWidthStyledContainer margin={margin}>
      <LimitedContainer>
        <Title variant="h4" align="left">
          {title}
        </Title>
        {description ? (
          <Description variant="body1" paragraph align="left">
            {description}
          </Description>
        ) : null}
      </LimitedContainer>
    </FullWidthStyledContainer>
  );
};

const Title = muiStyled(Typography)`
  width: 100%;
`;

const FullWidthStyledContainer = styled.div<{margin?: string}>`
  margin: ${({ margin }) => margin ? margin : '4rem 0 0rem 0'};
  padding: 24px 0 24px 0;
`;

const LimitedContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`;

const Description = muiStyled(Typography)`
  line-height: 2rem;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`;

export default PageHeader;


export const PageHeaderStyle2 = ({ title, description = '', margin }: any) => {
  return (
    <FullWidthStyledContainerStyle2 margin={margin}>
      <LimitedContainerStyle2>
        <TitleStyle2 variant="h4" gutterBottom align="left">
          {title}
        </TitleStyle2>
        {description ? (
          <DescriptionStyle2 variant="body1" paragraph align="left">
            {description}
          </DescriptionStyle2>
        ) : null}
      </LimitedContainerStyle2>
    </FullWidthStyledContainerStyle2>
  );
};

const TitleStyle2 = muiStyled(Typography)`
  width: 100%;
`;

const FullWidthStyledContainerStyle2 = styled("div")<{margin?: string}>`
  background: #F5F5F5;
  border-radius: .4rem;
  color: ${PALETTE.Black3};
  align-text: center;
  margin: ${({ margin }) => margin ? margin : '4rem 0 0rem 0'};
  padding: 24px 0 24px 0;
`;

const LimitedContainerStyle2 = styled.div`
width: 100%;
margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
  padding: 0 1rem;
`;

const DescriptionStyle2 = muiStyled(Typography)`
  line-height: 2rem;
  margin: 0;
  transition: opacity 0.5s ease-in-out; /* Smooth transition effect */
  opacity: 1;

  &:not(:hover) {
    opacity: 0.7;
  }
`;
