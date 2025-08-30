import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Box, Button, IconButton, Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from "@mui/icons-material/Delete";

interface SignaturePadProps {
  onSave: (signature: string) => void;
  initialSignature?: string | null;
  heading: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, initialSignature, heading }) => {
  const { t } = useTranslation();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [savedSignature, setSavedSignature] = useState<string | null>(initialSignature || null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleClear = () => {
    sigCanvas.current?.clear();
    setSavedSignature(null);
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
    if (signatureData) {
      setSavedSignature(signatureData);
      onSave(signatureData);
      setHasUnsavedChanges(false);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSavedSignature(result);
        onSave(result);
        setHasUnsavedChanges(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeginDrawing = () => {
    setHasUnsavedChanges(true);
  };

  useEffect(() => {
    if (sigCanvas.current && initialSignature) {
      sigCanvas.current.clear();
      const img = new Image();
      img.onload = () => {
        sigCanvas.current?.getCanvas().getContext("2d")?.drawImage(img, 0, 0);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const resetState = () => {
    setSavedSignature(null);
    setHasUnsavedChanges(false);
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const handleDrawClick = () => {
    setIsDrawing(true);
    resetState();
  };

  const handleUploadClick = () => {
    setIsDrawing(false);
    resetState();
  };

  return (
    <Box>
      <HeaderContainer>
        <Typography variant="h5">{heading}</Typography>
        <ButtonGroup>
          <Button
            onClick={handleDrawClick}
            variant={isDrawing ? 'contained' : 'outlined'}
          >
            {t('Draw')}
          </Button>
          <Button
            onClick={handleUploadClick}
            variant={!isDrawing ? 'contained' : 'outlined'}
          >
            {t('Upload')}
          </Button>
        </ButtonGroup>
      </HeaderContainer>
      <SignatureContainer>
        {isDrawing ? (
          <SignatureCanvas
            ref={sigCanvas}
            penColor="#333"
            onBegin={handleBeginDrawing}
            canvasProps={{
              width: 400,
              height: 200,
              className: 'sigCanvas',
              margin: '0!important'
            }}
          />
        ) : (
          <UploadContainer>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="upload-signature"
              type="file"
              onChange={handleUpload}
            />
            <label htmlFor="upload-signature">
              <IconButton color="primary" aria-label="upload picture" component="span">
                <PhotoCamera />
              </IconButton>
            </label>
            {savedSignature && <StyledImage src={savedSignature} alt="Signature" />}
          </UploadContainer>
        )}
      </SignatureContainer>
      <ButtonContainer>
        {isDrawing && (
          <Button
            onClick={handleSave}
            variant={hasUnsavedChanges ? "contained" : "outlined"}
            color="primary"
          >
            {t('Save')}
          </Button>
        )}
        <Button onClick={handleClear} variant="outlined">
          <DeleteIcon />
        </Button>
      </ButtonContainer>
    </Box>
  );
};

const HeaderContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto 1rem auto;
  width: 400px;
`;

const ButtonGroup = styled(Box)`
  display: flex;
  gap: 8px;
`;

const SignatureContainer = styled(Box)`
  border: 1px solid #00000035;
  border-radius: 4px;
  width: 400px;
  height: 200px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto 1rem auto;
`;

const UploadContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

export default SignaturePad;
