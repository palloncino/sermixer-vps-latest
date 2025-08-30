import { useState, useCallback } from "react";
import { request } from "../utils/request";

export const useEmail = () => {
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const sendCreatedDocumentEmail = useCallback(async (payload: object) => {
    setIsEmailLoading(true);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/email/created-document`,
        method: "POST",
        body: payload,
      });
      return response;
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      setEmailError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsEmailLoading(false);
    }
  }, []);

  const sendClosedDocumentEmail = useCallback(async (payload: object) => {
    setIsEmailLoading(true);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/email/closed-document`,
        method: "POST",
        body: payload,
      });
      return response;
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      setEmailError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsEmailLoading(false);
    }
  }, []);

  return { isEmailLoading, emailError, sendCreatedDocumentEmail, sendClosedDocumentEmail };
};
