import React from 'react';
import { Box, Container } from '@mui/material';
import StaffNavbar from './StaffNavbar';
import { Outlet } from 'react-router-dom';

const StaffLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f4f4' }}>
      <StaffNavbar />
      <Container maxWidth="xl" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default StaffLayout;
