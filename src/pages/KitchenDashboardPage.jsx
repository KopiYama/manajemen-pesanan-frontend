import React, { useState, useEffect, useCallback } from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, 
  Button, Chip, Divider, List, ListItem, ListItemText 
} from '@mui/material';
import { PlayArrow, Check, DoneAll, AccessTime, Payments, Money } from '@mui/icons-material';
import { getKitchenQueue, getKitchenInProgress, getKitchenReady, updateOrderStatus } from '../api/kitchenApi';
import * as paymentApi from '../api/paymentApi';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorAlert from '../components/shared/ErrorAlert';

const KitchenDashboardPage = () => {
  const [queued, setQueued] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [ready, setReady] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [qRes, pRes, rRes] = await Promise.all([
        getKitchenQueue(),
        getKitchenInProgress(),
        getKitchenReady()
      ]);
      setQueued(qRes.data || []);
      setInProgress(pRes.data || []);
      setReady(rRes.data || []);
      setError(null);
    } catch (err) {
      setError('Gagal memuat data dapur.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      fetchData();
    } catch (err) {
      alert('Gagal memperbarui status pesanan.');
    }
  };

  const handlePayCash = async (orderId, amount) => {
    try {
      await paymentApi.payByCash(orderId, amount);
      alert('Pembayaran tunai berhasil dicatat!');
      fetchData();
    } catch (err) {
      console.error('Cash Payment Error:', err);
      alert('Gagal mencatat pembayaran tunai.');
    }
  };

  if (loading) return <LoadingSpinner message="Menghubungkan ke Dapur..." />;
  if (error) return <ErrorAlert message={error} onRetry={fetchData} />;

  const KanbanColumn = ({ title, orders = [], color, icon, nextStatus, buttonText, buttonIcon }) => (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 3, height: '100%', minHeight: '70vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, px: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Chip label={orders.length} size="small" sx={{ ml: 'auto', fontWeight: 700, bgcolor: color, color: 'white' }} />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Card key={order.id} sx={{ borderRadius: 2, borderLeft: `6px solid ${color}` }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    #{ (order.orderId || order.id).toString().slice(-6).toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt || order.orderDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Pelanggan: {order.customerName}
                </Typography>

                <Box sx={{ mb: 1.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    size="small" 
                    icon={order.paymentMethod === 'CASH' ? <Money /> : <Payments />}
                    label={order.paymentMethod === 'CASH' ? 'TUNAI' : 'ONLINE'} 
                    variant="outlined"
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                  <Chip 
                    size="small" 
                    label={order.paymentStatus === 'PAID' ? 'LUNAS' : 'BELUM BAYAR'} 
                    color={order.paymentStatus === 'PAID' ? 'success' : 'error'}
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                  />
                </Box>

                <List dense disablePadding>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.25 }}>
                        <ListItemText 
                          primary={`${item.quantity}x ${item.menuItem || item.menuNama}`} 
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                        />
                      </ListItem>
                    ))
                  ) : order.menuItem ? (
                    <ListItem sx={{ px: 0, py: 0.25 }}>
                      <ListItemText 
                        primary={`${order.quantity || 1}x ${order.menuItem}`} 
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      />
                    </ListItem>
                  ) : (
                    <Typography variant="caption" color="error">Detail menu tidak tersedia</Typography>
                  )}
                </List>

                {order.paymentStatus === 'UNPAID' && order.paymentMethod === 'CASH' && (
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<Payments />}
                    onClick={() => handlePayCash(order.orderId || order.id, order.totalPrice)}
                    sx={{ mt: 2, fontWeight: 'bold' }}
                  >
                    Bayar Tunai
                  </Button>
                )}

                {nextStatus && (
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={buttonIcon}
                    onClick={() => handleUpdateStatus(order.orderId || order.id, nextStatus)}
                    sx={{ mt: 2, bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}
                  >
                    {buttonText}
                  </Button>
                )}
                {order.status === 'READY_TO_SERVE' && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<DoneAll />}
                    onClick={() => handleUpdateStatus(order.orderId || order.id, 'COMPLETED')}
                    sx={{ mt: 2, borderColor: color, color: color }}
                  >
                    Selesaikan
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {orders.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}>
              Tidak ada pesanan
            </Typography>
          )}
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Dapur Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', gap: 0.5 }}>
          <AccessTime fontSize="small" />
          <Typography variant="caption">Auto-refresh 15s</Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <KanbanColumn 
          title="Antrian" 
          orders={queued} 
          color="#D32F2F" 
          icon={<AccessTime color="error" />}
          nextStatus="IN_PROGRESS"
          buttonText="Mulai Masak"
          buttonIcon={<PlayArrow />}
        />
        <KanbanColumn 
          title="Sedang Dimasak" 
          orders={inProgress} 
          color="#FF8F00" 
          icon={<PlayArrow sx={{ color: '#FF8F00' }} />}
          nextStatus="READY_TO_SERVE"
          buttonText="Siap Saji"
          buttonIcon={<Check />}
        />
        <KanbanColumn 
          title="Siap Disajikan" 
          orders={ready} 
          color="#2E7D32" 
          icon={<Check color="success" />}
        />
      </Grid>
    </Box>
  );
};

export default KitchenDashboardPage;
