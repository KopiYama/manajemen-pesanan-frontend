import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Container, Button } from '@mui/material';
import { ShoppingCart, RestaurantMenu, ReceiptLong } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CustomerNavbar = () => {
  const { items } = useCart();
  const location = useLocation();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Check if we are on the menu page to show the cart badge
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

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={RouterLink} to="/menu" color={isMenuPage ? "primary" : "inherit"} sx={{ fontWeight: 700 }}>
              Menu
            </Button>
            
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

export default CustomerNavbar;
