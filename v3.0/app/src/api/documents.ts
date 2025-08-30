import { request } from '../utils/request';
import { DocumentDataType } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

export const getAllDocuments = async () => {
  return request({
    url: `${API_URL}/docs/get-all-documents`,
  });
};

export const getDocument = async (hash: string) => {
  return request({
    url: `${API_URL}/docs/get-document/${hash}`,
  });
};

export const createDocument = async (data: Partial<DocumentDataType>) => {
  return request({
    url: `${API_URL}/docs/create-document`,
    method: 'POST',
    body: data,
  });
};

export const saveDocument = async (hash: string, updatedDocumentData: Partial<DocumentDataType>, actor: any) => {
  return request({
    url: `${API_URL}/docs/save-document/${hash}`,
    method: 'POST',
    body: { ...updatedDocumentData, actor },
  });
};

export const clientViewedDocument = async (hash: string) => {
  return request({
    url: `${API_URL}/docs/client-viewed-document/${hash}`,
    method: 'GET',
  });
};

export const rejectDocument = async (hash: string) => {
  return request({
    url: `${API_URL}/docs/reject-document/${hash}`,
    method: 'GET',
  });
};

export const deleteDocuments = async (docIds: number[]) => {
  return request({
    url: `${API_URL}/docs/delete-documents`,
    method: 'DELETE',
    body: { ids: docIds },
  });
};

export const confirmDocument = async (hash: string, updatedDocumentData: Partial<DocumentDataType>) => {
  return request({
    url: `${API_URL}/docs/confirm-document/${hash}`,
    method: 'POST',
    body: updatedDocumentData,
  });
};

export const createQuote = async (hash: string, documentData: DocumentDataType) => {
  return request({
    url: `${API_URL}/quotes/create-quote/${hash}`,
    method: 'POST',
    body: { ...documentData, type: 'confirmation' },
  });
};

// Example of a function that might upload a file
export const uploadDocumentFile = async (hash: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    url: `${API_URL}/docs/upload-file/${hash}`,
    method: 'POST',
    body: formData,
    isFormData: true,
  });
};