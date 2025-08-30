// hooks/useQuotes.js
import { useState, useCallback } from "react";
import { request } from "../utils/request";
import { QuoteType } from "types/index.js";

export type QuotesStateType = {
  quotes: QuoteType[];
  getQuotes: () => Promise<void>;
  getQuotesIsLoading: boolean;
  getQuotesError: string | null;
  createQuote: (quoteData: QuoteType) => Promise<void>;
  createQuoteIsLoading: boolean;
  createQuoteError: string | null;
  deleteQuotes: (quoteIds: string[]) => Promise<void>;
  deleteQuoteIsLoading: boolean;
  deleteQuoteError: string | null;
};

export const useQuotes = (): QuotesStateType => {
  const [quotes, setQuotes] = useState([]);

  // getQuotes
  const [getQuotesIsLoading, setGetQuotesIsLoading] = useState(false);
  const [getQuotesError, setGetQuotesError] = useState(null);

  // createQuote
  const [createQuoteIsLoading, setCreateQuoteIsLoading] = useState(false);
  const [createQuoteError, setCreateQuoteError] = useState(null);

  // deleteQuote
  const [deleteQuoteIsLoading, setDeleteQuoteIsLoading] = useState(false);
  const [deleteQuoteError, setDeleteQuoteError] = useState(null);

  const getQuotes = useCallback(async () => {
    setGetQuotesIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/quotes/get-quotes`,
      });
      setQuotes(data);
      setGetQuotesError(null);
    } catch (err) {
      setGetQuotesError(err);
    } finally {
      setGetQuotesIsLoading(false);
    }
  }, []);

  const createQuote = async (payload) => {
    setCreateQuoteIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/quotes/create-quote`,
        method: "POST",
        body: payload,
      });
      // Optionally refresh the quotes list or add directly to state
      setQuotes((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setCreateQuoteError(err);
    } finally {
      setCreateQuoteIsLoading(false);
    }
  };

  const deleteQuotes = async (quoteIds = []) => {
    setDeleteQuoteIsLoading(true);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/quotes/delete-quotes`,
        method: "DELETE",
        body: { ids: quoteIds },
      });
      const deletedIds = response.ids;
      setQuotes((prev) => prev.filter((p) => !deletedIds.includes(p.id)));
      return response;
    } catch (err) {
      setDeleteQuoteError(err);
    } finally {
      setDeleteQuoteIsLoading(false);
    }
  };

  return {
    quotes,
    // getQuotes
    getQuotes,
    getQuotesIsLoading,
    getQuotesError,
    // addQuote
    createQuote,
    createQuoteIsLoading,
    createQuoteError,
    // deleteQuotes
    deleteQuotes,
    deleteQuoteIsLoading,
    deleteQuoteError,
  };
};
