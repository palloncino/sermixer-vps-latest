import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/Loading";
import { PALETTE, ROUTES } from "../../constants/index.ts";
import Logo from "../../media/logo.png";
import { useAppState } from "../../state/stateContext";
import { isAdmin, isUser } from "../../utils/isWho";

const StyledAppBar = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%);
  color: #fff;
  width: 100%;
  height: 60px;
  top: 0;
  z-index: 1100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: fixed;
  border-bottom: 2px solid #000000;
  
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
  padding: 8px 24px;
  height: 100%;
  position: relative;
  z-index: 2;
`;

const StyledToolbar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;

const LogoButton = styled(RouterLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 10px;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const VersionText = styled.span`
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 2px;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 0;
  padding-right: 8px;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 1.2rem;
`;

const UserCompany = styled.span`
  font-weight: 500;
  font-size: 0.8rem;
`;

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, isLoadingAuthorization } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate(ROUTES().profile);
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleMenuClose();
  };

  const renderVisitorLinks = () => (
    <>
      {/* <Button onClick={() => navigate("/login")}>{t("Login")}</Button>
      <Button onClick={() => navigate("/signup")}>{t("SignUp")}</Button> */}
    </>
  );

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const renderUserLinks = () => (
    <>
      <UserDisplay>
        <UserInfo>
          <UserName>
            {user ? `${user.firstName} ${user.lastName}` : ""}
          </UserName>
          <UserCompany>
            {user
              ? `${user.role}, ${capitalizeFirstLetter(user.companyName)}`
              : ""}
          </UserCompany>
        </UserInfo>
      </UserDisplay>
      <IconButton onClick={handleMenuOpen} color="inherit">
        <Avatar />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileClick}>{t("ViewProfile")}</MenuItem>
        <MenuItem onClick={handleLogoutClick}>{t("Logout")}</MenuItem>
      </Menu>
    </>
  );

  const renderAdminLinks = () => <>{renderUserLinks()}</>;

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "it" : "en";
    i18n.changeLanguage(newLanguage);
  };

  if (isLoadingAuthorization) return <Loading />;

  return (
    <StyledAppBar id="Navbar">
      <StyledContainer>
        <StyledToolbar>
          <LogoButton to="/">
            <LogoImage src={Logo} alt="Logo" />
            <LogoText>
              <span style={{ fontSize: '1.2rem' }}>{t("LogoTextSub")}</span>
              <VersionText>v3.0</VersionText>
            </LogoText>
          </LogoButton>
          {!isMobile && (
            <ActionContainer>
              {!user && renderVisitorLinks()}
              {isUser(user) && renderUserLinks()}
              {isAdmin(user) && renderAdminLinks()}
              <Tooltip title={t("Toggle Language")}>
                <IconButton onClick={toggleLanguage} style={{ color: "#fff" }}>
                  {i18n.language === "en" ? "IT" : "EN"}
                </IconButton>
              </Tooltip>
            </ActionContainer>
          )}
          {isMobile && (
            <IconButton>
              <MenuIcon />
            </IconButton>
          )}
        </StyledToolbar>
        <Breadcrumb />
      </StyledContainer>
    </StyledAppBar>
  );
}

export default Navbar;
