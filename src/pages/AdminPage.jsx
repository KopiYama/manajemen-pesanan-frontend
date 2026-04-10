import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  TablePagination,
  Avatar,
  Stack,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import * as menuApi from '../api/menuApi';
import fallbackImage from '../assets/233-2332677_image-500580-placeholder-transparent.jpeg';

// Base64 encoded SVG to avoid encoding issues with special characters like #
const FALLBACK_IMAGE = fallbackImage;

const fixImageUrl = (url) => {
  if (!url) return null;
  // Ganti host internal 'minio' ke 'localhost' untuk akses browser
  return url.replace('http://minio:9000', 'http://localhost:9000');
};

const AdminPage = () => {
  const [menus, setMenus] = useState([]);
  const [jenisList, setJenisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [formData, setFormData] = useState({
    namaMenu: '',
    deskripsi: '',
    harga: '',
    jenisId: '',
    isAvailable: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
          menuApi.getJenis(),
        ]);
        menuRes = mRes;
        jenisRes = jRes;
      } catch (err) {
        console.warn('Gagal memuat kategori, mencoba memuat menu saja...', err);
        menuRes = await menuApi.getMenus();
        const uniqueJenis = [...new Set(menuRes.data.map(m => m.namaJenis))].filter(Boolean);
        jenisRes = { data: uniqueJenis.map((name, index) => ({ id: index + 1, namaJenis: name })) };
      }
      
      setMenus(menuRes.data);
      setJenisList(jenisRes.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data menu. Pastikan Menu Service berjalan.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditMode(false);
    setSelectedMenu(null);
    setFormData({
      namaMenu: '',
      deskripsi: '',
      harga: '',
      jenisId: jenisList.length > 0 ? jenisList[0].id : '',
      isAvailable: true,
    });
    setSelectedFile(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (menu) => {
    setEditMode(true);
    setSelectedMenu(menu);
    setFormData({
      namaMenu: menu.namaMenu,
      deskripsi: menu.deskripsi || '',
      harga: menu.harga,
      jenisId: menu.jenis?.id || (jenisList.length > 0 ? jenisList[0].id : ''),
      isAvailable: menu.isAvailable !== false,
    });
    setSelectedFile(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.namaMenu || !formData.harga || !formData.jenisId) {
        setSnackbar({ open: true, message: 'Harap isi semua field wajib', severity: 'error' });
        return;
      }

      const submitData = new FormData();
      const menuData = {
        namaMenu: formData.namaMenu,
        deskripsi: formData.deskripsi || '',
        harga: parseFloat(formData.harga),
        isAvailable: formData.isAvailable,
        jenis: {
          id: parseInt(formData.jenisId)
        }
      };
      
      submitData.append('data', JSON.stringify(menuData));
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      if (editMode) {
        await menuApi.updateMenu(selectedMenu.id, submitData);
        setSnackbar({ open: true, message: 'Menu berhasil diperbarui', severity: 'success' });
      } else {
        await menuApi.createMenu(submitData);
        setSnackbar({ open: true, message: 'Menu berhasil ditambahkan', severity: 'success' });
      }

      handleCloseModal();
      fetchData();
    } catch (err) {
      setSnackbar({ open: true, message: 'Gagal menyimpan menu', severity: 'error' });
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      try {
        await menuApi.deleteMenu(id);
        setSnackbar({ open: true, message: 'Menu berhasil dihapus', severity: 'success' });
        fetchData();
      } catch (err) {
        setSnackbar({ open: true, message: 'Gagal menghapus menu', severity: 'error' });
        console.error(err);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading && menus.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Manajemen Menu
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
        >
          Tambah Menu Baru
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Gambar</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nama Menu</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Jenis</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Harga</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((menu) => (
                <TableRow key={menu.id} hover>
                  <TableCell>
                    <Avatar
                      src={fixImageUrl(menu.imageUrl) || FALLBACK_IMAGE}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    >
                      {menu.namaMenu.charAt(0)}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="500">{menu.namaMenu}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 250, noWrap: true, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {menu.deskripsi}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={menu.namaJenis || (menu.jenis?.namaJenis)} size="small" variant="outlined" color="secondary" />
                  </TableCell>
                  <TableCell fontWeight="bold">{formatRupiah(menu.harga)}</TableCell>
                  <TableCell>
                    {menu.isAvailable !== false ? (
                      <Chip label="Available" color="success" size="small" />
                    ) : (
                      <Chip label="Tidak Tersedia" color="error" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton color="info" onClick={() => handleOpenEditModal(menu)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(menu.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            {menus.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">Belum ada data menu.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={menus.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Baris per halaman"
        />
      </TableContainer>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          {editMode ? 'Edit Menu' : 'Tambah Menu Baru'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nama Menu"
              name="namaMenu"
              fullWidth
              value={formData.namaMenu}
              onChange={handleInputChange}
              required
            />
            <TextField
              label="Deskripsi"
              name="deskripsi"
              fullWidth
              multiline
              rows={3}
              value={formData.deskripsi}
              onChange={handleInputChange}
            />
            <TextField
              label="Harga"
              name="harga"
              type="number"
              fullWidth
              value={formData.harga}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: <Box sx={{ mr: 1 }}>Rp</Box>,
              }}
            />
            <TextField
              select
              label="Jenis Makanan"
              name="jenisId"
              fullWidth
              value={formData.jenisId}
              onChange={handleInputChange}
              required
            >
              {jenisList.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.namaJenis}
                </MenuItem>
              ))}
            </TextField>
            
            <Box>
              <Typography variant="body2" gutterBottom>Gambar Menu</Typography>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ height: 56 }}
              >
                {selectedFile ? selectedFile.name : 'Pilih Gambar'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {selectedMenu?.imageUrl && !selectedFile && (
                <Typography variant="caption" color="text.secondary">
                  Gambar saat ini: {fixImageUrl(selectedMenu.imageUrl)?.split('/').pop() || 'None'}
                </Typography>
              )}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  name="isAvailable"
                  color="primary"
                />
              }
              label="Tersedia"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #eee' }}>
          <Button onClick={handleCloseModal} color="inherit">
            Batal
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPage;
