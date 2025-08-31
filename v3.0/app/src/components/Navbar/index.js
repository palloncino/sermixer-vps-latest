import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Breadcrumb from "../../components/Breadcrumb";
import Loading from "../../components/Loading";
import { PALETTE } from "../../constants/index.ts";
import { ROUTES } from "../../constants/routes.ts";
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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
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

  const menuItems = [
    {
      category: t('Documents'),
      icon: '📄',
      color: '#2196f3',
      items: [
        { label: t('New Document'), description: t('Create quote or invoice'), route: ROUTES().createDocument },
        { label: t('Documents List'), description: t('View all documents'), route: ROUTES().documentsList }
      ]
    },
    {
      category: t('Clients'),
      icon: '👥',
      color: '#4caf50',
      items: [
        { label: t('Clients List'), description: t('View client database'), route: ROUTES().clientsList },
        { label: t('Create Client'), description: t('Add new client'), route: ROUTES().createClient }
      ]
    },
    {
      category: t('Products'),
      icon: '📦',
      color: '#ff9800',
      items: [
        { label: t('Products List'), description: t('View all products'), route: ROUTES().productList },
        ...(isAdmin(user) ? [{ label: t('Create Product'), description: t('Add new product'), route: ROUTES().createProduct }] : [])
      ]
    },
    {
      category: t('Users'),
      icon: '⚙️',
      color: '#9c27b0',
      items: [
        { label: t('Users List'), description: t('Manage user accounts'), route: ROUTES().usersList }
      ]
    },
    {
      category: t('File Management'),
      icon: '📁',
      color: '#607d8b',
      items: [
        { label: t('PDF Management'), description: t('Manage and organize PDF files'), route: ROUTES().pdfManagement }
      ]
    },
    {
      category: t('Analytics'),
      icon: '🧠',
      color: '#673ab7',
      items: [
        { label: t('AI Insights'), description: t('Business intelligence powered by DeepSeek'), route: ROUTES().dashboard }
      ]
    }
  ];

  const renderBurgerMenu = () => (
    <Menu
      anchorEl={burgerMenuEl}
      open={Boolean(burgerMenuEl)}
      onClose={handleBurgerMenuClose}
      PaperProps={{
        sx: {
          minWidth: 600,
          maxWidth: 800,
          mt: 1,
          p: 2,
        }
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
        🚀 Quick Navigation
      </Typography>
      
      <Grid container spacing={2}>
        {menuItems.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.category}>
            <Card 
              sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: section.color,
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ 
                    fontSize: '1.5rem', 
                    mr: 1.5,
                    background: `${section.color}15`,
                    borderRadius: '8px',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {section.icon}
                  </Box>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600} 
                    sx={{ color: section.color }}
                  >
                    {section.category}
                  </Typography>
                </Box>
                
                {section.items.map((item) => (
                  <Box
                    key={item.label}
                    onClick={() => handleQuickLinkClick(item.route)}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      mb: 0.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    <Typography variant="body2" fontWeight={500} sx={{ color: '#333' }}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Menu>
  );

  if (isLoadingAuthorization) return <Loading />;

  return (
    <StyledAppBar id="Navbar">
      <StyledContainer>
        <StyledToolbar>
          {/* Left Column - Logo */}
          <LogoButton to="/">
            <LogoImage src={Logo} alt="Logo" />
            <LogoText>
              <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>{t("LogoText")}</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.9 }}>{t("LogoTextSub")} v3.0</span>
            </LogoText>
          </LogoButton>

          {/* Center Column - Menu Button */}
          <Button
            onClick={handleBurgerMenuOpen}
            startIcon={<MenuIcon />}
            sx={{
              color: '#fff',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 2,
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            {t('Menu')}
          </Button>

          {/* Right Column - Profile and Language */}
          <ActionContainer style={{ justifyContent: 'flex-end' }}>
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
