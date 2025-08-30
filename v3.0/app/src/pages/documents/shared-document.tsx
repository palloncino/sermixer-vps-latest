import styled from '@emotion/styled';
import { Box } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDocumentContext } from 'state/documentContext';
import { useAppState } from 'state/stateContext';
import { DocumentDataDataType, Revision } from 'types';
import Loading from '../../components/Loading';
import DocumentManagementPanel from "./components/DocumentManagementPanel";
import LockView from './components/LockView'; // Import LockView
import PreventiveForm from "./components/PreventiveForm";

const SharedDocument: FC = () => {
    const { originalDocumentData, setUpdatedDocumentData } = useDocumentContext();
    const [activeRevision, setActiveRevision] = useState<Revision>();
    const [isLocked, setIsLocked] = useState(true);
    const [loading, setLoading] = useState(true);
    const { user, verifyToken } = useAppState();

    useEffect(() => {
        setLoading(true)
        const checkUserAuthorization = async () => {
            try {
                await verifyToken();
                if (user?.role === 'admin') {
                    setIsLocked(false);
                }
            } catch (error) {
                console.error("Authorization error:", error);
            } finally {
                setLoading(false); // Set loading to false after checking
            }
        };

        checkUserAuthorization();
    }, []);

    if (loading) {
        return <Loading />;
    }

    const handleChosenRevision = (revision: Revision) => {

        if (revision && revision.snapshot) {
            try {
                setActiveRevision(revision);
                setUpdatedDocumentData({ ...originalDocumentData, data: revision.snapshot });
            } catch (error) {
                console.error("Error parsing snapshot data:", error);
            }
        } else {
            console.error("Revision data is undefined or missing", revision);
        }
    };

    return (
        <Container>

            {isLocked ? (
                <LockView setIsLocked={setIsLocked} /> // Show LockView if the document is locked
            ) : (
                <>
                    <Content>
                        <PreventiveForm
                            activeRevisionLabel={activeRevision?.label}
                            revisionData={activeRevision?.snapshot as DocumentDataDataType}
                        />
                    </Content>
                    <Sidebar>
                        <DocumentManagementPanel selectedRevisionId={activeRevision?.id} handleChosenRevision={handleChosenRevision} />
                    </Sidebar>
                </>
            )}
        </Container>
    );
};

export default SharedDocument;

const Container = styled(Box)`
    display: grid;
    grid-template-columns: 3fr 1fr;
    height: 100vh;
    overflow: hidden;
`;

const Content = styled(Box)`
    margin-top: 70px;
    overflow-y: auto;
    margin-left: 10px;
    margin-right: 20px;
`;

const Sidebar = styled(Box)`
    position: fixed;
    top: 70px;
    right: 10px;
    width: 25%;
    height: calc(100vh - 80px);
    overflow-y: auto;
    overflow-x: hidden;
    background: #fff;
    min-width: 400px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    
    /* Improved scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 transparent;
    
    &::-webkit-scrollbar {
        width: 6px;
    }
    
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 3px;
        
        &:hover {
            background-color: #a8a8a8;
        }
    }
`;

