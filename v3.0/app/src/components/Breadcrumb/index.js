import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Breadcrumb = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const path = location.pathname;

  const generateBreadcrumb = (path) => {
    const breadcrumbMap = {
      "/": [],
      "/login": [],
      "/signup": [],
      "/products-list": [
        { label: t("Home"), href: "/" },
        { label: t("Products List"), href: "/products-list" },
      ],
      "/create-product": [
        { label: t("Home"), href: "/" },
        { label: t("Products List"), href: "/products-list" },
        { label: t("Create Product"), href: "/create-product" },
      ],
      "/create-client": [
        { label: t("Home"), href: "/" },
        { label: t("Clients List"), href: "/clients-list" },
        { label: t("Create Client"), href: "/create-client" },
      ],
      "/quotes-list": [
        { label: t("Home"), href: "/" },
        { label: t("Quote List"), href: "/quotes-list" },
      ],
      "/create-document": [
        { label: t("Home"), href: "/" },
        { label: t("Documents List"), href: "/documents-list" },
        { label: t("Create Document"), href: "/create-document" },
      ],
      "/users-list": [
        { label: t("Home"), href: "/" },
        { label: t("Users List"), href: "/users-list" },
      ],
      "/clients-list": [
        { label: t("Home"), href: "/" },
        { label: t("Clients List"), href: "/clients-list" },
      ],
      "/documents-list": [
        { label: t("Home"), href: "/" },
        { label: t("Documents List"), href: "/documents-list" },
      ],
      "/profile": [
        { label: t("Home"), href: "/" },
        { label: t("My Profile"), href: "/profile" },
      ],
      "/pdf-management": [
        { label: t("Home"), href: "/" },
        { label: t("PDF Management"), href: "/pdf-management" },
      ],
    };

    // Handle dynamic paths with parameters like `:id`
    if (path.startsWith("/product/")) {
      const productId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Products List"), href: "/products-list" },
        { label: `${t("Product")} ${productId}`, href: `/product/${productId}` },
      ];
    }

    // Handle dynamic paths with parameters like `:id`
    if (path.startsWith("/documents/")) {
      const docId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Documents List"), href: "/documents-list" },
        { label: `${t("Document")} ${docId}`, href: `/documents/${docId}` },
      ];
    }

    // Handle dynamic paths with parameters like `:id`
    if (path.startsWith("/quote/")) {
      const quoteId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Quote List"), href: "/quotes-list" },
        { label: `${t("Quote")} ${quoteId}`, href: `/quote/${quoteId}` },
      ];
    }

    // Handle dynamic paths for user pages
    if (path.startsWith("/user/")) {
      const userId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Users List"), href: "/users-list" },
        { label: `${t("User")} ${userId}`, href: `/user/${userId}` },
      ];
    }

    // Handle dynamic paths for user pages
    if (path.startsWith("/client/")) {
      const userId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Clients List"), href: "/clients-list" },
        { label: `${t("Client")} ${userId}`, href: `/client/${userId}` },
      ];
    }

    // Handle edit-product/:productId route
    if (path.startsWith("/edit-product/")) {
      const productId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Products List"), href: "/products-list" },
        { label: `${t("Product")} ${productId}`, href: `/product/${productId}` },
        { label: `${t("Edit Product")} ${productId}`, href: path },
      ];
    }

    // Handle edit-user/:userId route
    if (path.startsWith("/edit-user/")) {
      const userId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Users List"), href: "/users-list" },
        { label: `${t("User")} ${userId}`, href: `/user/${userId}` },
        { label: `${t("Edit User")} ${userId}`, href: path },
      ];
    }

    // Handle edit-client/:clientId route
    if (path.startsWith("/edit-client/")) {
      const clientId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: t("Home"), href: "/" },
        { label: t("Clients List"), href: "/clients-list" },
        { label: `${t("Client")} ${clientId}`, href: `/client/${clientId}` },
        { label: `${t("Edit Client")} ${clientId}`, href: path },
      ];
    }

    return breadcrumbMap[path] || [];
  };

  const breadcrumbItems = generateBreadcrumb(path);
  const lastIndex = breadcrumbItems.length - 1;

  return (
    <Container>
      <Box mt={breadcrumbItems.length === 0 ? 0 : 1}>
        <Breadcrumbs
          separator={<NavigateNextIcon style={{color: 'white'}} fontSize="small" />}
          aria-label="breadcrumb"
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === lastIndex;
            return isLast ? (
              <Typography color="white" key={index}>
                {item.label}
              </Typography>
            ) : (
              <Link
                key={index}
                color="#fff"
                href={item.href}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </Container>
  );
};

export default Breadcrumb;
