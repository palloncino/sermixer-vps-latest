// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import SaveAsIcon from '@mui/icons-material/SaveAs';
// import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, IconButton, Typography } from '@mui/material';
// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import styled, { css, keyframes } from 'styled-components';
// import { useAppState } from '../../state/stateContext';
// import { isAdmin, isUser } from '../../utils/isWho';

// const shine = keyframes`
//   0% {
//     background-position: -200% 0;
//   }
//   100% {
//     background-position: 200% 0;
//   }
// `;

// const recurringShine = css`
//   background: linear-gradient(
//     to left,
//     rgba(255, 255, 255, 0.1) 0%,
//     rgba(255, 255, 255, 0.3) 20%,
//     rgba(255, 255, 255, 0.1) 40%,
//     rgba(255, 255, 255, 0.1) 100%
//   );
//   background-size: 200% auto;
//   animation: ${shine} 1.5s linear infinite;
// `;

// const DrawerContainer = styled(Box)`
//   position: fixed;
//   right: 0;
//   top: 100px;
//   height: calc(100vh - 100px); // full height - Navbar
//   z-index: 1000;
//   display: flex;
//   align-items: center;
// `;

// const Handle = styled(Box) <{ has_changes: string; is_open: boolean }>`
//   background-color: ${(props) => (props.has_changes === 'true' ? '#66B2F0 !important' : '#333 !important')};
//   color: white;
//   padding: 0.5rem;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-top-left-radius: 10px;
//   border-bottom-left-radius: 10px;
//   position: relative;
//   right: ${(props) => (props.is_open ? '300px' : '0')};
//   transition: right 0.3s ease;
//   z-index: 1001;

//   ${(props) => props.has_changes === 'true' && css`
//     ${recurringShine}
//   `}
// `;

// const Drawer = styled(Box) <{ is_open: boolean }>`
//   width: 300px;
//   height: 100%;
//   background-color: white;
//   box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
//   border-left: 2px solid #ccc;
//   transform: translateX(${(props) => (props.is_open ? '0' : '100%')});
//   transition: transform 0.3s ease;
//   padding: 1rem;
//   position: absolute;
//   right: 0;
//   top: 0;
//   display: flex;
//   flex-direction: column;
// `;

// const ActionsWrapper = styled(Box)`
//   display: flex;
//   flex-direction: column;
//   gap: 1rem;
// `;

// const ShiningButton = styled(Button) <{ has_changes: boolean }>`
//   background-color: ${(props) => (props.has_changes === true ? 'dodgerblue !important' : '#333 !important')};
//   width: 100%;
//   color: white;
//   ${(props) => props.has_changes && css`
//     ${recurringShine}
//   `}
// `;

// const RejectActionButton = styled(Button)`
//   width: 100%;
// `;

// const ActionButton = styled(Button)`
//   width: 100%;
// `;

// const DescriptionText = styled(Typography)`
//   color: grey;
//   font-size: 0.8rem;
//   word-wrap: break-word;
//   white-space: pre-wrap;
//   margin-top: 0.5rem;
// `;

// const ChangesContainer = styled(Box)`
//   flex: 1;
//   overflow-y: auto;
// `;

// const FixedActionButtons: React.FC<any> = ({
//   displayChanges = false,
//   currentChanges = [],
//   documentReadOnly,
//   handleSave,
//   handleSubmit,
//   handleDiscard,
//   handleGeneratePDF,
//   handleReject
// }) => {
//   const { t } = useTranslation();
//   const { user } = useAppState();
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   const toggleDrawer = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <DrawerContainer>
//       <Handle
//         key={currentChanges.length}  // Keying by currentChanges length to retrigger animation
//         onClick={toggleDrawer}
//         is_open={isOpen}
//         has_changes={(currentChanges.length > 0).toString()}
//       >
//         <IconButton style={{ color: 'white' }} size="large">
//           <SaveAsIcon />
//         </IconButton>
//       </Handle>
//       <Drawer is_open={isOpen}>
//         <Box mb={2} textAlign={'center'}>
//           <Typography variant="h5"><strong>{t('Actions')}</strong></Typography>
//         </Box>
//         <ActionsWrapper>
//           {isAdmin(user) && isUser(user) ? (
//             <>
//               {handleDiscard && (
//                 <Box>
//                   <ActionButton variant="contained" color="primary" onClick={handleDiscard}>
//                     {t('DiscardChanges')}
//                   </ActionButton>
//                   <DescriptionText>{t('HandleDiscardDescription')}</DescriptionText>
//                   <Divider />
//                 </Box>
//               )}
//               {handleSave && (
//                 <Box>
//                   <ShiningButton variant="contained" onClick={handleSave} has_changes={currentChanges.length > 0}>
//                     {/* {t('SaveChanges')} */}BUBU
//                   </ShiningButton>
//                   <DescriptionText>{t('HandleSaveDescription')}</DescriptionText>
//                   <Divider />
//                 </Box>
//               )}
//               {handleGeneratePDF && (
//                 <Box>
//                   <ActionButton variant="contained" color="primary" onClick={handleGeneratePDF}>
//                     {t('GeneratePDF')}
//                   </ActionButton>
//                   <DescriptionText>{t('HandleGeneratePDFDescription')}</DescriptionText>
//                   <Divider />
//                 </Box>
//               )}
//               {handleReject && (
//                 <Box>
//                   <RejectActionButton variant="outlined" color="primary" onClick={handleReject}>
//                     {t('RejectDocument')}
//                   </RejectActionButton>
//                   <DescriptionText>{t('HandleRejectDescription')}</DescriptionText>
//                   <Divider />
//                 </Box>
//               )}
//             </>
//           ) : (
//             handleSave ? (
//               <Typography>{t('DocumentReadOnly')}</Typography>
//             ) : (
//               <Box>
                
//                 <DescriptionText>{t('HandleSaveDescription')}</DescriptionText>
//                 <Divider />
//               </Box>
//             )
//           )}
//         </ActionsWrapper>
//         {displayChanges ? (
//           <ChangesContainer>
//             <Box mt={2} mb={2} textAlign="center">
//               <Typography variant="h6">{t('CurrentChanges')}</Typography>
//             </Box>
//             {currentChanges.length > 0 ? currentChanges.map((change, index) => (
//               <Accordion key={index}>
//                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                   <Typography>{change.name}</Typography>
//                 </AccordionSummary>
//                 <AccordionDetails>
//                   <Typography>{change.description}</Typography>
//                 </AccordionDetails>
//               </Accordion>
//             )) : (
//               <Typography variant="body2">{t('NoChanges')}</Typography>
//             )}
//           </ChangesContainer>
//         ) : ""}
//       </Drawer>
//     </DrawerContainer>
//   );
// };

// export default FixedActionButtons;
