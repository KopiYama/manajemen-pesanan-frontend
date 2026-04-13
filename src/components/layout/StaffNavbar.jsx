import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Kitchen, Settings, RestaurantMenu } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const StaffNavbar = () => {
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #eee', bgcolor: '#333', color: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/kitchen"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              color: 'primary.light',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <RestaurantMenu /> RestoApp <Box component="span" sx={{ fontSize: '0.8rem', bgcolor: 'primary.main', px: 1, borderRadius: 1, color: 'white', ml: 1 }}>STAFF</Box>
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              component={RouterLink} 
              to="/kitchen" 
              startIcon={<Kitchen />} 
              color="inherit"
              sx={{ borderBottom: location.pathname === '/kitchen' ? '2px solid' : 'none', borderRadius: 0 }}
            >
              Dapur
            </Button>
            <Button 
              component={RouterLink} 
              to="/admin" 
              startIcon={<Settings />} 
              color="inherit"
              sx={{ borderBottom: location.pathname === '/admin' ? '2px solid' : 'none', borderRadius: 0 }}
            >
              Manajemen Menu
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default StaffNavbar;
