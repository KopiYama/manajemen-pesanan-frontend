import React from 'react';
import { Box, Container } from '@mui/material';
import CustomerNavbar from './CustomerNavbar';
import { Outlet } from 'react-router-dom';

const CustomerLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CustomerNavbar />
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default CustomerLayout;
