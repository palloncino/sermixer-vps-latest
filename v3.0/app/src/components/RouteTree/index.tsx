import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAppState } from '../../state/stateContext';
import { isAdmin, isUser } from "../../utils/isWho";

const List = styled.ul`
  list-style-type: none;
  padding-left: 20px;
  line-height: 24px;
  font-family: 'Bitstream Vera Sans Mono';
  position: relative;
  &:before {
    content: "";
    border-left: 1px solid #333;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  }
`;

const ListItem = styled.li`
  position: relative;
  padding-left: 50px;
  &:before {
    content: "├──";
    position: absolute;
    left: 0;
  }
  &:last-child:before {
    content: "└──";
  }
  &:hover {
    background: #F4F4F4;
  }
`;

const RouteLink = styled(Link) <{ disabled?: boolean }>`
  text-decoration: none;
  color: inherit;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const routes = {
    Visitors: [
        { path: "/login", name: "Login" },
        { path: "/signup", name: "Signup" },
    ],
    Users: [
        { path: "/profile", name: "Profile" },
        { path: "/products-list", name: "Products List" },
        { path: "/users-list", name: "Users List" },
        { path: "/clients-list", name: "Clients List" },
        { path: "/quotes-list", name: "Quotes List" },
        { path: "/documents-list", name: "Documents List" },
        { path: "/create-client", name: "Create Client" },
    ],
    Admins: [
        { path: "/create-product", name: "Create Product" },
        { path: "/create-document", name: "Create Document Template" },
    ]
};

const RouteTree = () => {
    const { user } = useAppState(); // Get the user state
    const { t } = useTranslation();

    const isVisitor = !isAdmin(user) && !isUser(user);

    const getCategoryStyle = (category) => {
        if (category === "Admins" && isAdmin(user)) {
            return { background: 'F4F4F4' };
        }
        if (category === "Users" && isUser(user)) {
            return {  background: 'F4F4F4' };
        }
        return { background: 'transparent' };
    };

    const renderRoutes = (routes) => {
        return Object.entries(routes).map(([category, routes]) => {
            const isDisabled =
                (category === "Admins" && !isAdmin(user)) ||
                (category === "Users" && !isUser(user) && !isAdmin(user)) ||
                (category === "Visitors" && !isVisitor);

            return (
                <Box key={category} style={{ opacity: isDisabled ? 0.5 : 1 }}>
                    <Typography style={getCategoryStyle(category)}>{category}:</Typography>
                    <List>
                        {Array.isArray(routes) ? (
                            routes.map((route, index) => (
                                <ListItem key={index}>
                                    {route.href ? (
                                        <RouteLink to="#" disabled={isDisabled}>{route.name}</RouteLink>
                                    ) : (
                                        <RouteLink to={route.path} disabled={isDisabled}>{route.name}</RouteLink>
                                    )}
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <RouteLink to={routes.path} disabled={isDisabled}>{routes.name}</RouteLink>
                            </ListItem>
                        )}
                    </List>
                </Box>
            );
        });
    };

    return (
        <Box p={4} border={'1px solid F4F4F4'} borderRadius={'4px'}>
            <Box mb={2}>
                <Typography variant="p">{t('AppTreeTitle')}</Typography>
            </Box>
            {renderRoutes(routes)}
        </Box>
    );
};

export default RouteTree;
