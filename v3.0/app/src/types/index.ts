import { Dispatch, SetStateAction } from "react";
import { AuthStateType } from '../hooks/useAuth';
import { ClientsStateType } from '../hooks/useClients';
import { ProductsStateType } from '../hooks/useProducts';
import { QuotesStateType } from '../hooks/useQuotes';
import { UsersStateType } from '../hooks/useUsers';

export type Company = "sermixer" | "s2_truck_service";
// + - - - - - - - - - - - -
// | User
// + - - - - - - - - - - - 
export interface UserType {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  companyName: Company;
  email: string;
  role: Role;
  password: string;
  createdAt: string; // created by the server - do not write in front end
  updatedAt: string; // created by the server - do not write in front end
}
export type Role = 'admin' | 'user';
// + - - - - - - - - - - - -
// | Client
// + - - - - - - - - - - - -
interface Address {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}
export interface ClientType {
  id: number;
  fiscalCode: string;
  vatNumber: string;
  firstName: string;
  lastName: string;
  companyName: string;
  address: Address;
  email: string;
  mobileNumber?: string;
  createdAt?: string; // created by the server - do not write in front end
  updatedAt?: string; // created by the server - do not write in front end
}
// + - - - - - - - - - - - -
// | Product
// + - - - - - - - - - - - -

export interface ComponentType {
  discount: number;
  description: string;
  id: string;
  included: boolean;
  image?: globalThis.File;
  imgUrl: string;
  name: string;
  originalIndex: number; // sorting
  price: number;
  quantity: number;
}

export interface ProductType {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imgUrl?: string;
  components?: ComponentType[];
  company?: string;
  previewUrl?: string; // frontend only, parsed version of imgUrl (Blob => string)
  createdAt?: string; // created by the server - do not write in front end
  updatedAt?: string; // created by the server - do not write in front end
  discount?: number; // Discount as a percentage
  image?: globalThis.File;
}

export type ProductFormProps = {
  initialProduct: ProductType;
  onSave: (product: ProductType) => void;
  loading: boolean;
  errorMessage?: string;
  successMessage?: string;
};

// + - - - - - - - - - - - -
// | Document
// + - - - - - - - - - - - -

export interface DocumentFooterProps {
  onSaveSignature: ({
    clientSignature,
    ownerSignature,
    signedAt,
  }: {
    clientSignature: string | null;
    ownerSignature: string | null;
    signedAt: string;
  }) => void;
  initialDate?: string;
  initialClientSignature?: string | null;
  initialOwnerSignature?: string | null;
}

export type PriceType = { [key: string]: string };

export type ComponentSelectionType = { [key: string]: boolean };

export interface SaveDocumentProps {
  hash: string;
  updatedDocumentData: DocumentDataType;
  uploadedFiles: File[];
  setMessage: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
  t: any;
  getDocument: (hash: string) => void;
}

export type Changes = {
  name: string;
  description: string;
}[];

export type MessageObject = {
  type: "success" | "error";
  text: string;
};

export type QuoteHeadDetailsType = {
  company: string;
  description: string;
  object: string;
};

export type FollowUpSentType = {
  immediate: boolean;
  reminder: boolean;
  expiration: boolean;
};

export type DocumentHistoryType = {
  actorId: string;
  action: string;
  timestamp: string;
  details?: string;
};

export type DocumentDataDataType = {
  selectedClient: ClientType | null;
  paymentTerms: string;
  quoteHeadDetails: QuoteHeadDetailsType | null;
  addedProducts: ProductType[] | null;
};

export type Statuses = {
  CLIENT_VIEWED_DOC: boolean;
  YOUR_TURN: boolean;
  FINALIZED: boolean;
  REJECTED: boolean;
};

export type FileType = {
  name: string;
  url: string;
};

export type DocumentDataType = {
  discount: number;
  clientEmail: string;
  company: Company;
  createdAt: string;
  data: DocumentDataDataType;
  dateOfSignature: string | null;
  expiresAt: string | null;
  hash: string;
  revisions: Revision[] | [] | null;
  pdfUrls: string[] | [];
  id: number;
  note: string | null;
  otp: string;
  readonly: boolean;
  status: Statuses;
  updatedAt: string;
  employeeID: string;
};

export type HashType = { hash: string | undefined };

export type PreventiveFormProps = {
  documentData: DocumentDataType;
  setUpdatedDocumentData: (data: DocumentDataType) => void;
};

export type SaveDocumentSuccessResponse = {
  success: boolean;
  document: DocumentDataType;
};

export type SuccessResponse = {
  success: boolean;
  [key: string]: any;
};

export type Revision = {
  changes: ChangeLogItem[];
  id: number; // revision's index, if 0 is the mother revision, otherwise it s index based
  actor: Actor;
  snapshot: DocumentDataDataType;
  timestamp: string;
};

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type Actor = {
  type: "employee" | "client";
  id: number;
};

