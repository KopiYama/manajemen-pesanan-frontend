import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';
import { CartProvider } from './context/CartContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout.jsx';
import StaffLayout from './components/layout/StaffLayout.jsx';

// Pages
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
              {/* Customer Routes */}
              <Route path="/" element={<CustomerLayout />}>
                <Route index element={<Navigate to="/menu" replace />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="track/:id" element={<OrderTrackingPage />} />
              </Route>

              {/* Staff Routes */}
              <Route path="/" element={<StaffLayout />}>
                <Route path="kitchen" element={<KitchenDashboardPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>

              {/* Catch all - Redirect to menu */}
              <Route path="*" element={<Navigate to="/menu" replace />} />
            </Routes>
          </OrderProvider>
        </CartProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
