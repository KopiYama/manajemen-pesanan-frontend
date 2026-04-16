# Manajemen Pesanan Restoran - Frontend

Aplikasi frontend untuk sistem manajemen pesanan restoran yang dibangun menggunakan **React** dan **Vite**. Aplikasi ini mengintegrasikan layanan pemesanan, dapur, manajemen menu, dan sistem pembayaran (Tunai & Midtrans).

## 🚀 Fitur Utama

### 1. Area Pelanggan (Customer UI)
*   **Menu Digital**: Menampilkan daftar makanan berdasarkan kategori.
*   **Keranjang Belanja**: Pemesanan multi-item secara instan.
*   **Integrasi Pembayaran**:
    *   **Online (Midtrans)**: Mendukung QRIS, Virtual Account, dll menggunakan Midtrans Snap.
    *   **Tunai**: Pesan sekarang, bayar nanti di kasir.
*   **Lacak Pesanan**: Monitoring status pesanan (Antri -> Dimasak -> Siap -> Selesai) secara real-time.

### 2. Area Staff (Staff UI)
*   **Dapur Dashboard (Kanban)**: Monitor pesanan yang masuk dengan sistem kolom (Antrian, Sedang Dimasak, Siap Disajikan).
*   **Fitur Kasir Terintegrasi**: Konfirmasi pembayaran tunai langsung dari dashboard dapur.
*   **Manajemen Menu (Admin)**: 
    *   Tambah, edit, dan hapus menu makanan.
    *   Update ketersediaan stok (Available/Unavailable).
    *   Upload gambar menu ke storage (MinIO).

## 🛠️ Tech Stack

*   **Framework**: React 18
*   **Build Tool**: Vite
*   **UI Library**: Material UI (MUI) v5
*   **Icons**: MUI Icons
*   **State Management**: React Context API
*   **API Client**: Axios
*   **Payment Gateway**: Midtrans Snap JS

## ⚙️ Konfigurasi API

Aplikasi ini berkomunikasi dengan backend melalui **API Gateway** yang berjalan pada:
`http://localhost:8080`

Konfigurasi dasar dapat ditemukan di `src/api/axiosInstance.js`.

## 📂 Struktur Folder

```
src/
├── api/             # Service API (Order, Menu, Kitchen, Payment)
├── assets/          # Gambar dan aset statis
├── components/      # Komponen reusable (Shared & Layout)
├── context/         # Context API (Cart & Order state)
├── pages/           # Halaman utama aplikasi
└── theme.js         # Konfigurasi tema Material UI
```

## 🏃 Menjalankan Aplikasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/KopiYama/manajemen-pesanan-frontend.git
    cd manajemen-pesanan-frontend
    ```

2.  **Install Dependensi**
    ```bash
    npm install
    ```

3.  **Jalankan Mode Development**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

4.  **Build untuk Produksi**
    ```bash
    npm run build
    ```

## 🔗 URL Penting

*   **Menu Pelanggan**: `/menu` atau `/`
*   **Lacak Pesanan**: `/track/:id`
*   **Dashboard Dapur & Kasir**: `/kitchen`
*   **Manajemen Admin**: `/admin`

---
© 2024 Manajemen Pesanan Restoran.
