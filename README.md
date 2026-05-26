KopiDaeng adalah platform e-commerce pemesanan kopi berbasis web full-stack yang dinamis, responsif, dan aman. Sistem ini dirancang untuk menangani alur bisnis e-commerce ujung-ke-ujung (end-to-end), mulai dari penjelajahan katalog produk secara dinamis oleh pelanggan, sistem pemesanan dan checkout terintegrasi, fitur unggah bukti pembayaran, pelacakan status pengiriman logistik secara real-time, hingga sistem manajemen ulasan produk.
Di sisi internal bisnis, platform ini dilengkapi dengan Admin Panel Dashboard yang canggih untuk memantau performa penjualan harian, melakukan operasi CRUD produk secara real-time, memverifikasi bukti transfer pelanggan, mengelola kurir dan nomor resi pengiriman, serta melakukan ekspor laporan keuangan harian dalam format dokumen spreadsheet Excel (.xlsx) secara dinamis.

Arsitektur & Tech Stack
Proyek ini dibangun menggunakan arsitektur pemisahan Frontend dan Backend (decoupled architecture) dengan komunikasi berbasis RESTful API:
1. Frontend Layer (Client-Side)
•	Framework: React.js  & Vite Memastikan performa render UI yang cepat dengan Hot Module Replacement (HMR).
•	Routing: React Router DOM Manajemen navigasi halaman, dynamic routing untuk detail produk/pesanan, serta proteksi rute (Route Guarding) berdasarkan peran pengguna.
•	Styling & UI: Tailwind CSS Desain antarmuka modern yang sepenuhnya responsif, clean, dan nyaman diakses di semua ukuran layar (mobile-friendly).
•	State & HTTP Client: Axios Berkomunikasi dengan REST API Backend. Dilengkapi dengan Axios Interceptors untuk menyematkan JSON Web Token (JWT) secara otomatis di header permintaan HTTP.
•	Utility & Interaktivitas:
•	lucide-react – Paket ikon vektor modern yang konsisten.
•	sweetalert2 – Modul pop-up interaktif untuk notifikasi sukses, gagal, konfirmasi tindakan, dan pesan peringatan.


2. Backend Layer (Server-Side)
•	Environment: Node.js & Express (v5) – Kerangka kerja server-side yang cepat, minimalis, dan modular untuk menangani RESTful API.
•	Database & Driver: MySQL dengan driver mysql2 – Menangani penyimpanan data relasional secara efisien menggunakan optimasi query SQL mentah (Raw SQL Queries) dengan integrasi relasi JOIN kompleks.
•	Authentication & Security:
•	jsonwebtoken (JWT) – Autentikasi nirkeadaan (stateless authentication) untuk mengamankan endpoint API.
•	bcrypt – Enkripsi satu arah untuk hashing kata sandi pengguna sebelum disimpan ke database guna menjaga privasi dan keamanan data.
•	File Handling: multer – Middleware untuk menangani unggahan file multipart/form-data (gambar produk, bukti transfer bank, dan foto bukti pengiriman kurir).
•	Reporting Utility: exceljs – Engine server-side untuk membuat, memformat, dan mengekspor data laporan keuangan penjualan harian langsung ke berkas Microsoft Excel (.xlsx) dengan penataan tabel visual yang profesional.

Fitur Utama & Fungsionalitas Sistem
Halaman Pelanggan (Customer Portal)
1.	Sistem Registrasi & Login Mandiri: Autentikasi aman dengan enkripsi password (Bcrypt) dan manajemen sesi menggunakan token JWT di sessionStorage sisi klien.
2.	Katalog Produk Dinamis & Pencarian Pintar: Penjelajahan katalog produk dengan fitur pencarian teks real-time yang langsung mencocokkan nama produk atau nama kategori melalui query pencarian dinamis SQL LIKE.
3.	Halaman Detail & Ulasan Terintegrasi: Menampilkan informasi detail produk, stok aktual, deskripsi lengkap, serta daftar rating bintang dan ulasan ulasan pembeli. Nilai rata-rata rating (avg_rating) dan total ulasan (ulasan_count) dihitung secara real-time di database menggunakan fungsi agregasi SQL (AVG & COUNT).
4.	Alur Pemesanan & Validasi Stok (Checkout): Pembelian produk dengan proteksi stok. Sistem akan memeriksa ketersediaan stok di database secara otomatis sebelum memproses pesanan untuk mencegah transaksi overselling.
5.	Metode Pembayaran Transfer & Unggah Bukti: Setelah melakukan checkout, pesanan masuk ke status "Menunggu Verifikasi". Pengguna dapat mengunggah foto bukti transfer bank menggunakan integrasi API File Upload.
6.	Pelacakan Pesanan & Logistik Real-Time: Halaman khusus bagi pembeli untuk melacak status pesanan secara mendalam, termasuk nama kurir pengirim, tanggal pengiriman, nomor resi kurir, hingga foto bukti serah terima paket saat pesanan selesai.

Halaman Pengelola (Admin Dashboard & Management)
1.	Dashboard Telemetri & Analitik Bisnis: Menampilkan rangkuman statistik performa bisnis secara seketika: Total Produk aktif, Total Pengguna terdaftar, Total Transaksi Masuk, dan Total Stok Tersisa.
2.	Filter & Laporan Penjualan Harian: Panel pemantauan grafik/tabel penjualan harian yang dapat difilter secara dinamis berdasarkan rentang tanggal mulai (start date) hingga tanggal akhir (end date).
3.	Ekspor Laporan Excel Otomatis: Admin dapat mengunduh laporan penjualan harian yang sesuai filter tanggal dalam format .xlsx. File Excel yang dihasilkan diformat secara profesional dengan header tabel yang diberi warna khusus, font tebal, serta pengaturan lebar kolom dinamis di backend menggunakan exceljs.
4.	Manajemen Produk Komprehensif (CRUD): CRUD penuh (Create, Read, Update, Delete) untuk produk. Dilengkapi fitur unggah gambar baru, penggantian stok, pemilihan kategori relasional, dan penghapusan produk.
5.	Verifikasi Transaksi: Admin memiliki kendali penuh untuk meninjau bukti transfer yang dikirim pembeli dan mengubah status transaksi menjadi "Dibayar", "Ditolak", atau status lainnya.
6.	Sistem Manajemen Pengiriman (Logistik): Form pengisian kurir logistik bagi admin untuk memasukkan nama agen kurir, nomor resi pengiriman, tanggal keberangkatan, serta mengunggah bukti dokumentasi foto pengiriman yang secara otomatis mengubah status pesanan menjadi "Dikirim".
7.	Manajemen Pengguna (User Management): Antarmuka khusus admin untuk memantau semua akun terdaftar dan memperbarui peran pengguna secara real-time (mengubah User biasa menjadi Admin atau sebaliknya).





