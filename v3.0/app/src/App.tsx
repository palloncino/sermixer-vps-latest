import { AnimatePresence, motion } from 'framer-motion';
import React, { Suspense, lazy } from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
  Navigate,
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
const PdfManagementPage = lazy(() => import("./pages/pdfs/pdf-management-page"));

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

const AnimatedRoute = ({ element: Element, ...rest }: { element: any; [key: string]: any }) => {
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

// Component to handle trailing slash normalization
const TrailingSlashRedirect = () => {
  const location = useLocation();
  
  // If URL has trailing slash (except for root), redirect without it
  if (location.pathname !== '/' && location.pathname.endsWith('/')) {
    const newPath = location.pathname.slice(0, -1);
    return <Navigate to={`${newPath}${location.search}${location.hash}`} replace />;
  }
  
  return null;
};

// Error Boundary for navigation issues
interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class NavigationErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Navigation error caught by boundary:', error, errorInfo);
    
    // If it's a router-related error, try to redirect to home
    if (error.message.includes('router') || error.message.includes('navigate')) {
      setTimeout(() => {
        window.location.href = `${window.location.origin}/`;
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          minHeight: '50vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2>Navigation Error</h2>
          <p>Something went wrong with navigation. Redirecting to home...</p>
          <button 
            onClick={() => window.location.href = `${window.location.origin}/`}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const no_breadcrumbs = location.pathname.startsWith("/client-preventive/") || location.pathname === "/" ? "true" : "false";
  const fullWidth = location.pathname.startsWith("/client-preventive/") ? "true" : "false";

  return (
          <StyledLayout $no_breadcrumbs={no_breadcrumbs} $full_width={fullWidth}>
      <AnimatePresence mode="wait">
        {React.isValidElement(children) ? 
          React.cloneElement(children, { key: location.pathname }) : 
          children
        }
      </AnimatePresence>
    </StyledLayout>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <TrailingSlashRedirect />
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
          <Route path="/pdf-management" element={<AnimatedRoute element={PdfManagementPage} />} />
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
    <NavigationErrorBoundary>
      <Router basename="/">
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
    </NavigationErrorBoundary>
  );
}

export default App;
