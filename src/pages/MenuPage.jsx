import React, { useState, useEffect } from 'react';
import { 
  Grid, Card, CardContent, CardMedia, Typography, Button, 
  Box, Chip, Drawer, List, ListItem, ListItemText, 
  Divider, IconButton, TextField, InputAdornment, Stack,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import { Add, Remove, ShoppingCart, Search } from '@mui/icons-material';
import * as menuApi from '../api/menuApi';
import * as orderApi from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';
import fallbackImage from '../assets/233-2332677_image-500580-placeholder-transparent.jpeg';

// Base64 encoded SVG to avoid encoding issues with special characters like #
const FALLBACK_IMAGE = fallbackImage;

const fixImageUrl = (url) => {
  if (!url) return null;
  // Ganti host internal 'minio' ke 'localhost' untuk akses browser
  return url.replace('http://minio:9000', 'http://localhost:9000');
};

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [jenis, setJenis] = useState([]);
  const [selectedJenis, setSelectedJenis] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { items, addToCart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let menuRes, jenisRes;
      
      try {
        const [mRes, jRes] = await Promise.all([
          menuApi.getMenus(), 
          menuApi.getJenis()
        ]);
        menuRes = mRes;
        jenisRes = jRes;
      } catch (err) {
        console.warn('Gagal memuat kategori, mencoba memuat menu saja...', err);
        menuRes = await menuApi.getMenus();
        jenisRes = { data: [] };
      }

      const menuData = menuRes.data;
      setMenus(menuData);
      
      let typeLabels = [];
      if (jenisRes.data && jenisRes.data.length > 0) {
        typeLabels = jenisRes.data.map(j => j.namaJenis || j);
      } else {
        typeLabels = [...new Set(menuData.map(m => m.namaJenis))].filter(Boolean);
      }
      
      setJenis(['Semua', ...typeLabels]);
      setError(null);
    } catch (err) {
      setError('Gagal memuat menu. Pastikan Menu Service berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter(menu => {
    const matchesJenis = selectedJenis === 'Semua' || menu.namaJenis === selectedJenis;
    const matchesSearch = menu.namaMenu.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJenis && matchesSearch;
  });

  const handleCheckout = async () => {
    if (items.length === 0) {
      setSnackbar({ open: true, message: 'Keranjang belanja kosong', severity: 'warning' });
      return;
    }
    
    if (!customerName.trim() || !tableNumber.trim()) {
      setSnackbar({ open: true, message: 'Harap isi nama dan nomor meja', severity: 'warning' });
      return;
    }

    try {
      setCheckoutLoading(true);
      
      // Calculate total locally
      const localTotal = items.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
      
      // Format payload sesuai kebutuhan backend (Clean Architecture)
      const orderData = {
        customerName: `${customerName.trim()} (Meja ${tableNumber.trim()})`,
        totalPrice: localTotal,
        items: items.map(item => ({
          menuItem: item.namaMenu,
          quantity: item.quantity,
          price: item.harga
        }))
      };

      console.log('Sending Order Data:', orderData);

      const response = await orderApi.createOrder(orderData);
      
      if (response.data.success || response.data.id || response.data.data?.id) {
        const orderId = response.data.data?.id || response.data.id;
        setSnackbar({ open: true, message: 'Pesanan berhasil dibuat!', severity: 'success' });
        clearCart();
        setDrawerOpen(false);
        setCustomerName('');
        setTableNumber('');
        
        setTimeout(() => {
          navigate(`/track/${orderId}`);
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal membuat pesanan';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
      console.error('Checkout Error:', err.response?.data || err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Menyiapkan menu lezat untuk Anda..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Cari menu favoritmu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'white', borderRadius: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          {jenis.map((j) => (
            <Chip
              key={j}
              label={j}
              clickable
              color={selectedJenis === j ? "primary" : "default"}
              onClick={() => setSelectedJenis(j)}
              sx={{ fontWeight: 600, px: 1, flexShrink: 0 }}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {filteredMenus.map((menu) => (
          <Grid item xs={12} sm={6} md={4} key={menu.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={fixImageUrl(menu.imageUrl) || FALLBACK_IMAGE}
                  alt={menu.namaMenu}
                  sx={{ objectFit: 'cover' }}
                  onError={(e) => { 
                    if (e.target.src !== FALLBACK_IMAGE) {
                      e.target.src = FALLBACK_IMAGE;
                    }
                  }}
                />
                {!menu.isAvailable && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: 'inherit' }}>
                    <Chip label="Tidak Tersedia" color="error" sx={{ fontWeight: 'bold' }} />
                  </Box>
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {menu.namaMenu}
                  </Typography>
                  <Chip label={menu.namaJenis} size="small" color="secondary" variant="outlined" sx={{ fontWeight: 600 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '3em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {menu.deskripsi || 'Tidak ada deskripsi.'}
                </Typography>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
                  {formatRupiah(menu.harga)}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => addToCart(menu)}
                  disabled={!menu.isAvailable}
                  sx={{ borderRadius: 2, fontWeight: 'bold' }}
                >
                  Tambah
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
        {filteredMenus.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" py={10}>
              <Typography variant="h6" color="text.secondary">Menu tidak ditemukan.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {items.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<ShoppingCart />}
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            borderRadius: 50,
            boxShadow: '0 8px 25px rgba(255, 143, 0, 0.4)',
            px: 4,
            py: 2,
            zIndex: 1000,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          Konfirmasi Pesanan ({items.reduce((sum, item) => sum + item.quantity, 0)})
        </Button>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 450 }, borderRadius: { xs: 0, sm: '20px 0 0 20px' } } }}
      >
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>Detail Pesanan</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}><Remove /></IconButton>
          </Stack>
          
          <Stack spacing={2} mb={4}>
            <TextField
              fullWidth
              label="Nama Pelanggan"
              variant="outlined"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Nomor Meja"
              variant="outlined"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </Stack>

          <Divider sx={{ mb: 2 }} />
          
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {items.map((item) => (
              <ListItem key={item.id} disableGutters sx={{ py: 2 }}>
                <ListItemText
                  primary={item.namaMenu}
                  secondary={formatRupiah(item.harga)}
                  primaryTypographyProps={{ fontWeight: 700 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f5f5f5', borderRadius: 2, p: 0.5 }}>
                  <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography sx={{ fontWeight: 800, minWidth: 20, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Pembayaran</Typography>
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 900 }}>
                {formatRupiah(total)}
              </Typography>
            </Stack>
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              disabled={items.length === 0 || checkoutLoading}
              onClick={handleCheckout}
              sx={{ py: 2, borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              {checkoutLoading ? <CircularProgress size={24} color="inherit" /> : 'Pesan Sekarang'}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, fontWeight: 'bold' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MenuPage;
