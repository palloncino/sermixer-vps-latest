import React, { useState, useEffect } from "react";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, Box, Divider, Paper, Chip, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Business, Description, Subject } from "@mui/icons-material";
import ReactMarkdown from 'react-markdown';
import MarkdownEditor from '../../components/MarkdownEditor';

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
      elevation={2} 
      sx={{ 
        backgroundColor: 'background.paper', 
        borderRadius: 2, 
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          px: 2.5, 
          py: 1.5, 
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Business fontSize="small" />
        <Typography variant="subtitle1" fontWeight={600}>
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
                color={company === 'Sermixer' ? 'primary' : 'default'}
                onClick={() => setQuoteHeadDetails({ ...quoteHeadDetails, company: 'Sermixer' })}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  '&:hover': { backgroundColor: company === 'Sermixer' ? 'primary.dark' : 'action.hover' }
                }}
              />
              <Chip
                label="S2 Truck Service"
                variant={company === 'S2 Truck Service' ? 'filled' : 'outlined'}
                color={company === 'S2 Truck Service' ? 'primary' : 'default'}
                onClick={() => setQuoteHeadDetails({ ...quoteHeadDetails, company: 'S2 Truck Service' })}
                sx={{ 
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  '&:hover': { backgroundColor: company === 'S2 Truck Service' ? 'primary.dark' : 'action.hover' }
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
                  backgroundColor: 'background.default'
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