export type DocumentManagementPanelProps = {
  revisions?: Revision[];
  selectedRevisionId?: number | null;
  displayChanges?: boolean;
  currentChanges?: { name: string; description: string }[];
  documentReadOnly?: boolean;
  handleSave: () => void;
  handleChosenRevision: (revisionId: number) => void;
};

export interface SharedDocumentHookType {
  message: MessageObject | null;
  setMessage: Dispatch<SetStateAction<MessageObject | null>>;
  documentData: DocumentDataType | null;
  updatedDocumentData: DocumentDataType | null;
  setUpdatedDocumentData: Dispatch<SetStateAction<DocumentDataType | null>>;
  changeLogs: ChangeLogItem[];
  lockedView: boolean;
  setLockedView: Dispatch<SetStateAction<boolean>>;
  selectedRevisionId: number | null;
  theActor: Actor | null;
  isLoadingAuthorization: boolean;
  handleSave: () => Promise<void>;
  generatePDF: (type: GeneratePDFParamType) => Promise<{
    success: boolean;
    error: string;
  } | undefined>;
  confirmDocument: () => Promise<{
    success: boolean;
    error: string;
  } | undefined>;
  handleShareDocument: () => Promise<void>;
  handleRejectDocument: () => Promise<void>;
  handleChosenRevision: (revisionId: number) => void;
  getRevisionBorderColor: (actorType: string) => string;
  setNote: (note: string) => void;
  hash: string | undefined;
}

export type GeneratePDFParamType = 'confirmation' | 'default';

export type ProtectedRouteP = {
  allowedRoles: Role[];
}

export type DocumentListP = {
  documents: DocumentDataType[];
  filters: Filter[];
  setMessage?: (text: string) => void;
}

export type QuoteType = {
  id: number;
  userId: number;
  company: string;
  object: string;
  description?: string;
  commissioner?: {
    [key: string]: any; // Adjust the type as necessary based on the JSON structure
  };
  subtotal?: number;
  total?: number;
  notes?: string;
  issuedDate?: string; // Date as a string (ISO format or similar)
  expiryDate?: string; // Date as a string (ISO format or similar)
  pdfUrl?: string;
  data?: {
    [key: string]: any; // Adjust the type as necessary based on the JSON structure
  };
  createdAt: string; // Date as a string (ISO format or similar)
  updatedAt: string; // Date as a string (ISO format or similar)
};



export type AppStateContextType = 
  AuthStateType &
  UsersStateType &
  ClientsStateType &
  ProductsStateType &
  QuotesStateType;


export type DocumentContextType = {
  updateDocumentDataFromRevision: (data: Revision) => void;
  originalDocumentData: DocumentDataType | null;
  updatedDocumentData: DocumentDataType | null;
  setUpdatedDocumentData: any;
  allDocumentsData: DocumentDataType[] | null;
  getDocument: (hash: string) => Promise<DocumentDataType | null>;
  getAllDocuments: () => Promise<void>;
  createDocument: (documentData: DocumentDataType) => Promise<{ success: boolean; document: any }>;
  clientViewedDocument: (hash: string) => Promise<SaveDocumentSuccessResponse>;
  rejectDocument: () => Promise<SaveDocumentSuccessResponse>;
  deleteDocuments: (docIds: number | number[]) => Promise<{ ids: number[] }>;
  saveDocument: (actor: Actor; revision: RevisionLabel) => Promise<SaveDocumentSuccessResponse>;
  updateDocumentField: (fieldName: string, value: any) => void;
  updateNestedDocumentField: (path: string[], value: any) => void;
  changeLogs: ChangeLogItem[];
  setChangeLogs: React.Dispatch<React.SetStateAction<ChangeLogItem[]>>;
  generatePDF: () => Promise<{ success: boolean; error: string | null }>;
  confirmDocument: () => Promise<{ success: boolean; error: string | null }>;
  updateQuoteDetails: (object: string, description: string) => void;
  error: any;
  loading: boolean;
};

type FilterOption = {
  value: string;
  label: string;
};

type FilterBase = {
  id: string;
  type: 'text' | 'select' | 'range' | 'dateRange';
  label: string;
};

type TextFilter = FilterBase & {
  type: 'text';
  placeholder?: string;
};

type SelectFilter = FilterBase & {
  type: 'select';
  options: FilterOption[];
  value?: string;
};

type RangeFilter = FilterBase & {
  type: 'range';
  min: number;
  max: number;
  step: number;
  defaultValue?: [number, number];
};

type DateRangeFilter = FilterBase & {
  type: 'dateRange';
  startLabel: string;
  endLabel: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
};

export interface ChangeLogItem {
  property: string;
  originalValue: any;
  newValue: any;
  timestamp: string;
  action: string;
  details: string;
  label: string; // New field
}


export type Filter = TextFilter | SelectFilter | RangeFilter | DateRangeFilter;

export type ProductAPIResponse = { success: boolean; product: ProductType } | undefined

export type RevisionLabel = {
  label: string;
}