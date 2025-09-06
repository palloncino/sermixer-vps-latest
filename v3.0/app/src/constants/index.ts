import { format, subDays } from 'date-fns';
import styled from "styled-components";
import i18n from "../i18n";
import { Company } from "../types";

export const getUsersFiltersConfig = () => [
  { id: "search", type: "text", label: "Search", placeholder: i18n.t("Search...") },
  {
    id: "role",
    type: "select",
    label: "Role",
    options: [
      { value: "all", label: i18n.t("AllRoles") },
      { value: "admin", label: i18n.t("Admin") },
      { value: "user", label: i18n.t("User") },
    ],
  },
];

export const getClientsFiltersConfig = () => [
  { id: "search", type: "text", label: "Search", placeholder: i18n.t("Search...") },
];


export const getProductsFiltersConfig = () => {
  const filters = [
    { id: "search", type: "text", label: "Search", placeholder: i18n.t("Search...") },
    {
      id: "category",
      type: "select",
      label: "Category",
      options: [
        { value: "all", label: i18n.t("AllCategories") },
        { value: "Vasche", label: i18n.t("VASCA") },
        { value: "CIFA", label: i18n.t("CIFA") },
        { value: "TELAI", label: i18n.t("TELAI") },
        { value: "INTERCAMBIABILE", label: i18n.t("INTERCAMBIABILE") },
        { value: "GANCIO_SCARRABILE", label: i18n.t("GANCIO SCARRABILE") },
        { value: "GRU", label: i18n.t("GRU") },
        { value: "CARICATORE_FORESTALE", label: i18n.t("CARICATORE FORESTALE") },
        { value: "PIANALE_TRASPORTO_MACCHINE", label: i18n.t("PIANALE TRASPORTO MACCHINE") },
        { value: "CASSONE", label: i18n.t("CASSONE") },
        { value: "LAVORAZIONI_VARIE", label: i18n.t("LAVORAZIONI VARIE") },
      ],
    },
    {
      id: "company",
      type: "select",
      label: "Company",
      options: [
        { value: "all", label: i18n.t("AllCompanies") },
        { value: "sermixer", label: i18n.t("Sermixer") },
        { value: "s2_truck_service", label: i18n.t("S2TruckService") },
      ],
    },
    {
      id: "priceRange",
      type: "range",
      label: "PriceRange",
      min: 0,
      max: 100000,
      step: 1000,
      defaultValue: [0, 100000], // This sets the initial range from 0 to 100000
    },
  ];

  return filters;
};

export const getDocumentsFiltersConfig = () => [
  { id: "search", type: "text", label: "Search", placeholder: i18n.t("Search...") },
  {
    id: "company",
    type: "select",
    label: "Company",
    options: [
      { value: "all", label: i18n.t("AllCompanies") },
      {
        value: "Sermixer" as Company,
        label: i18n.t("Sermixer"),
      },
      {
        value: "S2 Truck Service" as Company,
        label: i18n.t("S2TruckService"),
      },
    ],
  },
  {
    id: "dateRange",
    type: "dateRange",
    label: "DateRange",
    startLabel: i18n.t("StartDate"),
    endLabel: i18n.t("EndDate"),
    defaultStartDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    defaultEndDate: format(new Date(), 'yyyy-MM-dd'),
  },
];

export const ROUTES: any = (id: string | number = "") => ({
  productList: "/products-list",
  createProduct: "/create-product",
  editProduct: `/edit-product/${id}`,
  productPage: `/product/${id}`,
  quotesList: "/quotes-list",
  editQuote: `/edit-quote/${id}`,
  documentsList: "/documents-list",
  sharedDocument: `/client-preventive/${id}`,
  createDocument: "/create-document",
  profile: "/profile",
  usersList: "/users-list",
  editUser: `/edit-user/${id}`,
  userPage: `/user/${id}`,
  clientsList: "/clients-list",
  createClient: "/create-client",
  editClient: `/edit-client/${id}`,
  clientPage: `/client/${id}`,
});

export const STATUSES = {
  DOCUMENT_OPENED: "DOCUMENT_OPENED",
  EMAIL_OTP: "EMAIL_OTP",
  CLIENT_SIGNATURE: "CLIENT_SIGNATURE",
  STORAGE_CONFIRMATION: "STORAGE_CONFIRMATION",
  EXPIRED: "EXPIRED",
  REJECTED: "REJECTED",
};

export const SectionBorderContainer = styled.div`
  border-bottom-left-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;
  border-top: none;
  padding: 2rem 2rem 2rem 2rem;
`;

export const PALETTE: any = {
  Green: "#8FD300",
  Orange: 'orange',
  Blue: "#65acf2",
  ShineButton: "#65acf2",
  Red: "#f44336",
  Gray: 'lightgrey',
  BlueGradient: "linear-gradient(135deg,rgb(68, 69, 106) 0%, #5b86e5 50%, #7f53ac 100%)",
  HeaderBackground: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  HeaderPattern: "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
  HeaderPattern2: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  Black3: "#333",
  White: "#fff",
};
