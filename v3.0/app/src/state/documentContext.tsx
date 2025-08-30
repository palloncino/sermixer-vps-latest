import React, { createContext, useContext, useMemo } from "react";
import { useDocument } from "../hooks/useDocument";
import { DocumentContextType } from "../types";

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocumentContext = () => {
    const context = useContext(DocumentContext);
    if (context === undefined) {
        throw new Error('useDocumentContext must be used within a DocumentProvider');
    }
    return context;
};

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const documentState = useDocument();

    const value = useMemo(() => ({
        ...documentState,
    }), [documentState]);

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    );
};