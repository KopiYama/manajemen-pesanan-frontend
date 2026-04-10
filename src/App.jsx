import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import Layout from './components/layout/Layout.jsx';
import MenuPage from './pages/MenuPage.jsx';
import OrderTrackingPage from './pages/OrderTrackingPage.jsx';
import KitchenDashboardPage from './pages/KitchenDashboardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <CartProvider>
          <OrderProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/menu" replace />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="track/:id" element={<OrderTrackingPage />} />
                <Route path="kitchen" element={<KitchenDashboardPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </OrderProvider>
        </CartProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
