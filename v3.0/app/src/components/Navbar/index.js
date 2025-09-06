import {
  Build,
  Description,
  Folder,
  GridView,
  Inventory,
  People,
  Psychology
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
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
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%);
  color: #fff;
  width: 100%;
  height: 210px;
  top: 0;
  z-index: 1100;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
  position: relative;
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
  padding: 16px 24px;
  height: 100%;
  position: relative;
  z-index: 2;
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
    try {
      const profileRoute = ROUTES().profile;
      const normalizedRoute = profileRoute === '/' ? profileRoute : profileRoute.replace(/\/$/, '');
      navigate(normalizedRoute);
      handleMenuClose();
    } catch (error) {
      console.error('Profile navigation error:', error);
      // Fallback to window.location
      window.location.href = `${window.location.origin}/profile`;
    }
  };

  const handleLogoutClick = () => {
    logout();
    handleMenuClose();
  };

  const handleQuickLinkClick = (route) => {
    try {
      // Ensure route doesn't have trailing slash (except root)
      const normalizedRoute = route === '/' ? route : route.replace(/\/$/, '');
      navigate(normalizedRoute);
      handleBurgerMenuClose();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location for problematic routes
      window.location.href = `${window.location.origin}${route}`;
    }
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
      icon: Description,
      items: [
        { label: t('New Document'), description: t('Create quote or invoice'), route: ROUTES().createDocument },
        { label: t('Documents List'), description: t('View all documents'), route: ROUTES().documentsList }
      ]
    },
    {
      category: t('Clients'),
      icon: People,
      items: [
        { label: t('Clients List'), description: t('View client database'), route: ROUTES().clientsList },
        { label: t('Create Client'), description: t('Add new client'), route: ROUTES().createClient }
      ]
    },
    {
      category: t('Products'),
      icon: Inventory,
      items: [
        { label: t('Products List'), description: t('View all products'), route: ROUTES().productList },
        ...(isAdmin(user) ? [{ label: t('Create Product'), description: t('Add new product'), route: ROUTES().createProduct }] : [])
      ]
    },
    {
      category: t('Users'),
      icon: People,
      items: [
        { label: t('Users List'), description: t('Manage user accounts'), route: ROUTES().usersList }
      ]
    },
    {
      category: t('File Management'),
      icon: Folder,
      items: [
        { label: t('PDF Management'), description: t('Manage and organize PDF files'), route: ROUTES().pdfManagement }
      ]
    },
    {
      category: t('Analytics'),
      icon: Psychology,
      items: [
        { label: t('AI Insights'), description: t('Powered by DeepSeek'), route: ROUTES().dashboard }
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
          p: 3,
          backgroundColor: '#ffffff',
          border: '2px solid #000000',
          borderRadius: 1,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 4, 
          fontWeight: 900, 
          color: '#000000',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          textAlign: 'center'
        }}
      >
        Quick Navigation
      </Typography>
      
      <Grid container spacing={1}>
        {menuItems.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.category}>
            <Card 
              elevation={0}
              sx={{ 
                border: '2px solid #000000',
                borderRadius: 1,
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#000000',
                  backgroundColor: '#f8f9fa',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    backgroundColor: '#000000',
                    borderRadius: 1
                  }}>
                    <section.icon sx={{ fontSize: 18, color: '#ffffff' }} />
                  </Box>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={800} 
                    sx={{ 
                      color: '#000000',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.9rem'
                    }}
                  >
                    {section.category}
                  </Typography>
                </Box>
                
                {section.items.map((item) => (
                  <Box
                    key={item.label}
                    onClick={() => handleQuickLinkClick(item.route)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      cursor: 'pointer',
                      mb: 1,
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#000000',
                        borderColor: '#000000',
                        '& .link-text': {
                          color: '#ffffff'
                        },
                        '& .link-desc': {
                          color: '#e5e7eb'
                        }
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={700} 
                      className="link-text"
                      sx={{ 
                        color: '#000000',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em',
                        fontSize: '0.8rem'
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className="link-desc"
                      sx={{ 
                        color: '#6b7280',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}
                    >
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
              <span style={{ 
                fontSize: "1.3rem", 
                fontWeight: 900, 
                letterSpacing: '-0.02em',
                textTransform: 'uppercase'
              }}>{t("LogoText")}</span>
              <span style={{ 
                fontSize: "0.85rem", 
                opacity: 0.8,
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}>{t("LogoTextSub")} v3.0</span>
            </LogoText>
          </LogoButton>

          {/* Center Column - Menu Button */}
          <Button
            onClick={handleBurgerMenuOpen}
            startIcon={<GridView sx={{ fontSize: 20 }} />}
            sx={{
              color: '#fff',
              fontWeight: 800,
              textTransform: 'uppercase',
              borderRadius: 1,
              px: 3,
              py: 1.5,
              background: 'rgba(0, 0, 0, 0.3)',
              border: '2px solid #ffffff',
              fontSize: '0.9rem',
              letterSpacing: '0.1em',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#000000',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.3)',
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
                  <IconButton 
                    onClick={toggleLanguage} 
                    sx={{
                      color: "#fff",
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '2px solid #ffffff',
                      borderRadius: 1,
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      minWidth: '40px',
                      height: '40px',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                      }
                    }}
                  >
                    {i18n.language === "en" ? "IT" : "EN"}
                  </IconButton>
                </Tooltip>
              </>
            )}
            
            {isMobile && (
              <>
                {/* Mobile user menu */}
                {user && (
                  <IconButton 
                    onClick={handleMenuOpen} 
                    sx={{
                      color: "#fff",
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '2px solid #ffffff',
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                      }
                    }}
                  >
                    <Avatar />
                  </IconButton>
                )}
                <Tooltip title={t("Toggle Language")}>
                  <IconButton 
                    onClick={toggleLanguage} 
                    sx={{
                      color: "#fff",
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      border: '2px solid #ffffff',
                      borderRadius: 1,
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      minWidth: '40px',
                      height: '40px',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                        color: '#000000',
                      }
                    }}
                  >
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
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            border: '2px solid #000000',
            borderRadius: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            minWidth: 200,
          }
        }}
      >
        <MenuItem 
          onClick={handleProfileClick}
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.9rem',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            }
          }}
        >
          {t("ViewProfile")}
        </MenuItem>
        <MenuItem 
          onClick={handleLogoutClick}
          sx={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '0.9rem',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#000000',
              color: '#ffffff',
            }
          }}
        >
          {t("Logout")}
        </MenuItem>
      </Menu>
    </StyledAppBar>
  );
}

export default Navbar;
