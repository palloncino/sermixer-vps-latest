import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { dateText } from '../../../utils/date-text.ts';

const DrawerContainer = styled(Box)`
  position: fixed;
  left: 0;
  top: 100px;
  height: calc(100vh - 100px - 64px); // full height - Navbar - StepProgres
  z-index: 1000;
  display: flex;
  align-items: center;
`;

const Handle = styled(Box)<{ is_open: string }>`
  background-color: #333;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: relative;
  left: ${(props) => (props.is_open === 'true' ? '550px' : '0')};
  transition: left 0.3s ease;
  z-index: 1001;
`;

const Drawer = styled(Box)<{ is_open: string }>`
  width: 550px;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border: 2px solid #ccc;
  transform: translateX(${(props) => (props.is_open === 'true' ? '0' : '-100%')});
  transition: transform 0.3s ease;
  padding: 1rem;
  position: absolute;
  left: 0;
  height: calc(100vh - 100px - 64px); // full height - Navbar - StepProgres
  overflow-y: auto;
`;

const ActionsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const LogHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const parseChangeDetails = (details, t) => {
  const regex = /__from__(.*?)__to__(.*?)(?=$|__from__)/g;
  let match;
  const parts = [];

  while ((match = regex.exec(details)) !== null) {
    let from = match[1];
    let to = match[2];

    try {
      from = JSON.parse(match[1]);
    } catch (e) { }

    try {
      to = JSON.parse(match[2]);
    } catch (e) { }

    parts.push({
      from,
      to,
    });
  }

  return parts;
};

const unescapeString = (str) => {
  return str.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
};

const renderLogContent = (content) => {
  if (!content || typeof content !== 'string') return null;

  const base64Regex = /^data:image\/(png|jpeg|gif|bmp);base64,/;
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;

  if (base64Regex.test(content.trim())) {
    return <img src={content} alt="Base64 Image" style={{ width: '50px', height: '50px' }} />;
  } else if (urlRegex.test(content.trim())) {
    return <img src={content} alt="Image URL" style={{ width: '50px', height: '50px' }} />;
  }

  return <ReactMarkdown>{unescapeString(content)}</ReactMarkdown>;
};

const renderChangeDetails = (details, t) => {
  const parts = parseChangeDetails(details, t);

  return (
    <Box>
      {parts.map((part, index) => (
        <Box key={index} component="span" display="block" mb={2}>
          <Box component="span" style={{ textDecoration: 'line-through', color: 'grey' }}>
            {renderLogContent(part.from)}
          </Box>
          <Box component="span" style={{ color: '#333' }}>
            {renderLogContent(part.to)}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const HistoryLogs = ({ history }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Sort history in reverse chronological order
  const sortedHistory = history ? [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) : [];

  return (
    <DrawerContainer>
      <Handle onClick={toggleDrawer} is_open={isOpen.toString()}>
        <IconButton style={{ color: 'white' }} size="large">
          <HistoryIcon />
        </IconButton>
      </Handle>
      <Drawer is_open={isOpen.toString()}>
        <ActionsWrapper>
          <Box mb={2} textAlign={'center'}>
            <Typography variant="h5"><strong>{t('HistoryLogs')}</strong></Typography>
          </Box>
          {Array.isArray(sortedHistory) && sortedHistory.length > 0 ? (
            sortedHistory.map((log, index) => (
              <Accordion key={index} sx={{ margin: 0 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <LogHeader>
                    <Typography variant="body2"><strong>{log.action}</strong></Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dateText(log.timestamp)}
                    </Typography>
                  </LogHeader>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    {renderChangeDetails(log.details, t)}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography variant="body2">{t('NoHistory')}</Typography>
          )}
        </ActionsWrapper>
      </Drawer>
    </DrawerContainer>
  );
};

export default HistoryLogs;
