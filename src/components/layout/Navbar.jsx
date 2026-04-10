import React from 'react';
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box, Container } from '@mui/material';
import { ShoppingCart, RestaurantMenu, ReceiptLong, Kitchen, Settings } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { items } = useCart();
  const location = useLocation();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Hanya tampilkan cart icon di halaman menu (sesuai spesifikasi)
  const isMenuPage = location.pathname === '/menu' || location.pathname === '/';

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid #eee', bgcolor: 'white', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              color: 'primary.main',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <RestaurantMenu /> RestoApp
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 } }}>
            <Button component={RouterLink} to="/menu" startIcon={<RestaurantMenu />} color="inherit">Menu</Button>
            <Button component={RouterLink} to="/kitchen" startIcon={<Kitchen />} color="inherit">Dapur</Button>
            <Button component={RouterLink} to="/admin" startIcon={<Settings />} color="inherit">Admin</Button>
            
            {isMenuPage && (
              <IconButton color="primary">
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
