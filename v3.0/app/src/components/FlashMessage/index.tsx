import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface FlashMessageProps {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

function FlashMessage({ message, type }: FlashMessageProps) {
  return (
    <>
      <Box py={2}>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert 
            severity={type}
            sx={{
              ...(type === 'success' && {
                backgroundColor: '#4caf50', // Brighter green
                color: 'white',
                '& .MuiAlert-icon': {
                  color: 'white'
                }
              })
            }}
          >
            {message}
          </Alert>
        </Stack>
      </Box>
    </>
  );
}

export default FlashMessage;
