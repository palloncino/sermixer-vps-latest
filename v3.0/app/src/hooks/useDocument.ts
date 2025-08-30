import _ from 'lodash';
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useFlashMessage } from 'state/FlashMessageContext';
import { ChangeLogItem, DocumentContextType, Revision, RevisionLabel } from '../types';
import { Actor, DocumentDataType } from "../types/index";
import { generateChangeLogs } from '../utils/changeLogGenerator';
import { request } from "../utils/request";

export const useDocument = (): DocumentContextType => {
  const { showMessage } = useFlashMessage();
  const { t } = useTranslation();
  const [originalDocumentData, setOriginalDocumentData] = useState<DocumentDataType | null>(null);
  const [updatedDocumentData, setUpdatedDocumentData] = useState<DocumentDataType | null>(null);
  const [allDocumentsData, setAllDocumentsData] = useState<DocumentDataType[] | null>(null);
  const [changeLogs, setChangeLogs] = useState<ChangeLogItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);

  const getAllDocuments = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/get-all-documents`,
      });
      setAllDocumentsData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const getDocument = useCallback(async (hash: string): Promise<DocumentDataType | null> => {
    setLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/get-document/${hash}`,
      });
      console.log('🔍 DEBUG: getDocument setting original data', {
        hash,
        dataKeys: data ? Object.keys(data) : 'no data',
        hasData: !!data.data,
        timestamp: new Date().toISOString()
      });
      
      setOriginalDocumentData(_.cloneDeep(data));
      setUpdatedDocumentData(_.cloneDeep(data));
      setError(null);
      setChangeLogs([]);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the document');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (data: DocumentDataType): Promise<{ success: boolean, document: DocumentDataType }> => {
    setLoading(true);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/create-document`,
        method: "POST",
        body: data,
      });
      setError(null);
      return response.document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clientViewedDocument = useCallback(async (hash: string) => {
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/client-viewed-document/${hash}`,
        method: "GET",
      });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteDocuments = useCallback(async (docIds: number | number[]): Promise<{ ids: number[] }> => {
    setLoading(true);
    try {
      const idsToDelete = Array.isArray(docIds) ? docIds : [docIds];
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/delete-documents`,
        method: "DELETE",
        body: { ids: idsToDelete },
      });
      setAllDocumentsData((prev) =>
        prev ? prev.filter((p) => !response.ids.includes(p.id)) : null
      );
      setError(null);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting documents');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDocument = useCallback(async (actor: Actor, revision: RevisionLabel) => {
    setLoading(true);
    try {
      const currentUpdatedDocumentData = updatedDocumentData;
      if (!currentUpdatedDocumentData) {
        throw new Error('No document data to save');
      }
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/save-document/${currentUpdatedDocumentData.hash}`,
        method: "POST",
        body: { ...currentUpdatedDocumentData, actor, revision },
      });
      if (response.success) {
        showMessage(t('QuoteSuccesfullySaved'), 'success')
        setError(null);
        getDocument(response.document.hash);
      } else {
        if (response.message) {
          showMessage(response.message, 'error')
        } else {
          showMessage('Error saving, try to refresh the page', 'error')
        }
      }
    } catch (error) {
      setError(error.message);
      showMessage(error.message, 'error')
    } finally {
      setLoading(false);
    }
  }, [updatedDocumentData]);

  const generatePDF = useCallback(async (type = 'default') => {
    setLoading(true);
    try {
      if (!updatedDocumentData?.hash) {
        throw new Error('Document hash is missing');
      }
      await request({
        url: `${process.env.REACT_APP_API_URL}/quotes/create-quote/${updatedDocumentData.hash}`,
        method: 'POST',
        body: { ...updatedDocumentData, type },
      });
      showMessage(t('QuoteSuccesfullyCreated'), 'success')
      // Update the document data after generating PDF
      await getDocument(updatedDocumentData.hash);
      return { success: true, error: null };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, error: 'Failed to generate PDF' };
    } finally {
      setLoading(false);
    }
  }, [updatedDocumentData, getDocument]);

  const rejectDocument = useCallback(async () => {
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/reject-document/${updatedDocumentData?.hash}`,
        method: 'GET',
      });
      getDocument(response.document.hash);
      showMessage(t('QuoteSuccesfullyRejected'), 'success')
      return response;
    } catch (error) {
      console.error('Error rejecting document:', error);
      throw error;
    }
  }, [updatedDocumentData]);

  const confirmDocument = useCallback(async () => {
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/docs/confirm-document/${updatedDocumentData?.hash}`,
        method: 'GET',
      });
      showMessage(t('QuoteSuccesfullyConfirmed'), 'success')
      await generatePDF('confirmation');
      // Update the document data after confirming
      await getDocument(updatedDocumentData?.hash);
      return { success: response.success, error: null };
    } catch (error) {
      console.error('Error confirming document:', error);
      return { success: false, error: 'Failed to confirm document' };
    }
  }, [updatedDocumentData, generatePDF, getDocument]);

  const updateQuoteDetails = useCallback((object: string, description: string) => {
    setUpdatedDocumentData(prevDoc => {
      if (!prevDoc) return null;
      const newDoc = _.cloneDeep(prevDoc);
      _.set(newDoc, 'data.quoteHeadDetails.object', object);
      _.set(newDoc, 'data.quoteHeadDetails.description', description);
      const newChangeLogs = generateChangeLogs(originalDocumentData as DocumentDataType, newDoc);
      setChangeLogs(newChangeLogs);
      return newDoc;
    });
  }, [originalDocumentData]);

  const updateDocumentField = useCallback((fieldName: string, value: any) => {
    setUpdatedDocumentData(prevDoc => {
      if (!prevDoc) return null;
      const newDoc = _.cloneDeep(prevDoc);
      _.set(newDoc, fieldName, value);
      const newChangeLogs = generateChangeLogs(originalDocumentData as DocumentDataType, newDoc);
      setChangeLogs(newChangeLogs);
      return newDoc;
    });
  }, [originalDocumentData]);

  const updateNestedDocumentField = useCallback((path: string[], value: any) => {

    
    setUpdatedDocumentData(prevDoc => {
      if (!prevDoc) {
        return null;
      }
      const newDoc = _.cloneDeep(prevDoc);
      _.set(newDoc, path, value);
      
      const newChangeLogs = generateChangeLogs(originalDocumentData as DocumentDataType, newDoc);
      
      setChangeLogs(newChangeLogs);
      return newDoc;
    });
  }, [originalDocumentData]);

  const updateDocumentDataFromRevision = (revision: Revision) => {
    setUpdatedDocumentData(prevData => ({
      ...(prevData as DocumentDataType), // Type assertion
      data: revision.snapshot
    }));
  };


  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => ({
    updateDocumentDataFromRevision,
    originalDocumentData,
    updatedDocumentData,
    setUpdatedDocumentData,
    allDocumentsData,
    getDocument,
    getAllDocuments,
    saveDocument,
    createDocument,
    deleteDocuments,
    clientViewedDocument,
    rejectDocument,
    updateNestedDocumentField,
    updateDocumentField,
    changeLogs,
    setChangeLogs,
    confirmDocument,
    generatePDF,
    updateQuoteDetails,
    error,
    loading
  }), [
    updateDocumentDataFromRevision,
    originalDocumentData,
    updatedDocumentData,
    setUpdatedDocumentData,
    allDocumentsData,
    getDocument,
    getAllDocuments,
    saveDocument,
    createDocument,
    deleteDocuments,
    clientViewedDocument,
    rejectDocument,
    updateNestedDocumentField,
    updateDocumentField,
    changeLogs,
    setChangeLogs,
    confirmDocument,
    generatePDF,
    updateQuoteDetails,
    error,
    loading
  ]);
};
