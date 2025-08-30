import React, { useState } from 'react';
import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, readOnly }) => {
  return (
    <Box data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview={readOnly ? 'preview' : 'edit'}
        hideToolbar={readOnly}
        height={400}
        visibleDragbar={false}
      />
    </Box>
  );
};

interface EditableDescriptionProps {
  initialDescription: string;
  onSave: (newDescription: string) => void;
}

const EditableDescription: React.FC<EditableDescriptionProps> = ({ initialDescription, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription);

  const handleSave = () => {
    onSave(description); // Call the parent onSave function
    setIsEditing(false); // Switch back to view mode
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Component Description</Typography>
        <Tooltip title={isEditing ? 'Save' : 'Edit'}>
          <IconButton onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <MarkdownEditor
        value={description}
        onChange={setDescription}
        readOnly={!isEditing} // Enable editing based on the state
      />
    </Box>
  );
};

export default EditableDescription;
