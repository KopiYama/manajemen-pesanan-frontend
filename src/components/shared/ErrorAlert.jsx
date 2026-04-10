import React from 'react';
import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <Box sx={{ my: 4 }}>
      <Alert 
        severity="error" 
        variant="filled"
        action={
          onRetry && (
            <Button color="inherit" size="small" startIcon={<Refresh />} onClick={onRetry}>
              Coba Lagi
            </Button>
          )
        }
      >
        <AlertTitle>Kesalahan</AlertTitle>
        {message || 'Terjadi masalah saat memuat data.'}
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
