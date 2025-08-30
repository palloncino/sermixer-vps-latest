import {
  Box,
  Button,
  IconButton,
  CardActions,
  CardMedia,
  Container,
  Divider,
  Grid,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import gfm from "remark-gfm";
import { useFlashMessage } from "state/FlashMessageContext";
import Loading from "../../components/Loading";
import { ROUTES, SectionBorderContainer } from "../../constants/index";
import fallbackProduct from "../../media/fallbackProduct.png";
import { useAppState } from "../../state/stateContext";
import { formatPrice } from "../../utils/format-price";
import { isAdmin } from "../../utils/isWho";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { WhitePaperContainer } from "../documents/styled-components/index";

const ProductPage: React.FC = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const { user, getProductById, loading, error } = useAppState();
  const [theProduct, setTheProduct] = useState<any>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const { showMessage } = useFlashMessage();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('created') === 'true') {
      showMessage(t('ProductCreatedSuccessfully'), 'success');
    }
  }, [location]);

  useEffect(() => {
    if (productId) {
      getTheProduct(productId);
    }
  }, [productId]);

  const getTheProduct = async (_id: string) => {
    const response = await getProductById(parseInt(_id, 10));
    if (response.product) {
      setTheProduct(response.product);
    } else {
      showMessage(t('FailedRetrieveProduct'), 'error');
    }
  }

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(ROUTES().productsList); // Default route if no history is available
    }
  };

  if (loading || theProduct === undefined) {
    return <Loading />;
  }

  if (theProduct === null) {
    return (
      <ProductContainer>
        <Typography variant="h4" gutterBottom>
          {t("404ProductNotFound")}
        </Typography>
        <Typography variant="subtitle1">
          {t("404ProductNotFoundErrorMessage")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={ROUTES().productsList}
        >
          {t("BackToProductsList")}
        </Button>
      </ProductContainer>
    );
  }

  const renderComponentDetails = (components) => {
    if (!components || components.length === 0) {
      return (
        <Typography variant="body2">
          {t("NoComponentsAvailable")}
        </Typography>
      );
    }

    return (
      <Box>
        {components.map((component, componentIndex) => (
          <Accordion
            key={componentIndex}
            sx={{ mb: 1, backgroundColor: "#fff", boxShadow: "none", border: "1px solid #f0f0f0", borderRadius: "4px" }}
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
            TransitionDuration={150} // Faster expansion
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Tooltip
                title={
                  <img
                    src={component.imgUrl || fallbackProduct}
                    alt={component.name}
                    style={{
                      width: '200px', // Larger preview on hover
                      height: 'auto',
                      objectFit: 'contain',
                      borderRadius: '4px',
                    }}
                  />
                }
                placement="top"
                componentsProps={{
                  tooltip: {
                    sx: {
                      maxWidth: 'none',
                    },
                  },
                }}
              >
                <img
                  src={component.imgUrl || fallbackProduct}
                  alt={component.name}
                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: '4px' }}
                />
              </Tooltip>
              <Typography sx={{ ml: 2, fontWeight: "bold" }}>{component.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {t("Price")}: {t("EUR")} {formatPrice(component.price)}
              </Typography>
              <Typography variant="body2">{component.description}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  const components = Array.isArray(theProduct.components) ? theProduct.components : [];

  return (
    <WhitePaperContainer>
      <Container maxWidth={'lg'}>
        <SectionBorderContainer>
          <Grid container spacing={4}>
            {/* Sticky Column */}
            <Grid item xs={12} md={6}>
              <MediaWrapper>
                <ProductMedia
                  image={theProduct.imgUrl || fallbackProduct}
                  title={theProduct.name}
                />
                <PreviewGallery>
                  <img src={theProduct.imgUrl || fallbackProduct} alt="Preview" style={{ height: '80px', marginRight: '0.5rem' }} />
                </PreviewGallery>
              </MediaWrapper>
            </Grid>

            {/* Compact Right Side */}
            <Grid item xs={12} md={6}>
              <CardActions sx={{ justifyContent: 'space-between', mb: 2 }}>
                {/* Back Button with Icon */}
                <IconButton
                  color="primary"
                  onClick={handleCancel}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <ArrowBackIcon />
                  <Typography sx={{ ml: 1 }}>{t("Back")}</Typography>
                </IconButton>

                <Button
                  disabled={!isAdmin(user)}
                  variant="contained"
                  component={Link}
                  to={ROUTES(productId).editProduct}
                >
                  {t("EditProduct")}
                </Button>
              </CardActions>
              <ProductPaper>
                <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {theProduct.name} <Typography variant="body2" component="span">({t("ID")}: {theProduct._id})</Typography>
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {t("Price")}: {t("EUR")} {formatPrice(theProduct.price)}
                </Typography>
                <ReactMarkdown remarkPlugins={[gfm]}>
                  {theProduct.description.replace(/\\n/g, '\n')}
                </ReactMarkdown>

                {/* Inline Category and Company */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    {t("Category")}: {theProduct.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t("Company")}: {theProduct.company === 'sermixer' ? t('Sermixer') : t('S2Truckervice')}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }}>{t('Components')}</Divider>
                {renderComponentDetails(components)}
              </ProductPaper>
            </Grid>
          </Grid>
        </SectionBorderContainer>
      </Container>
    </WhitePaperContainer>
  );
};

export default ProductPage;

const ProductContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const ProductPaper = styled("div")(() => ({
  padding: '0.8rem',
  display: "flex",
  flexDirection: "column",
  gap: '0.8rem',
  background: '#fff',
  border: '1px solid #F4F4F4',
  borderRadius: '8px',
  // Removed the box-shadow to make it cleaner and more minimal
}));

const MediaWrapper = styled("div")(({ theme }) => ({
  position: "sticky",
  top: 20,
  borderRadius: '.2rem',
  minHeight: "calc(50vh)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #F4F4F4",
  padding: "1rem",
  "&:hover": {
    opacity: 0.9,
  },
}));

const ProductMedia = styled(CardMedia)(({ theme }) => ({
  flexGrow: 1,
  width: "100%",
  objectFit: "cover",
  height: 0,
  paddingTop: "100%",
  backgroundSize: "contain",
}));

const PreviewGallery = styled(Box)`
  display: flex;
  margin-top: 1rem;
  overflow-x: auto;
`;
