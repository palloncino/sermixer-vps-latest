import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Box } from '@mui/material';

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

export default MarkdownEditor;
