import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Memuat data...' }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
      <CircularProgress size={60} thickness={4} />
      <Typography sx={{ mt: 2, fontWeight: 500, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
