import { Box, Tab, Tabs, Typography, Badge } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocumentContext } from 'state/documentContext';
import { Actor, ClientType, Revision } from 'types';
import { PALETTE } from '../../../constants/index';
import { useAppState } from '../../../state/stateContext';
import { determineActor } from '../../../utils/determine-actor';
import PDFPreviewGrid from '../components/PDFPreviewGrid';
import Revisions from '../components/Revisions';
import ActionsTab from './ActionsTab';
import TabPanel from './TabPanel';
import MarkdownEditor from 'components/MarkdownEditor';

const DocumentManagementPanel: React.FC<{ handleChosenRevision: (revision: Revision) => void; selectedRevisionId: string }> = ({ handleChosenRevision, selectedRevisionId }) => {
    const { t } = useTranslation();
    const { user, verifyToken } = useAppState();
    const { updatedDocumentData, updateDocumentDataFromRevision, setUpdatedDocumentData, changeLogs } = useDocumentContext(); // Add setUpdatedDocumentData
    const [theActor, setTheActor] = useState<Actor | undefined>();
    const [value, setValue] = useState(0);

    useEffect(() => {
        verifyToken();
    }, []);

    useEffect(() => {
        const result = determineActor(user, updatedDocumentData?.data?.selectedClient as ClientType);
        setTheActor(result);
    }, [user, updatedDocumentData]);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleRevisionSelect = (revision: Revision) => {
        const selectedRevision = updatedDocumentData?.revisions?.find(r => r.id === revision.id);
        if (selectedRevision) {
            handleChosenRevision(selectedRevision);
            updateDocumentDataFromRevision(selectedRevision);
        }
    };

    const resetToOriginal = () => {
        window.location.reload();
    };

    // Handle note update
    const handleNoteChange = (newNote: string) => {
        setUpdatedDocumentData((prevData) => ({
            ...prevData,
            note: newNote
        }));
    };

    return (
        <Box sx={{ width: '100%', height: '100%', padding: 2 }}>
            <Tabs
                value={value}
                onChange={handleChange}
                aria-label="document management tabs"
                variant="fullWidth"
                sx={{
                    '& .MuiTabs-indicator': { backgroundColor: PALETTE.Blue },
                    '& .MuiTab-root': { backgroundColor: 'transparent', color: PALETTE.Black3 },
                    '& .Mui-selected': { backgroundColor: 'transparent', color: PALETTE.Black3, fontWeight: 'bold' }
                }}
            >
                {/* Adding Badge to Actions Tab */}
                <Tab
                    label={
                        <Badge
                            color="error"
                            variant={changeLogs.length > 0 ? 'dot' : 'standard'}
                            overlap="rectangular"
                        >
                            {t('Actions')}
                        </Badge>
                    }
                />
                {theActor?.type === "employee" && <Tab label={t('Revisions')} />}
                {theActor?.type === "employee" && <Tab label={t('PDFs')} />}
                {theActor?.type === "employee" && <Tab label={t('Notes')} />}
            </Tabs>

            <Box sx={{ marginTop: 2 }}>
                <TabPanel value={value} index={0}>
                    <ActionsTab />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Revisions
                        revisions={updatedDocumentData?.revisions || []}
                        selectedRevisionId={selectedRevisionId}
                        handleChosenRevision={handleRevisionSelect}
                        resetToOriginal={resetToOriginal}
                    />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {updatedDocumentData && <PDFPreviewGrid pdfUrls={updatedDocumentData.pdfUrls || []} />}
                </TabPanel>
                {theActor?.type === "employee" && (
                    <TabPanel value={value} index={3}>
                        <Box my={1}>
                            <Typography textAlign={'center'} variant='h5'>{t('Notes')}</Typography>
                            <MarkdownEditor
                                value={updatedDocumentData?.note || ''}
                                onChange={handleNoteChange}
                                readOnly={false}
                                minRows={5}
                            />
                        </Box>
                    </TabPanel>
                )}
            </Box>
        </Box>
    );
};

export default DocumentManagementPanel;
