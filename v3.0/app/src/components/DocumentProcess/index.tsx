import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const DocumentProcess = () => (
    <Box mt={4} sx={{ background: '#ffc600ad', padding: '2rem', borderRadius: '4px' }}>
        <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
                Video spiegazione funzionalità (temporaneo)
            </Typography>
                <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/W_PJSodyl2w?si=7eh4Rd4gq4G7uSGU"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                ></iframe>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ color: '#2c3e50', marginBottom: '1rem' }}>
                    Proposta per architettura followup emails:
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#2c3e50' }}>
                    Passaggio 1: Creazione del Documento
                </Typography>
                <Typography paragraph>
                    Quando l'amministratore crea un documento, viene generato un URL univoco e una password monouso (OTP).
                    Queste informazioni vengono inviate all'email del cliente.
                </Typography>

                <Typography variant="subtitle1" sx={{ color: '#2c3e50' }}>
                    Passaggio 2: Autenticazione del Cliente
                </Typography>
                <Typography paragraph>
                    Il cliente accede al documento utilizzando l'URL e inserisce l'OTP per autenticarsi.
                    Una volta autenticato, può visualizzare e firmare il documento.
                </Typography>

                <Typography variant="subtitle1" sx={{ color: '#2c3e50' }}>
                    Passaggio 3: Firma del Documento
                </Typography>
                <Typography paragraph>
                    Quando il cliente firma il documento, la firma viene salvata come stringa immagine in formato base64.
                    Questo fa sì che il documento venga contrassegnato come solo lettura e avvia il processo di invio delle email di follow-up.
                </Typography>

                <Typography variant="subtitle1" sx={{ color: '#2c3e50' }}>
                    Passaggio 4: Email di Follow-Up
                </Typography>
                <Typography paragraph>
                    Dopo che il documento è stato firmato, vengono inviate email di follow-up immediatamente,
                    7 giorni prima della scadenza e alla scadenza del documento.
                </Typography>
            </Grid>
        </Grid>
    </Box>
);

export default DocumentProcess;
