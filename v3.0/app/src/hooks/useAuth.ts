import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserType } from "../types";
import { request } from "utils/request";

export type AuthStateType = {
  verifyToken: () => Promise<{success: boolean; user: UserType}>;
  user: UserType | null;
  token: string | null;
  isLoadingAuthorization: boolean;
  logout: () => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  loginIsLoading: boolean;
  loginError: string | null;
  signup: (userData: UserType) => Promise<void>;
  signupIsLoading: boolean;
  signupError: string | null;
  signupSuccessMessage: string | null;
};

export const useAuth = (): AuthStateType => {
  const [isLoadingAuthorization, setIsLoadingAuthorization] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [token, setToken] = useState(localStorage.getItem("authToken"));
  const [loginIsLoading, setLoginIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [signupIsLoading, setSignupIsLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [signupSuccessMessage, setSignupSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      try {
        const response = await request({
          url: `${process.env.REACT_APP_API_URL}/auth/verify-token`,
          method: "POST",
          body: { token: storedToken },
        });
        setUser(response.user);
        setIsLoadingAuthorization(false); // Set loading to false after verification
      } catch (error) {
        console.error("Token validation failed", error);
        setUser(null);
        localStorage.removeItem("authToken");
        setIsLoadingAuthorization(false);
      }
    } else {
      setIsLoadingAuthorization(false); // No token found, not loading
    }
  };

  const login = useCallback(
    async (credentials) => {
      setLoginIsLoading(true);
      setLoginError(null);
      try {
        const response = await request({
          url: `${process.env.REACT_APP_API_URL}/auth/login`,
          method: "POST",
          body: credentials,
        });
        // const data  = response.json();
        const { token, user } = response;
        setUser(user);
        localStorage.setItem("authToken", token);
        setToken(token);
        navigate("/");
      } catch (err) {
        setLoginError(err.message);
        setUser(null);
      } finally {
        setLoginIsLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
    navigate("/login");
  }, [navigate]);

  const signup = useCallback(async (userData) => {
    setSignupIsLoading(true);
    setSignupError(null);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/auth/signup`,
        method: "POST",
        body: userData,
      });
      const data = response;
      if (data.user) {
        setUser(data);
      }
      if (data.message) {
        setSignupSuccessMessage(
          data.message + ". Please, login with your new credentials."
        );
      }
    } catch (err) {
      setSignupError(err.message);
      setUser(null);
    } finally {
      setSignupIsLoading(false);
    }
  }, []);

  return {
    verifyToken,
    user,
    token,
    isLoadingAuthorization,
    logout,
    login,
    loginIsLoading,
    loginError,
    signup,
    signupIsLoading,
    signupError,
    signupSuccessMessage,
  };
};
