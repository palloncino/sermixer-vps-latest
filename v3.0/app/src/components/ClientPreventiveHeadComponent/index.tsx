import BusinessIcon from "@mui/icons-material/Business";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import SubjectIcon from "@mui/icons-material/Subject";
import { Box, Divider, Grid, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppState } from "state/stateContext";
import Logo from "../../media/logo.png";
import { useDocumentContext } from '../../state/documentContext';
import { UserType } from '../../types';
import packageJson from '../../../package.json';

const ClientPreventiveHeadComponent = memo(() => {
  const { t } = useTranslation();
  const { updatedDocumentData, originalDocumentData, updateNestedDocumentField } = useDocumentContext();
  const { user, getUsers, users } = useAppState();
  const [theEmployee, setTheEmployee] = useState<UserType>();
  const [objectEditMode, setObjectEditMode] = useState(false);
  const [descriptionEditMode, setDescriptionEditMode] = useState(false);
  const [objectValue, setObjectValue] = useState(updatedDocumentData?.data?.quoteHeadDetails?.object || "");
  const [descriptionValue, setDescriptionValue] = useState(updatedDocumentData?.data?.quoteHeadDetails?.description || "");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const result = users.find(({ id }) => `${id}` === `${originalDocumentData?.employeeID}`);
    if (result) {
      setTheEmployee(result);
    }
  }, [users, originalDocumentData?.employeeID]);

  useEffect(() => {
    if (updatedDocumentData) {
      setObjectValue(updatedDocumentData.data.quoteHeadDetails?.object || "");
      setDescriptionValue(updatedDocumentData.data.quoteHeadDetails?.description || "");
    }
  }, [updatedDocumentData]);

  const handleObjectChange = useCallback(() => {
    updateNestedDocumentField(['data', 'quoteHeadDetails', 'object'], objectValue);
    setObjectEditMode(false);
  }, [updateNestedDocumentField, objectValue]);

  const handleDescriptionChange = useCallback(() => {
    updateNestedDocumentField(['data', 'quoteHeadDetails', 'description'], descriptionValue);
    setDescriptionEditMode(false);
  }, [updateNestedDocumentField, descriptionValue]);

  // Check if the user is defined; if not, make the component readonly
  const isReadOnly = !user?.id;

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', ml: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
              <img src={Logo} alt="Logo" style={{ height: 80 }} />
              <Typography variant="caption" sx={{ 
                color: 'text.secondary', 
                fontSize: '0.75rem', 
                fontWeight: 500,
                alignSelf: 'flex-end',
                mb: 1
              }}>
                v{packageJson.version}
              </Typography>
            </Box>
            <Typography variant="h4">
              {originalDocumentData?.data?.quoteHeadDetails?.company || "NA"}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" gutterBottom>{t("Employee")}</Typography>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon />
                <Typography variant="body2" ml={1}>{t("Name")}: {theEmployee?.username || "NA"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon />
                <Typography variant="body2" ml={1}>{t("Email")}: {theEmployee?.email || "NA"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon />
                <Typography variant="body2" ml={1}>{t("Company")}: {theEmployee?.companyName || "NA"}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" gutterBottom>{t("Client")}</Typography>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon />
                <Typography variant="body2" ml={1}>{t("Name")}: {`${originalDocumentData?.data?.selectedClient?.firstName || ""} ${originalDocumentData?.data?.selectedClient?.lastName || ""}`.trim() || "NA"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon />
                <Typography variant="body2" ml={1}>{t("Email")}: {originalDocumentData?.data?.selectedClient?.email || "NA"}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon />
                <Typography variant="body2" ml={1}>{t("Company")}: {originalDocumentData?.data?.selectedClient?.companyName || "NA"}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <SubjectIcon />
          {objectEditMode ? (
            <>
              <TextField
                variant="standard"
                value={objectValue}
                onChange={(e) => setObjectValue(e.target.value)}
                fullWidth
                disabled={isReadOnly} // Disable if readonly
              />
              {!isReadOnly && (
                <IconButton onClick={handleObjectChange}>
                  <SaveIcon />
                </IconButton>
              )}
            </>
          ) : (
            <>
              <Typography variant="body2">{objectValue || "NA"}</Typography>
              {!isReadOnly && (
                <IconButton onClick={() => setObjectEditMode(true)}>
                  <EditIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <DescriptionIcon />
          {descriptionEditMode ? (
            <>
              <TextField
                variant="standard"
                value={descriptionValue}
                onChange={(e) => setDescriptionValue(e.target.value)}
                fullWidth
                disabled={isReadOnly} // Disable if readonly
              />
              {!isReadOnly && (
                <IconButton onClick={handleDescriptionChange}>
                  <SaveIcon />
                </IconButton>
              )}
            </>
          ) : (
            <>
              <Typography variant="body2">{descriptionValue || "NA"}</Typography>
              {!isReadOnly && (
                <IconButton onClick={() => setDescriptionEditMode(true)}>
                  <EditIcon />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

export default ClientPreventiveHeadComponent;
