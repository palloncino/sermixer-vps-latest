import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import React from "react";
import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const path = location.pathname;

  const generateBreadcrumb = (path) => {
    const breadcrumbMap = {
      "/": [],
      "/login": [],
      "/signup": [],
      "/products-list": [
        { label: "Home", href: "/" },
        { label: "Products List", href: "/products-list" },
      ],
      "/create-product": [
        { label: "Home", href: "/" },
        { label: "Products List", href: "/products-list" },
        { label: "Create Product", href: "/create-product" },
      ],
      "/create-client": [
        { label: "Home", href: "/" },
        { label: "Clients List", href: "/clients-list" },
        { label: "Create Client", href: "/create-client" },
      ],
      "/quotes-list": [
        { label: "Home", href: "/" },
        { label: "Quote List", href: "/quotes-list" },
      ],
      "/create-document": [
        { label: "Home", href: "/" },
        { label: "Documents List", href: "/documents-list" },
        { label: "Create Document", href: "/create-document" },
      ],
      "/users-list": [
        { label: "Home", href: "/" },
        { label: "Users List", href: "/users-list" },
      ],
      "/clients-list": [
        { label: "Home", href: "/" },
        { label: "Clients List", href: "/clients-list" },
      ],
      "/documents-list": [
        { label: "Home", href: "/" },
        { label: "Documents List", href: "/documents-list" },
      ],
      "/profile": [
        { label: "Home", href: "/" },
        { label: "My Profile", href: "/profile" },
      ],
    };

    // Handle dynamic paths with parameters like `:id`
    if (path.startsWith("/product/")) {
      const productId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Products List", href: "/products-list" },
        { label: `Product ${productId}`, href: `/product/${productId}` },
      ];
    }

    // Handle dynamic paths with parameters like `:id`
    if (path.startsWith("/documents/")) {
      const docId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Document List", href: "/documents-list" },
        { label: `Document Hash ${docId}`, href: `/product/${docId}` },
      ];
    }

    // Handle dynamic paths with parameters like `:id`
    if (path.startsWith("/quote/")) {
      const quoteId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Quote List", href: "/quotes-list" },
        { label: `Quote ${quoteId}`, href: `/quote/${quoteId}` },
      ];
    }

    // Handle dynamic paths for user pages
    if (path.startsWith("/user/")) {
      const userId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Users List", href: "/users-list" },
        { label: `User ${userId}`, href: `/user/${userId}` },
      ];
    }

    // Handle dynamic paths for user pages
    if (path.startsWith("/client/")) {
      const userId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Clients List", href: "/clients-list" },
        { label: `Client ${userId}`, href: `/client/${userId}` },
      ];
    }

    // Handle edit-product/:productId route
    if (path.startsWith("/edit-product/")) {
      const productId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Products List", href: "/products-list" },
        { label: `Product ${productId}`, href: `/product/${productId}` },
        { label: `Edit Product ${productId}`, href: path },
      ];
    }

    // Handle edit-user/:userId route
    if (path.startsWith("/edit-user/")) {
      const userId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "User List", href: "/users-list" },
        { label: `User ${userId}`, href: `/user/${userId}` },
        { label: `Edit Product ${userId}`, href: path },
      ];
    }

    // Handle edit-user/:userId route
    if (path.startsWith("/edit-client/")) {
      const clientId = path.split("/").pop();
      breadcrumbMap[path] = [
        { label: "Home", href: "/" },
        { label: "Clients List", href: "/clients-list" },
        { label: `Client ${clientId}`, href: `/client/${clientId}` },
        { label: `Edit Client ${clientId}`, href: path },
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
