import styled from "styled-components";

const Footer = () => {
  return (
    <div id="Footer">
      <FooterOuter>
        <FooterContainer>
          {/* <FooterText>Footer information</FooterText> */}
        </FooterContainer>
      </FooterOuter>
    </div>
  );
};

export default Footer;

const FooterOuter = styled.div`
  box-sizing: border-box;
  height: 100%;
  min-height: 50vh;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FooterContainer = styled.div`
  max-width: 1360px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FooterText = styled.p`
height: 100%;
  margin: 0;
`;
