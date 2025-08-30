import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, lazy } from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ProtectedRouteP } from "types";
import './App.css';
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import DocumentNavbar from "./components/Navbar/document-navbar";
import { useAuth } from "./hooks/useAuth";
import { StyledLayout } from "./pages/documents/styled-components";
import { AppStateProvider } from "./state/stateContext";
import { ThemeProvider } from "./state/themeContext";
import { FlashMessageProvider } from './state/FlashMessageContext';
import FlashMessageTemp from './components/FlashMessageTemp';
import { DocumentProvider } from 'state/documentContext';

// Lazy load the components
const NotFoundPage = lazy(() => import("./pages/404/index"));
const Login = lazy(() => import("./pages/auth/login-page"));
const Signup = lazy(() => import("./pages/auth/signup-page"));
const ClientPage = lazy(() => import("./pages/clients/client-page"));
const ClientListPage = lazy(() => import("./pages/clients/clients-list-page"));
const CreateClientPage = lazy(() => import("./pages/clients/create-client-page"));
const Dashboard = lazy(() => import("./pages/homepage"));
const CreateProductPage = lazy(() => import("./pages/product/create-product-page"));
const EditProduct = lazy(() => import("./pages/product/edit-product-page"));
const ProductListPage = lazy(() => import("./pages/product/product-list-page"));
const ProductPage = lazy(() => import("./pages/product/product-page"));
const CreateDocumentTemplateObjectPage = lazy(() => import("./pages/documents/create-document-page"));
const EditUser = lazy(() => import("./pages/users/edit-user-page"));
const EditClient = lazy(() => import("./pages/clients/edit-client-page"));
const Profile = lazy(() => import("./pages/users/profile-page"));
const UserPage = lazy(() => import("./pages/users/user-page"));
const UsersListPage = lazy(() => import("./pages/users/users-list-page"));
const DocumentsListPage = lazy(() => import("./pages/documents/documents-list-page"));
const DocumentDetailsPage = lazy(() => import("./pages/documents/document-details-page"));
const SharedDocument = lazy(() => import("./pages/documents/shared-document"));

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
};

const AnimatedRoute = ({ element: Element, ...rest }) => {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', height: '100%', position: 'absolute' }}
    >
      <Element {...rest} />
    </motion.div>
  );
};

const ProtectedRoute = ({ allowedRoles, ...rest }: ProtectedRouteP) => {
  const { user, isLoadingAuthorization } = useAuth();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (isLoadingAuthorization) {
      return;
    }
    if (!user) {
      navigate("/login", { replace: true });
    } else if (!allowedRoles.includes(user?.role)) {
      navigate("/", { replace: true });
    }
  }, [user, navigate, allowedRoles, isLoadingAuthorization]);

  return user && allowedRoles.includes(user?.role) ? <Outlet /> : null;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const no_breadcrumbs = location.pathname.startsWith("/client-preventive/") || location.pathname === "/" ? "true" : "false";
  const fullWidth = location.pathname.startsWith("/client-preventive/") ? "true" : "false";

  return (
          <StyledLayout $no_breadcrumbs={no_breadcrumbs} $full_width={fullWidth}>
      <AnimatePresence mode="wait">
        {React.cloneElement(children, { key: location.pathname })}
      </AnimatePresence>
    </StyledLayout>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Routes accessible by visitors */}
        <Route path="/login" element={<AnimatedRoute element={Login} />} />
        <Route path="/signup" element={<AnimatedRoute element={Signup} />} />
        <Route path="/client-preventive/:hash" element={<AnimatedRoute element={SharedDocument} />} />

        {/* Routes accessible by both customers and admins */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
          <Route path="/" element={<AnimatedRoute element={Dashboard} />} />
          <Route path="/products-list" element={<AnimatedRoute element={ProductListPage} />} />
          <Route path="/product/:productId" element={<AnimatedRoute element={ProductPage} />} />
          <Route path="/users-list" element={<AnimatedRoute element={UsersListPage} />} />
          <Route path="/user/:userId" element={<AnimatedRoute element={UserPage} />} />
          <Route path="/profile" element={<AnimatedRoute element={Profile} />} />
          <Route path="/clients-list" element={<AnimatedRoute element={ClientListPage} />} />
          <Route path="/create-client" element={<AnimatedRoute element={CreateClientPage} />} />
          <Route path="/client/:clientId" element={<AnimatedRoute element={ClientPage} />} />
          <Route path="/documents-list" element={<AnimatedRoute element={DocumentsListPage} />} />
          <Route path="/documents/:hash" element={<AnimatedRoute element={DocumentDetailsPage} />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/create-product" element={<AnimatedRoute element={CreateProductPage} />} />
          <Route path="/create-document" element={<AnimatedRoute element={CreateDocumentTemplateObjectPage} />} />
          <Route path="/edit-product/:productId" element={<AnimatedRoute element={EditProduct} />} />
          <Route path="/edit-user/:userId" element={<AnimatedRoute element={EditUser} />} />
          <Route path="/edit-client/:clientId" element={<AnimatedRoute element={EditClient} />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<AnimatedRoute element={NotFoundPage} />} />
      </Routes>
    </AnimatePresence>
  );
};

const SharedDocumentLayout = () => (
  <Suspense fallback={<Loading />}>
    <DocumentNavbar />
    <SharedDocument />
  </Suspense>
);

function App() {
  return (
    <Router basename="/v3.0">
      <FlashMessageProvider>
        <AppStateProvider>
          <DocumentProvider>
            <FlashMessageTemp />
            <ThemeProvider>
              <Routes>
                <Route path="/client-preventive/:hash" element={<SharedDocumentLayout />} />
                <Route
                  path="*"
                  element={
                    <>
                      <Navbar />
                      <Layout>
                        <Suspense fallback={<Loading />}>
                          <AnimatedRoutes />
                        </Suspense>
                      </Layout>
                    </>
                  }
                />
              </Routes>
            </ThemeProvider>
          </DocumentProvider>
        </AppStateProvider>
      </FlashMessageProvider>
    </Router>
  );
}

export default App;
