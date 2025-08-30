import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dateText } from '../../utils/date-text';

interface RecentActivityProps {
  documents: any[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ documents }) => {
  const { t } = useTranslation();
  const getPdfStatus = (pdfUrls: any[] | []) => {
    if (!pdfUrls || !Array.isArray(pdfUrls) || pdfUrls.length === 0) {
      return { hasPdfs: false, count: 0 };
    }
    
    // Filter out invalid objects and ensure they have a valid url property
    const validPdfUrls = pdfUrls.filter(item => 
      item && 
      typeof item === 'object' && 
      item.url && 
      typeof item.url === 'string' && 
      item.url.trim() !== ''
    );
    
    return { hasPdfs: validPdfUrls.length > 0, count: validPdfUrls.length };
  };

  if (!documents || documents.length === 0) {
    return (
      <Box sx={{ p: 1.5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('No recent activity')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '8px'
    }}>
      {/* Simple Table Header */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: '60px 1fr 2fr 120px 80px',
        gap: '6px',
        padding: '8px 12px',
        backgroundColor: '#fafafa',
        borderBottom: '1px solid #e5e5e5',
        fontWeight: 600,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: '#1a1a1a'
      }}>
        <div>#</div>
        <div>{t('Company')}</div>
        <div>{t('Object')}</div>
        <div>{t('Date')}</div>
        <div style={{ textAlign: 'center' }}>{t('PDFs')}</div>
      </Box>

      {/* Simple Table Body */}
      <Box>
        {documents.map((doc, index) => {
          const pdfStatus = getPdfStatus(doc.pdfUrls);
          return (
            <Box key={doc.id} sx={{ 
              display: 'grid',
              gridTemplateColumns: '60px 1fr 2fr 120px 80px',
              gap: '6px',
              padding: '6px 12px',
              borderBottom: '1px solid #f5f5f5',
              fontSize: '0.75rem',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: '#fafafa'
              }
            }}>
              <div>
                <Link 
                  to={`/client-preventive/${doc.hash}`}
                  style={{ 
                    color: '#2563eb', 
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  {doc.id}
                </Link>
              </div>
              <div style={{ 
                color: '#1a1a1a',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {doc.data.quoteHeadDetails?.company || 'N/A'}
              </div>
              <div style={{ 
                color: '#4a4a4a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {doc.data.quoteHeadDetails?.object || doc.data.quoteHeadDetails?.description || 'N/A'}
              </div>
              <div style={{ color: '#6b7280' }}>
                {dateText(doc.updatedAt)}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: pdfStatus.hasPdfs ? '#10b981' : '#d1d5db',
                  margin: '0 auto',
                  display: 'inline-block'
                }} />
              </div>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default RecentActivity;
