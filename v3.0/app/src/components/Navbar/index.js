import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Description,
  Add,
  Business,
  ShoppingCart,
  People,
  Assessment,
  Dashboard as DashboardIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
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
  background-color: ${PALETTE.HeaderBackground};
  background-image: ${PALETTE.HeaderPattern2};
  color: #fff;
  width: 100%;
  height: 210px;
  top: 0;
  z-index: 1100; /* Ensure it stays above other components */
`;

const StyledContainer = styled.div`
  max-width: 1360px;
  margin: auto;
  padding: 16px 24px;
  height: 100%;
`;

const StyledToolbar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoButton = styled(RouterLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 8px;
`;

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 0;
  padding-right: 6px;
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.3;
`;

const UserCompany = styled.span`
  font-weight: 400;
  font-size: 0.75rem;
  opacity: 0.9;
  line-height: 1.2;
`;

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout, isLoadingAuthorization } = useAppState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [burgerMenuEl, setBurgerMenuEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBurgerMenuOpen = (event) => {
    setBurgerMenuEl(event.currentTarget);
  };

  const handleBurgerMenuClose = () => {
    setBurgerMenuEl(null);
  };

  const handleProfileClick = () => {
    navigate(ROUTES().profile);
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    logout();
    handleMenuClose();
  };

  const handleQuickLinkClick = (route) => {
    navigate(route);
    handleBurgerMenuClose();
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
    </>
  );

  const renderAdminLinks = () => <>{renderUserLinks()}</>;

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "it" : "en";
    i18n.changeLanguage(newLanguage);
  };

  const renderBurgerMenu = () => (
    <Menu
      anchorEl={burgerMenuEl}
      open={Boolean(burgerMenuEl)}
      onClose={handleBurgerMenuClose}
      PaperProps={{
        sx: {
          minWidth: 260,
          mt: 1,
          '& .MuiMenuItem-root': {
            py: 0.75,
            px: 2,
          }
        }
      }}
    >
      {/* Dashboard */}
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().dashboard)}>
        <ListItemIcon>
          <DashboardIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>
          <Typography variant="body2" fontWeight={600}>
            {t('Dashboard')}
          </Typography>
        </ListItemText>
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      {/* Documents Section */}
      <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('Documents')}
      </Typography>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().createDocument)} sx={{ pl: 3 }}>
        <ListItemText primary={t('New Document')} secondary={t('Create quote or invoice')} />
      </MenuItem>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().documentsList)} sx={{ pl: 3 }}>
        <ListItemText primary={t('Documents List')} secondary={t('View all documents')} />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      {/* Clients Section */}
      <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('Clients')}
      </Typography>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().clientsList)} sx={{ pl: 3 }}>
        <ListItemText primary={t('Clients List')} secondary={t('View client database')} />
      </MenuItem>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().createClient)} sx={{ pl: 3 }}>
        <ListItemText primary={t('Create Client')} secondary={t('Add new client')} />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      {/* Products Section */}
      <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('Products')}
      </Typography>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().productList)} sx={{ pl: 3 }}>
        <ListItemText primary={t('Products List')} secondary={t('View all products')} />
      </MenuItem>
      {isAdmin(user) && (
        <MenuItem onClick={() => handleQuickLinkClick(ROUTES().createProduct)} sx={{ pl: 3 }}>
          <ListItemText primary={t('Create Product')} secondary={t('Add new product')} />
        </MenuItem>
      )}

      <Divider sx={{ my: 0.5 }} />

      {/* Users Section */}
      <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('Users')}
      </Typography>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().usersList)} sx={{ pl: 3 }}>
        <ListItemText primary={t('Users List')} secondary={t('Manage user accounts')} />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      {/* PDF Management Section */}
      <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('File Management')}
      </Typography>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().pdfManagement)} sx={{ pl: 3 }}>
        <ListItemText primary={t('PDF Management')} secondary={t('Manage and organize PDF files')} />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      {/* Reports Section */}
      <Typography variant="caption" sx={{ px: 2, py: 0.75, display: 'block', color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {t('Reports')}
      </Typography>
      <MenuItem onClick={() => handleQuickLinkClick(ROUTES().documentsList)} sx={{ pl: 3 }}>
        <ListItemText primary={t('View Reports')} secondary={t('Analytics & insights')} />
      </MenuItem>
    </Menu>
  );

  if (isLoadingAuthorization) return <Loading />;

  return (
    <StyledAppBar id="Navbar">
      <StyledContainer>
        <StyledToolbar>
          <LogoButton to="/">
            <LogoImage src={Logo} alt="Logo" />
            <LogoText>
              <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{t("LogoText")}</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>{t("LogoTextSub")} v3.0</span>
            </LogoText>
          </LogoButton>
          <ActionContainer>
            {/* Burger Menu - always visible */}
            <Tooltip title={t("Quick Actions Menu")}>
              <IconButton onClick={handleBurgerMenuOpen} style={{ color: "#fff" }}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
            
            {!isMobile && (
              <>
                {!user && renderVisitorLinks()}
                {isUser(user) && renderUserLinks()}
                {isAdmin(user) && renderAdminLinks()}
                <Tooltip title={t("Toggle Language")}>
                  <IconButton onClick={toggleLanguage} style={{ color: "#fff" }}>
                    {i18n.language === "en" ? "IT" : "EN"}
                  </IconButton>
                </Tooltip>
              </>
            )}
            
            {isMobile && (
              <>
                {/* Mobile user menu */}
                {user && (
                  <IconButton onClick={handleMenuOpen} color="inherit">
                    <Avatar />
                  </IconButton>
                )}
                <Tooltip title={t("Toggle Language")}>
                  <IconButton onClick={toggleLanguage} style={{ color: "#fff" }}>
                    {i18n.language === "en" ? "IT" : "EN"}
                  </IconButton>
                </Tooltip>
              </>
            )}
          </ActionContainer>
        </StyledToolbar>
        <Breadcrumb />
      </StyledContainer>
      
      {/* Burger Menu */}
      {renderBurgerMenu()}
      
      {/* User Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleProfileClick}>{t("ViewProfile")}</MenuItem>
        <MenuItem onClick={handleLogoutClick}>{t("Logout")}</MenuItem>
      </Menu>
    </StyledAppBar>
  );
}

export default Navbar;
