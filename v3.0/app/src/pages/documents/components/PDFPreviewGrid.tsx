import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DescriptionIcon from '@mui/icons-material/Description';
import styled from 'styled-components';
import { useDocumentContext } from 'state/documentContext';

const StyledTableRow = styled(TableRow)`
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0; /* Light gray hover effect */
    }
`;

const NameCell = styled(TableCell)`
    max-width: 250px; /* Adjust the width to control overflow */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; /* Ellipsis for long names */
`;

const PDFPreviewGrid: React.FC = () => {
    const { t } = useTranslation();
    const { updatedDocumentData } = useDocumentContext();

    // Sort PDFs by latest first
    const sortedPdfUrls = updatedDocumentData?.pdfUrls?.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) || [];

    // Separate PDFs into "confirmation" and "preventivo" based on partial match, case insensitive
    const confirmationPdfs = sortedPdfUrls?.filter(pdf => pdf.name.toLowerCase().includes("confirmation"));
    const preventivoPdfs = sortedPdfUrls?.filter(pdf => pdf.name.toLowerCase().includes("preventivo"));

    const renderPdfTable = (pdfList, title) => (
        <>
            <Box my={2}>
                <Typography textAlign="center" variant="h6" sx={{ fontWeight: 'bold' }}>
                    {t(title)}
                </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Name')}</TableCell>
                            <TableCell>{t('Timestamp')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pdfList.length > 0 ? (
                            pdfList.map((pdf, index) => (
                                <StyledTableRow key={index} onClick={() => window.open(pdf.url, '_blank')}>
                                    <NameCell component="th" scope="row">
                                        <Box display="flex" alignItems="center">
                                            <DescriptionIcon sx={{ fontSize: 30, mr: 1 }} />
                                            <Tooltip title={pdf.name}>
                                                <Typography variant="subtitle1" noWrap>
                                                    {pdf.name}
                                                </Typography>
                                            </Tooltip>
                                        </Box>
                                    </NameCell>
                                    <TableCell>{new Date(pdf.timestamp).toLocaleString()}</TableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>
                                    <Typography variant="body1" gutterBottom>
                                        {t('NoResult')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            {renderPdfTable(confirmationPdfs, 'Confirmation PDFs')}
            {renderPdfTable(preventivoPdfs, 'Preventivo PDFs')}
        </Box>
    );
};

export default PDFPreviewGrid;
