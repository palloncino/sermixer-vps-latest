import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { useBusinessSignature } from "../../../hooks/useBusinessSignature";
import { useDocumentContext } from "../../../state/documentContext";
import fallbackImage from "../../../media/fallbackProduct.png";
import { DocumentDataType } from "types";

const Input = styled('input')({
    display: 'none',
});

const SignaturePreview = styled('img')({
    width: '100%',
    height: '100%',
    objectFit: 'contain',
});

const DocumentFooter: React.FC = () => {
    const { signatureUrl, uploadSignature } = useBusinessSignature();
    const { updatedDocumentData, updateDocumentField } = useDocumentContext();
    const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(updatedDocumentData?.dateOfSignature || "");

    useEffect(() => {
        if (signatureUrl) {
            setSignaturePreview(signatureUrl);
        }
    }, [signatureUrl]);

    const handleSignatureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSignaturePreview(URL.createObjectURL(file));

            const formData = new FormData();
            formData.append("file", file);

            try {
                await uploadSignature(formData);
            } catch (error) {
                console.error("Error uploading signature:", error);
            }
        }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);
        updateDocumentField('dateOfSignature', newDate);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>Signature</Typography>
                <Box sx={{ height: 150, width: 250, border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                    <SignaturePreview src={signaturePreview || fallbackImage} alt="Signature Preview" />
                </Box>
                <label htmlFor="signature-upload">
                    <Input accept="image/*" id="signature-upload" type="file" onChange={handleSignatureChange} />
                    <Button variant="outlined" component="span">
                        Upload Signature
                    </Button>
                </label>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>Date</Typography>
                <TextField
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    sx={{ width: 200 }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default DocumentFooter;
