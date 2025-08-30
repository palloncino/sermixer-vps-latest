import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info'; // Import InfoIcon
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import StatusCell from 'components/DocumentsList/StatusCell';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Actor, DocumentDataType } from 'types';
import { determineActor } from 'utils/determine-actor';
import { useDocumentContext } from '../../../state/documentContext';
import { useAppState } from '../../../state/stateContext';
import ChangeLogList from './ChangeLogList';
import { ChangeLogItem } from '../../../types';

const ActionsTab: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAppState();
    const { confirmDocument, generatePDF, saveDocument, rejectDocument, changeLogs, updatedDocumentData } = useDocumentContext();
    const actor = determineActor(user, (updatedDocumentData as DocumentDataType)?.data?.selectedClient);



    const [openDialog, setOpenDialog] = useState(false);
    const [dialogAction, setDialogAction] = useState<() => void>(() => { });

    const [isRevision, setIsRevision] = useState(false);
    const [revisionLabel, setRevisionLabel] = useState('');

    const hasChanges = changeLogs.length > 0;

    const handleOpenDialog = (action: () => void) => {
        setDialogAction(() => action);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);

    const handleDiscardChanges = () => window.location.reload();

    const mailtoLink = `mailto:${updatedDocumentData?.data.selectedClient?.email || ''}?subject=Il%20tuo%20documento%20%C3%A8%20stato%20creato&body=Gentile%20${encodeURIComponent(updatedDocumentData?.data?.selectedClient?.firstName || '')}%20${encodeURIComponent(updatedDocumentData?.data?.selectedClient?.lastName || '')},%0D%0A%0D%0AIl%20tuo%20documento%20%C3%A8%20stato%20creato.%20Trova%20i%20dettagli%20di%20seguito:%0D%0A%0D%0AIndirizzo:%20http://sermixer.micro-cloud.it:12923/client-preventive/${updatedDocumentData?.hash}%0D%0A%0D%0AOTP:%20${updatedDocumentData?.otp}%0D%0A%0D%0ACordiali%20saluti,%0D%0AIl%20tuo%20team`;

    const handleSaveDocument = () => {
        const revision = isRevision ? { label: revisionLabel } : { label: '' };
        handleOpenDialog(() => saveDocument(actor as Actor, revision));
    };

    // Format change details for save confirmation dialog
    const formatChangeDetails = (change: ChangeLogItem): string => {
        const { property, details } = change;
        
        const parseDetailsString = (details: string) => {
            const fromMatch = details.match(/__from__(.*?)__to__/);
            const toMatch = details.match(/__to__(.*)$/);
            const fromValue = fromMatch ? JSON.parse(fromMatch[1]) : 'Unknown';
            const toValue = toMatch ? JSON.parse(toMatch[1]) : 'Unknown';
            return { fromValue, toValue };
        };

        const { fromValue, toValue } = parseDetailsString(details);

        // Skip if values are the same or both null
        if ((fromValue === null && toValue === null) || fromValue === toValue) return '';

        let formattedChange = '';

        // Handle changes related to added products
        if (property.includes('data.addedProducts')) {
            const productMatch = property.match(/data\.addedProducts\[(\d+)\]/);
            const componentMatch = property.match(/components\[(\d+)\]/);
            const productIndex = productMatch ? parseInt(productMatch[1]) : null;
            const componentIndex = componentMatch ? parseInt(componentMatch[1]) : null;

            if (productIndex !== null && updatedDocumentData?.data?.addedProducts?.[productIndex]) {
                const productName = updatedDocumentData.data.addedProducts[productIndex].name || `Product ${productIndex + 1}`;

                // If a component is changed
                if (componentIndex !== null && updatedDocumentData.data.addedProducts[productIndex].components?.[componentIndex]) {
                    const componentName = updatedDocumentData.data.addedProducts[productIndex].components[componentIndex].name || `Component ${componentIndex + 1}`;

                    if (property.includes('included')) {
                        formattedChange = `${productName} > ${componentName} is now ${toValue ? 'Included' : 'Excluded'}`;
                    } else if (property.includes('quantity')) {
                        formattedChange = `${productName} > ${componentName} changed from ${fromValue} to ${toValue}`;
                    } else if (property.includes('discount')) {
                        formattedChange = `${productName} > ${componentName} discount changed from ${fromValue}% to ${toValue}%`;
                    } else {
                        formattedChange = `${productName} > ${componentName} changed from ${fromValue} to ${toValue}`;
                    }
                } else {
                    // If a product is changed
                    if (property.includes('price')) {
                        formattedChange = `${productName} price changed from ${fromValue} to ${toValue}`;
                    } else if (property.includes('discount')) {
                        formattedChange = `${productName} discount changed from ${fromValue}% to ${toValue}%`;
                    } else if (property.includes('description')) {
                        formattedChange = `${productName} description changed`;
                    }
                }
            }
        }
        // Handle payment terms changes
        else if (property.includes('data.paymentTerms')) {
            formattedChange = 'Payment terms updated';
        }
        // Handle changes in quote head details
        else if (property.includes('quoteHeadDetails')) {
            if (property.includes('object')) {
                formattedChange = 'Quote object changed';
            } else if (property.includes('description')) {
                formattedChange = 'Quote description changed';
            }
        }
        // General case for other properties
        else {
            formattedChange = `${property} changed from ${fromValue} to ${toValue}`;
        }

        return formattedChange;
    };

    return (
        <ActionsContainer>
            {actor?.type === 'employee' && (
                <ChangesContainer>
                    <Typography variant="h6" gutterBottom>{t('Status')}</Typography>
                    <StatusCell statuses={updatedDocumentData?.status || {}} />
                </ChangesContainer>
            )}

            {updatedDocumentData?.status.REJECTED ? (
                <Typography variant="body1" color="error" align="center" gutterBottom>
                    {t('DocumentReadOnly')}
                </Typography>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom>{t('Actions')}</Typography>
                    {actor?.type === 'employee' && (
                        <>
                            <Box display="flex" alignItems="center">
                                <Tooltip title={t('RevisionCreationExplanation')} arrow>
                                    <InfoIcon sx={{ mr: 1, cursor: 'pointer' }} />
                                </Tooltip>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isRevision}
                                            onChange={(e) => setIsRevision(e.target.checked)}
                                            disabled={changeLogs?.length === 0}
                                        />
                                    }
                                    label={t('Revision')}
                                />
                                {isRevision && (
                                    <TextField
                                        variant="outlined"
                                        placeholder={t('Enter revision label')}
                                        value={revisionLabel}
                                        onChange={(e) => setRevisionLabel(e.target.value)}
                                        size="small"
                                        sx={{ ml: 1, width: '200px' }}
                                    />
                                )}
                            </Box>
                        </>
                    )}
                    <ButtonsGrid>

                        <Tooltip title={hasChanges ? isRevision ? t('SaveOneRevision') : t('SaveChangesDesc') : t('NoChanges')}>
                            <ActionButton
                                variant={hasChanges ? 'contained' : 'outlined'}
                                onClick={handleSaveDocument}
                                startIcon={<SaveIcon />}
                            >
                                {isRevision ? t('SaveRevision') : t('SaveChanges')}
                            </ActionButton>
                        </Tooltip>

                        {hasChanges && (
                            <Tooltip title={t('DiscardChangesDesc')}>
                                <ActionButton
                                    variant="outlined"
                                    onClick={handleDiscardChanges}
                                    startIcon={<DeleteIcon />}
                                    color="error"
                                >
                                    {t('DiscardChanges')}
                                </ActionButton>
                            </Tooltip>
                        )}

                        {!updatedDocumentData?.status.FINALIZED && (
                            <Tooltip title={t('ConfirmDocumentDescription')}>
                                <ActionButton
                                    variant="contained"
                                    startIcon={<CheckIcon />}
                                    onClick={() => handleOpenDialog(confirmDocument)}
                                    color="success"
                                >
                                    {t('ConfirmDocument')}
                                </ActionButton>
                            </Tooltip>
                        )}

                        {actor?.type === 'employee' && (
                            <>
                                <Tooltip title={t('HandleGeneratePDFDescription')}>
                                    <ActionButton
                                        variant="contained"
                                        startIcon={<DescriptionIcon />}
                                        onClick={() => handleOpenDialog(generatePDF)}
                                    >
                                        {t('GeneratePDF')}
                                    </ActionButton>
                                </Tooltip>

                                <Tooltip title={t('ShareDocumentDescription', { otp: updatedDocumentData?.otp })}>
                                    <ActionButton
                                        variant="contained"
                                        startIcon={<ShareIcon />}
                                        onClick={() => window.open(mailtoLink, '_blank')}
                                    >
                                        {t('ShareDocument')}
                                    </ActionButton>
                                </Tooltip>

                                <Tooltip title={t('RejectDocumentDescription')}>
                                    <ActionButton
                                        variant="outlined"
                                        color="error"
                                        startIcon={<CloseIcon />}
                                        onClick={() => handleOpenDialog(rejectDocument)}
                                    >
                                        {t('RejectDocument')}
                                    </ActionButton>
                                </Tooltip>
                            </>
                        )}
                    </ButtonsGrid>
                </>
            )}

            <Box mt={4}>
                <Typography variant="h6" gutterBottom>{t('CurrentChanges')}</Typography>

                {changeLogs?.length > 0 ? (
                    <ChangesContainer>
                        <ChangeLogList changeLogs={changeLogs} />
                    </ChangesContainer>
                ) : (
                    <Typography variant="body2" gutterBottom>{t('NoChanges')}</Typography>
                )}
            </Box>


            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{t('ConfirmAction')}</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>{t('AreYouSure')}</DialogContentText>
                    {hasChanges && (
                        <Box sx={{ 
                            mt: 2, 
                            p: 2, 
                            backgroundColor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                {t('ActiveChanges')} ({changeLogs.length}):
                            </Typography>
                            <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                                {(() => {
                                    // Group changes by product
                                    const groupedChanges = changeLogs.slice(0, 5).reduce((groups: { [productName: string]: string[] }, change) => {
                                        const formattedChange = formatChangeDetails(change);
                                        if (!formattedChange) return groups; // Skip empty changes

                                        const { property } = change;
                                        let productName = 'General Changes';

                                        // Extract product name from property path
                                        if (property.includes('data.addedProducts')) {
                                            const productMatch = property.match(/data\.addedProducts\[(\d+)\]/);
                                            const productIndex = productMatch ? parseInt(productMatch[1]) : null;
                                            
                                            if (productIndex !== null && updatedDocumentData?.data?.addedProducts?.[productIndex]) {
                                                const baseName = updatedDocumentData.data.addedProducts[productIndex].name || `Product ${productIndex + 1}`;
                                                // Create unique identifier using index + name to handle duplicate product names
                                                productName = `${baseName} (#${productIndex + 1})`;
                                            }
                                        }

                                        if (!groups[productName]) {
                                            groups[productName] = [];
                                        }
                                        groups[productName].push(formattedChange);
                                        return groups;
                                    }, {});

                                    return Object.entries(groupedChanges).map(([productName, changes], groupIndex) => (
                                        <Box key={groupIndex} sx={{ mb: 1 }}>
                                            {/* Product header - only show if there are multiple products */}
                                            {Object.keys(groupedChanges).length > 1 && (
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        display: 'block', 
                                                        fontWeight: 600,
                                                        color: 'primary.main',
                                                        fontSize: '0.75rem',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {productName}:
                                                </Typography>
                                            )}
                                            
                                            {/* Changes for this product */}
                                            {changes.map((formattedChange, index) => (
                                                <Typography 
                                                    key={index}
                                                    variant="caption" 
                                                    sx={{ 
                                                        display: 'block', 
                                                        mb: 0.5,
                                                        ml: Object.keys(groupedChanges).length > 1 ? 2 : 0,
                                                        color: 'text.secondary',
                                                        fontSize: '0.75rem',
                                                        lineHeight: 1.4
                                                    }}
                                                >
                                                    • {formattedChange}
                                                </Typography>
                                            ))}
                                        </Box>
                                    ));
                                })()}
                                {changeLogs.length > 5 && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                        ...and {changeLogs.length - 5} more changes
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{t('Cancel')}</Button>
                    <Button
                        variant='contained'
                        onClick={() => {
                            dialogAction();
                            handleCloseDialog();
                        }}
                        color="primary"
                        autoFocus
                    >
                        {hasChanges ? t('SaveChanges') : t('Confirm')}
                    </Button>
                </DialogActions>
            </Dialog>
        </ActionsContainer>
    );
};

export default ActionsTab;

const ActionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 400px;
    margin: auto;
`;

const ButtonsGrid = styled(Box)`
    display: grid;
    grid-template-columns: repeat(2, 1fr); // Two columns
    gap: 16px; // Space between buttons
`;

const ActionButton = styled(Button)`
    padding: 8px; // Smaller padding for smaller text
    font-size: 0.875rem; // Smaller font size
    font-weight: bold;
    border-radius: 8px; // Rounded corners
    transition: background-color 0.3s, transform 0.2s;
    text-overflow: ellipsis; // Enable ellipsis
    overflow: hidden; // Hide overflow
    white-space: nowrap; // Prevent wrapping

    &:hover {
        transform: scale(1.05); // Slightly enlarge on hover
    }
`;

const ChangesContainer = styled.div`
    margin-top: 24px;
`;