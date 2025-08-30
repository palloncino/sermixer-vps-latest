import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, IconButton, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const FileUpload = ({ onFilesUploaded, initialFiles }) => {
  const { t } = useTranslation();

  // Filter out files with empty URLs
  const [files, setFiles] = useState(
    Array.isArray(initialFiles) ? initialFiles.filter(file => file.url) : []
  );

  useEffect(() => {
    onFilesUploaded(files);
  }, [files, onFilesUploaded]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).map((file: any) => ({
      name: file.name,
      file: file, // Store the actual file object
      url: URL.createObjectURL(file) // Create a temporary URL for the file
    }));
    const newFiles = [...files, ...selectedFiles].slice(0, 5); // Limit to 5 files
    setFiles(newFiles);
  };

  const handleRemoveFile = (fileName) => {
    setFiles(files.map(file =>
      file.name === fileName ? { ...file, url: '' } : file
    ));
  };

  const handleOpenFile = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(6, 1fr)"
        gap={2}
        alignItems="center"
      >
        <Box
          component="label"
          htmlFor="upload-files"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="150px"
          bgcolor="#F4F4F4"
          border="1px solid #ccc"
          borderRadius="4px"
          sx={{ cursor: 'pointer' }}
        >
          <UploadFileIcon />
          <Typography>{t("UploadFile")}</Typography>
          <input
            accept=".pdf"
            style={{ display: "none" }}
            id="upload-files"
            name="pdfFiles"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </Box>
        {files.map((file, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="150px"
            border="1px solid #ccc"
            borderRadius="4px"
            position="relative"
            sx={{
              cursor: file.url ? 'pointer' : 'not-allowed',
              backgroundColor: file.url ? 'white' : '#FFEBEB',
              padding: 1,
            }}
          >
            <PictureAsPdfIcon style={{ marginBottom: 8 }} />
            <LinkPDF onClick={() => handleOpenFile(file.url)}>{file.name}</LinkPDF>
            <IconButton
              size="small"
              color="secondary"
              onClick={() => handleRemoveFile(file.name)}
              sx={{ position: 'absolute', top: 4, right: 4 }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        {Array.from({ length: 5 - files.length }).map((_, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="150px"
            border="1px solid #ccc"
            borderRadius="4px"
            bgcolor="#F4F4F4"
          />
        ))}
      </Box>
    </Box>
  );
};

export default FileUpload;

const LinkPDF = styled(Typography)`
  padding: 0 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 120px; // Set a fixed width
  text-align: center;
  &:hover {
    text-decoration: underline;
  }
`;
