import React, { useRef } from 'react';
import { Box, Button, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '200px',
  position: 'relative',
  overflow: 'hidden',
  '&:hover .upload-overlay': {
    opacity: 1,
  },
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top',
}));

const UploadOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  opacity: 0,
  transition: 'opacity 0.3s',
}));

interface ImageUploadProps {
  previewUrl: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  imageStyle?: React.CSSProperties;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ previewUrl, onChange, label, imageStyle }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ImagePreviewContainer onClick={handleClick}>
      <ImagePreview style={{ backgroundImage: `url(${previewUrl})`, ...imageStyle }} />
      <UploadOverlay className="upload-overlay">
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: 'black' }}
        >
          {label}
        </Button>
      </UploadOverlay>
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={onChange}
        accept="image/*"
      />
    </ImagePreviewContainer>
  );
};

export default ImageUpload;