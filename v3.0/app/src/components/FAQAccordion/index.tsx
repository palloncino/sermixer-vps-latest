import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

const FAQAccordion = () => {
    const { t } = useTranslation();

    return (
        <Grid item xs={12}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{t('HowToOpenAQuoteProcess')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{t('Step1')}</Typography>
                    <Typography>{t('Step2')}</Typography>
                    <Typography>{t('Step3')}</Typography>
                    <Typography>{t('Step4')}</Typography>
                </AccordionDetails>
            </Accordion>
        </Grid>
    );
};

export default FAQAccordion;
