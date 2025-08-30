import FlagIcon from '@mui/icons-material/Flag';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Revision } from 'types';
import { dateText } from '../../../utils/date-text';

const BadgeContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
`;

const RevisionButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 1rem;
    background-color: ${({ active }) => (active ? '#f5f5f5' : 'unset')}; /* Optional slight background change */
    border: 1px solid ${({ active }) => (active ? 'transparent' : '#ccc')};
`;

const RevisionText = styled(Typography)`
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    font-size: 0.9rem;
    text-transform: none;
    text-align: left;
`;

interface RevisionsProps {
    revisions: Revision[];
    selectedRevisionId?: number | null;
    handleChosenRevision: (revision: Revision) => void;
    resetToOriginal: () => void;
}

const Revisions: React.FC<RevisionsProps> = ({ revisions, selectedRevisionId, handleChosenRevision, resetToOriginal }) => {
    const { t } = useTranslation();

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('Revisions')}
            </Typography>
            {revisions.map((revision) => (
                <BadgeContainer key={revision.id}>
                    <Tooltip title={dateText(revision.createdAt)} arrow>
                        <RevisionButton
                            onClick={() => handleChosenRevision(revision)}
                            active={selectedRevisionId === revision.id} // Add active flag for conditional styling
                        >
                            <FlagIcon
                                sx={{
                                    marginRight: 1,
                                    color: selectedRevisionId === revision.id ? 'red' : '#ccc', // Only the flag turns red when active
                                }}
                            />
                            <RevisionText variant="body1">
                                {revision.label}
                            </RevisionText>
                        </RevisionButton>
                    </Tooltip>
                </BadgeContainer>
            ))}
            <Button
                variant="outlined"
                onClick={resetToOriginal}
                sx={{ mt: 2, width: '100%' }}
            >
                {t('ResetToOriginal')}
            </Button>
        </Box>
    );
};

export default Revisions;
