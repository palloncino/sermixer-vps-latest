import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Box,
  Button,
  Grid,
  Snackbar,
  TextField
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFlashMessage } from 'state/FlashMessageContext';
import { ClientType } from 'types';
import * as yup from 'yup';
import { ROUTES } from '../../constants';
import { useAppState } from '../../state/stateContext';

// Helper function to validate Italian Fiscal Code
const isValidItalianFiscalCode = (code: string) => {
  const regex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/i;
  return regex.test(code);
};

const schema = yup.object().shape({
  fiscalCode: yup
    .string()
    .test('is-valid-fiscal-code', 'Invalid Italian Fiscal Code', (value) =>
      value ? isValidItalianFiscalCode(value) : true
    )
    .nullable(),
  vatNumber: yup.string().required('VAT number is required').max(14, 'VAT number must be at most 14 characters'),
  firstName: yup.string().nullable(),
  lastName: yup.string().nullable(),
  companyName: yup.string().required('Company name is required'),
  address: yup.object().shape({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required'),
    zipCode: yup.string().required('Zip code is required'),
    country: yup.string().required('Country is required').oneOf(['IT'], 'Country must be IT'),
  }),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: yup.string(),
});

const CreateClient: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showMessage } = useFlashMessage()
  const { addClient } = useAppState();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { control, handleSubmit, formState: { errors } } = useForm<ClientType>({
    resolver: yupResolver(schema),
    defaultValues: {
      address: {
        country: 'IT'
      }
    }
  });

  const onSubmit = async (data: ClientType) => {
    try {
      const response = await addClient(data);
      if (response?.success) {
        setSnackbar({ open: true, message: 'Client created successfully', severity: 'success' });
        navigate(`${ROUTES(response?.client?.id).clientPage}?created=true`)
      } else {
        if (response?.message) {
          setSnackbar({ open: true, message: response?.message, severity: 'error' });
          showMessage(response?.message, 'error')
        }
      }
    } catch (error) {
      setSnackbar({ open: true, message: typeof error.message === 'string' ? error.message : 'Error', severity: 'error' });
    }
  };

  return (
    <>
      <Box p={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="fiscalCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('FiscalCode')}
                    fullWidth
                    error={!!errors.fiscalCode}
                    helperText={errors.fiscalCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="vatNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('VATNumber')}
                    fullWidth
                    error={!!errors.vatNumber}
                    helperText={errors.vatNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('FirstName')}
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('LastName')}
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('CompanyName')}
                    fullWidth
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Street')}
                    fullWidth
                    error={!!errors.address?.street}
                    helperText={errors.address?.street?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('City')}
                    fullWidth
                    error={!!errors.address?.city}
                    helperText={errors.address?.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="address.zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('ZipCode')}
                    fullWidth
                    error={!!errors.address?.zipCode}
                    helperText={errors.address?.zipCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="address.country"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Country')}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value="IT"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('Email')}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('MobileNumber')}
                    fullWidth
                    error={!!errors.mobileNumber}
                    helperText={errors.mobileNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="button"
                  onClick={() => navigate(ROUTES().clients)}
                  sx={{ mr: 2 }}
                >
                  {t('Cancel')}
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {t('CreateClient')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateClient;
