import React, { useState, useEffect } from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, Box, Divider, Paper, Chip, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Business, Description, Subject } from "@mui/icons-material";
import ReactMarkdown from 'react-markdown';
import MarkdownEditor from '../../components/MarkdownEditor';
import Button from '../../components/Button';

const EMPTY_QUOTE_DETAILS = {
  company: "",
  object: "",
  description: "",
};

const QuoteDetails = ({ onDetailsChange }) => {
  const { t } = useTranslation();
  const [quoteHeadDetails, setQuoteHeadDetails] = useState(EMPTY_QUOTE_DETAILS);
  const { company, object, description } = quoteHeadDetails;

  useEffect(() => {
    onDetailsChange(quoteHeadDetails);
  }, [quoteHeadDetails, onDetailsChange]);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        backgroundColor: '#ffffff', 
        borderRadius: 1, 
        overflow: 'hidden',
        border: '2px solid #000000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          px: 3, 
          py: 2, 
          backgroundColor: '#000000',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <Business sx={{ fontSize: 20 }} />
        <Typography 
          variant="h6" 
          fontWeight={900}
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontSize: '1rem'
          }}
        >
          {t("QuoteDetails")}
        </Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* Company Selection */}
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Business fontSize="small" />
              {t("Company")}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Sermixer"
                variant={company === 'Sermixer' ? 'filled' : 'outlined'}
                onClick={() => setQuoteHeadDetails({ ...quoteHeadDetails, company: 'Sermixer' })}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor: company === 'Sermixer' ? '#000000' : 'transparent',
                  color: company === 'Sermixer' ? '#ffffff' : '#000000',
                  borderColor: '#000000',
                  borderWidth: '2px',
                  '&:hover': { 
                    backgroundColor: company === 'Sermixer' ? '#333333' : '#f8f9fa',
                    borderColor: '#000000',
                  }
                }}
              />
              <Chip
                label="S2 Truck Service"
                variant={company === 'S2 Truck Service' ? 'filled' : 'outlined'}
                onClick={() => setQuoteHeadDetails({ ...quoteHeadDetails, company: 'S2 Truck Service' })}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor: company === 'S2 Truck Service' ? '#000000' : 'transparent',
                  color: company === 'S2 Truck Service' ? '#ffffff' : '#000000',
                  borderColor: '#000000',
                  borderWidth: '2px',
                  '&:hover': { 
                    backgroundColor: company === 'S2 Truck Service' ? '#333333' : '#f8f9fa',
                    borderColor: '#000000',
                  }
                }}
              />
            </Stack>
          </Box>

          {/* Object Field */}
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Subject fontSize="small" />
              {t("Object")}
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              name="object"
              size="small"
              value={object}
              onChange={(e) =>
                setQuoteHeadDetails({
                  ...quoteHeadDetails,
                  [e.target.name]: e.target.value,
                })
              }
              placeholder={t("EnterObjectPlaceholder") || "Inserisci oggetto..."}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  border: '2px solid #000000',
                  borderRadius: 1,
                  backgroundColor: '#ffffff',
                  '& fieldset': {
                    border: 'none',
                  },
                  '&:hover': {
                    borderColor: '#000000',
                    backgroundColor: '#f8f9fa',
                  },
                  '&.Mui-focused': {
                    borderColor: '#000000',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)',
                  },
                },
                '& .MuiInputBase-input': {
                  fontWeight: 600,
                  color: '#000000',
                }
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Description fontSize="small" />
              {t("DescriptionOffer")}
            </Typography>
            <MarkdownEditor
              value={description}
              onChange={(value) =>
                setQuoteHeadDetails({
                  ...quoteHeadDetails,
                  description: value,
                })
              }
              minRows={3}
              maxRows={5}
              placeholder={t("EnterDescriptionPlaceholder") || "Descrivi l'offerta..."}
            />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default QuoteDetails;
