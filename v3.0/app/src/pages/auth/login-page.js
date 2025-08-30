import { Box, Button, Container, Grid, Link, TextField, Alert, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import FlashMessage from "../../components/FlashMessage";
import PageHeader from "../../components/PageHeader/index.tsx";
import { useAppState } from "../../state/stateContext";
import { WhitePaperContainer } from "../documents/styled-components/index.ts";

function LoginPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [localError, setLocalError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loginIsLoading, loginError } = useAppState();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear local errors when user starts typing
    if (localError) {
      setLocalError(null);
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setLocalError("Please enter a valid email address");
      return false;
    }
    
    if (!formData.password) {
      setLocalError("Password is required");
      return false;
    }
    
    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setLocalError(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login({ email: formData.email, password: formData.password });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      if (error.name === 'RequestError') {
        setLocalError(error.message);
      } else if (error.message) {
        setLocalError(error.message);
      } else {
        setLocalError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loginIsLoading || isSubmitting;
  const hasError = localError || loginError;

  return (
    <WhitePaperContainer>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "60vh",
            justifyContent: "center",
          }}
        >
          <PageHeader title={t("Login")} margin={"0"} />
          
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ 
              mt: 3,
              width: "100%",
              maxWidth: "400px"
            }}
          >
            {/* Error Display */}
            {hasError && (
              <Alert 
                severity="error" 
                sx={{ mb: 2, width: "100%" }}
                onClose={() => {
                  setLocalError(null);
                  // Note: loginError is managed by the context
                }}
              >
                <Typography variant="body2">
                  {localError || loginError}
                </Typography>
              </Alert>
            )}

            {/* Success Message */}
            {!hasError && (
              <Alert severity="info" sx={{ mb: 2, width: "100%" }}>
                <Typography variant="body2">
                  Please enter your credentials to access your account.
                </Typography>
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              error={!!localError && !formData.email.trim()}
              helperText={!formData.email.trim() && localError ? "Email is required" : ""}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              error={!!localError && !formData.password}
              helperText={!formData.password && localError ? "Password is required" : ""}
              sx={{ mb: 3 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ 
                mt: 1, 
                mb: 2,
                height: "48px",
                fontSize: "1rem",
                fontWeight: 600
              }}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Signing in...</span>
                </Box>
              ) : (
                t("Login")
              )}
            </Button>
            
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Link href="/signup" variant="body2" sx={{ textDecoration: 'none' }}>
                  {t("ChangeToSignup")}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </WhitePaperContainer>
  );
}

export default LoginPage;
