import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DescriptionIcon from '@mui/icons-material/Description';
import styled from 'styled-components';
import { useDocumentContext } from 'state/documentContext';
import { dateText } from '../../../utils/date-text';

const StyledTableContainer = styled.div`
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
    overflow: hidden;
`;

const StyledTable = styled(Table)`
    & .MuiTableHead-root {
        background-color: #f8f9fa;
    }
    
    & .MuiTableCell-head {
        font-weight: 700;
        font-size: 0.875rem;
        color: #333;
        border-bottom: 2px solid #e0e0e0;
        padding: 12px 16px;
    }
    
    & .MuiTableCell-body {
        border-bottom: 1px solid #f0f0f0;
        padding: 8px 16px;
    }
`;

const CompactTableRow = styled(TableRow)`
    cursor: pointer;
    transition: background-color 0.2s ease;
    
    &:hover {
        background-color: #f5f5f5;
    }
    
    &:last-child .MuiTableCell-body {
        border-bottom: none;
    }
`;

const PdfItemContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 0;
`;

const PdfNameRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const PdfDateRow = styled.div`
    padding-left: 32px; /* Align with text after icon */
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
            <Box my={3}>
                <Typography textAlign="center" variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>
                    {t(title)}
                </Typography>
            </Box>
            <StyledTableContainer>
                <StyledTable>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('Documents')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pdfList.length > 0 ? (
                            pdfList.map((pdf, index) => (
                                <CompactTableRow key={index} onClick={() => window.open(pdf.url, '_blank')}>
                                    <TableCell component="th" scope="row">
                                        <PdfItemContainer>
                                            <PdfNameRow>
                                                <DescriptionIcon sx={{ fontSize: 20, color: '#666' }} />
                                                <Tooltip title={pdf.name}>
                                                    <Typography 
                                                        variant="subtitle1" 
                                                        sx={{ 
                                                            fontWeight: 500, 
                                                            wordBreak: 'break-word',
                                                            lineHeight: 1.3
                                                        }}
                                                    >
                                                        {pdf.name}
                                                    </Typography>
                                                </Tooltip>
                                            </PdfNameRow>
                                            <PdfDateRow>
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: '#888', 
                                                        fontSize: '0.75rem',
                                                        fontStyle: 'italic'
                                                    }}
                                                >
                                                    {dateText(pdf.timestamp)}
                                                </Typography>
                                            </PdfDateRow>
                                        </PdfItemContainer>
                                    </TableCell>
                                </CompactTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#888', py: 3 }}>
                                        {t('NoResult')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
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
