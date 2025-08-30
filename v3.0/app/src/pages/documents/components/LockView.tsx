import { Backdrop, Box, Button, CircularProgress, Divider, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocumentContext } from 'state/documentContext';
import { useFlashMessage } from 'state/FlashMessageContext';
import styled from 'styled-components';
import { isAdmin } from '../../../utils/isWho';

const StyledBackdrop = styled(Backdrop)`
  z-index: 1300; // Adjust the z-index to be higher if needed
`;

const FormContainer = styled(Paper)`
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  margin: auto;
`;

const LockView: React.FC<{ setIsLocked: (val: boolean) => void }> = ({ setIsLocked }) => {
    const { t } = useTranslation();
    const { originalDocumentData, getDocument, clientViewedDocument } = useDocumentContext();
    const [inputOTP, setInputOTP] = useState<string>();
    const [loading, setLoading] = useState(true);
    const { hash } = useParams<{ hash: string }>();
    const [error, setError] = useState('');
    const { showMessage } = useFlashMessage()
    const navigate = useNavigate();

    useEffect(() => {
        if (hash) {
            getDocument(hash);
        }
    }, [hash, getDocument]);

    useEffect(() => {
        if (originalDocumentData) {
            if (isAdmin(originalDocumentData.employeeID) || originalDocumentData.employeeID === originalDocumentData.employeeID) {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [originalDocumentData]);

    useEffect(() => {
        const savedOTP = localStorage.getItem(`otp-${originalDocumentData?.hash}`);
        if (savedOTP) {
            setInputOTP(savedOTP);
            setTimeout(() => {
                handleUnlock(savedOTP);
                showMessage(t('FoundOTP'), 'success')
            }, 200)
        }
    }, [originalDocumentData?.hash]);

    const handleUnlock = async (otp?: string) => {
        if (otp && otp === originalDocumentData?.otp) {
            setIsLocked(false);
        }
        if (inputOTP === originalDocumentData?.otp) {
            clientViewedDocument(hash as string);
            localStorage.setItem(`otp-${originalDocumentData?.hash}`, inputOTP);
            setIsLocked(false);
        } else {
            setError('This is not the right OTP');
        }
    };

    return (
        <StyledBackdrop open>
            {loading ? (
                <FormContainer elevation={3}>
                    <Typography variant="h6" gutterBottom>
                        {t('LoadingDocumentInformation')}
                    </Typography>
                    <CircularProgress />
                </FormContainer>
            ) : (
                <FormContainer elevation={3}>
                    <Box mb={2}>
                        <Typography mb={2} variant="h5">{t('UnlockDocument')}</Typography>
                        <Typography>{t('UnlockDocumentDescription')}</Typography>
                    </Box>

                    {error && (
                        <Box mb={2}>
                            <Typography color="error">{error}</Typography>
                        </Box>
                    )}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        label={t('Enter OTP')}
                        value={inputOTP}
                        onChange={(e) => setInputOTP(e.target.value)}
                        fullWidth
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUnlock}
                            disabled={!inputOTP}
                            sx={{
                                width: '100%',
                                mb: 2,
                                '&.Mui-disabled': {
                                    color: 'grey.500',
                                    borderColor: 'grey.500',
                                    backgroundColor: 'grey.300',
                                },
                            }}
                        >
                            {t('Unlock')}
                        </Button>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" gutterBottom>
                        {t('LookingForLogin?')}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/login')}
                        fullWidth
                    >
                        {t('Login')}
                    </Button>
                </FormContainer>
            )}
        </StyledBackdrop>
    );
};


export default LockView;
