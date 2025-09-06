import React, { useCallback, useRef, useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Box } from '@mui/material';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = React.memo(({ value, onChange, readOnly }) => {
    // Use internal state to prevent external value oscillations
    const [internalValue, setInternalValue] = useState(value);
    const onChangeRef = useRef(onChange);
    const lastExternalValueRef = useRef(value);
    const isUpdatingFromExternalRef = useRef(false);
    
    // Update the ref when onChange changes
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    
    // Only update internal value when external value actually changes
    useEffect(() => {
        if (value !== lastExternalValueRef.current && !isUpdatingFromExternalRef.current) {
            lastExternalValueRef.current = value;
            setInternalValue(value);
        }
    }, [value]);
    
    const handleChange = useCallback((val: string | undefined) => {
        const newValue = val || '';
        
        // Only update if the value actually changed
        if (internalValue === newValue) {
            return;
        }
        
        // Update internal state immediately for responsive UI
        setInternalValue(newValue);
        
        // Update external state
        isUpdatingFromExternalRef.current = true;
        onChangeRef.current(newValue);
    }, [internalValue]);

    return (
        <Box data-color-mode="light">
            <MDEditor
                value={internalValue}
                onChange={handleChange}
                preview={readOnly ? 'preview' : 'edit'}
                hideToolbar={readOnly}
                height={400}
                visibleDragbar={false}
            />
        </Box>
    );
}, (prevProps, nextProps) => {
    // Only re-render if the value actually changed or readOnly changed
    return (
        prevProps.value === nextProps.value &&
        prevProps.readOnly === nextProps.readOnly &&
        prevProps.onChange === nextProps.onChange
    );
});

MarkdownEditor.displayName = 'MarkdownEditor';

export default MarkdownEditor;
