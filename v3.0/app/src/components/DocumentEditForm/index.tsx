import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DocumentDataType } from '../../types';

interface DocumentEditFormProps {
  initialData: DocumentDataType;
  onSubmit: (data: DocumentDataType) => void;
}

const DocumentEditForm: React.FC<DocumentEditFormProps> = ({ initialData, onSubmit }) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<DocumentDataType>({
    defaultValues: initialData,
  });

  const renderFields = (obj: any, prefix = '') => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <Box key={fieldName} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1">{t(key)}</Typography>
            {renderFields(value, fieldName)}
          </Box>
        );
      }

      if (Array.isArray(value)) {
        return (
          <Box key={fieldName} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1">{t(key)}</Typography>
            {value.map((item, index) => (
              <Box key={`${fieldName}.${index}`} sx={{ ml: 2 }}>
                <Typography variant="subtitle2">{`${t('Item')} ${index + 1}`}</Typography>
                {renderFields(item, `${fieldName}.${index}`)}
              </Box>
            ))}
          </Box>
        );
      }

      if (typeof value === 'boolean') {
        return (
          <Controller
            key={fieldName}
            name={fieldName as any}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label={t(key)}
                select
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="true">{t('Yes')}</option>
                <option value="false">{t('No')}</option>
              </TextField>
            )}
          />
        );
      }

      return (
        <Controller
          key={fieldName}
          name={fieldName as any}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={t(key)}
              multiline={typeof value === 'string' && value.length > 50}
              rows={typeof value === 'string' && value.length > 50 ? 4 : 1}
              sx={{ mb: 2 }}
            />
          )}
        />
      );
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderFields(initialData)}
      <Button type="submit" variant="contained" color="primary">
        {t('Save Changes')}
      </Button>
    </form>
  );
};

export default DocumentEditForm;