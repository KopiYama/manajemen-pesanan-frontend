import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Paper, Stepper, Step, StepLabel, 
  Divider, List, ListItem, ListItemText, Chip, Button,
  Card, CardContent
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../api/orderApi';
import { ArrowBack, Receipt, AccessTime, CheckCircle } from '@mui/icons-material';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';

const steps = [
  { label: 'Pesanan Diterima', status: 'QUEUED' },
  { label: 'Sedang Dimasak', status: 'IN_PROGRESS' },
  { label: 'Siap Disajikan', status: 'READY_TO_SERVE' },
  { label: 'Selesai', status: 'COMPLETED' }
];

const getActiveStep = (status) => {
  switch (status) {
    case 'PENDING':
    case 'QUEUED': return 0;
    case 'IN_PROGRESS': return 1;
    case 'READY_TO_SERVE': return 2;
    case 'COMPLETED': return 3;
    default: return 0;
  }
};

const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    try {
      const response = await getOrderById(id);
      // Backend returns { success: true, data: { ... } }
      const orderData = response.data.data || response.data;
      
      // Map single menuItem to items array if needed for the UI
      if (orderData && !orderData.items && orderData.menuItem) {
        orderData.items = [{
          id: 'single-item',
          menuNama: orderData.menuItem,
          quantity: orderData.quantity,
          hargaAtOrder: orderData.totalPrice / orderData.quantity
        }];
      }
      
      setOrder(orderData);
      setError(null);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Gagal memuat detail pesanan.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) return <LoadingSpinner message="Mengecek status pesanan Anda..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchOrder} />;
  if (!order) return <ErrorAlert message="Pesanan tidak ditemukan." />;

  const activeStep = getActiveStep(order.status);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/menu')} 
        sx={{ mb: 3 }}
      >
        Kembali ke Menu
      </Button>

      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4, borderRadius: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
              #{order.id.toString().slice(-6).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID Pesanan: {order.id}
            </Typography>
          </Box>
          <Chip 
            label={order.status.replace(/_/g, ' ')} 
            color={order.status === 'COMPLETED' ? 'success' : 'primary'} 
            variant="filled" 
            sx={{ fontWeight: 700, px: 2 }}
          />
        </Box>

        <Box sx={{ mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel={window.innerWidth > 600}>
            {steps.map((step) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt fontSize="small" /> Ringkasan Pesanan
        </Typography>

        <List disablePadding>
          {order.items && order.items.map((item, idx) => (
            <ListItem key={item.id || idx} sx={{ py: 1.5, px: 0 }}>
              <ListItemText
                primary={`${item.quantity}x ${item.menuItem}`}
                secondary={formatRupiah(item.price)}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              <Typography sx={{ fontWeight: 700 }}>
                {formatRupiah(item.price * item.quantity)}
              </Typography>
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <ListItem sx={{ px: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Total Pembayaran</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
              {formatRupiah(order.totalPrice)}
            </Typography>
          </ListItem>
        </List>
      </Paper>

      {order.status === 'READY_TO_SERVE' && (
        <Card sx={{ bgcolor: 'secondary.light', mb: 4, borderRadius: 4, border: '2px dashed', borderColor: 'secondary.main' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '24px !important' }}>
            <CheckCircle color="secondary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'secondary.contrastText' }}>
                Pesanan Siap!
              </Typography>
              <Typography variant="body1">
                Silakan ambil pesanan Anda di konter pengambilan.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <AccessTime fontSize="inherit" /> Halaman ini akan diperbarui otomatis setiap 10 detik
        </Typography>
      </Box>
    </Box>
  );
};

export default OrderTrackingPage;
