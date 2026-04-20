-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 21, 2025 at 03:22 AM
-- Server version: 10.4.32-MariaDB-log
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kopidaeng`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pesanan`
--

CREATE TABLE `detail_pesanan` (
  `id` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `hargaSaat_pesan` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_pesanan`
--

INSERT INTO `detail_pesanan` (`id`, `id_pesanan`, `id_produk`, `jumlah`, `hargaSaat_pesan`) VALUES
(1, 1, 1, 2, 50000.00),
(2, 2, 4, 1, 200000.00),
(3, 3, 1, 1, 50000.00),
(4, 4, 1, 1, 50000.00),
(5, 5, 4, 1, 200000.00),
(6, 6, 1, 148, 50000.00),
(7, 7, 6, 2, 150000.00),
(8, 8, 6, 2, 150000.00),
(9, 9, 6, 1, 150000.00),
(10, 10, 6, 1, 150000.00),
(11, 11, 4, 1, 200000.00),
(12, 12, 6, 5, 150000.00),
(13, 13, 1, 2, 50000.00),
(14, 14, 1, 3, 50000.00),
(15, 15, 1, 4, 50000.00),
(16, 16, 1, 1, 50000.00),
(17, 17, 1, 1, 50000.00),
(18, 18, 1, 1, 50000.00),
(19, 19, 1, 1, 50000.00),
(20, 20, 1, 3, 50000.00),
(21, 21, 4, 1, 200000.00),
(22, 22, 1, 2, 50000.00),
(23, 23, 1, 1, 50000.00),
(24, 24, 1, 3, 50000.00),
(25, 25, 4, 3, 200000.00),
(26, 26, 6, 1, 150000.00),
(27, 27, 6, 3, 150000.00),
(28, 28, 6, 2, 150000.00),
(29, 29, 4, 4, 200000.00),
(30, 30, 4, 1, 200000.00),
(31, 31, 1, 10, 50000.00),
(32, 32, 6, 1, 150000.00),
(33, 33, 6, 3, 150000.00),
(34, 34, 4, 1, 200000.00),
(35, 35, 4, 3, 200000.00),
(36, 36, 4, 2, 200000.00),
(37, 37, 1, 2, 50000.00),
(38, 38, 4, 2, 200000.00),
(39, 39, 1, 2, 50000.00),
(40, 40, 6, 2, 150000.00),
(41, 41, 1, 1, 50000.00),
(42, 42, 6, 1, 150000.00),
(43, 43, 4, 1, 200000.00);

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `nama_kategori` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `nama_kategori`) VALUES
(1, 'Kopi Arabika'),
(2, 'Kopi Robusta'),
(3, 'Kopi Liberika'),
(4, 'Kopi Ekselsa');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL,
  `metode` varchar(50) NOT NULL,
  `bukti` varchar(255) DEFAULT NULL,
  `tanggal_pembayaran` datetime DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'Menunggu Konfirmasi'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengiriman`
--

CREATE TABLE `pengiriman` (
  `id` int(11) NOT NULL,
  `id_pesanan` int(11) NOT NULL,
  `jasa_kurir` varchar(50) DEFAULT NULL,
  `nomor_resi` varchar(100) DEFAULT NULL,
  `status_kirim` enum('Diproses','Dikirim','Diterima') NOT NULL DEFAULT 'Diproses',
  `tanggal_kirim` date DEFAULT NULL,
  `foto_bukti` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pengiriman`
--

INSERT INTO `pengiriman` (`id`, `id_pesanan`, `jasa_kurir`, `nomor_resi`, `status_kirim`, `tanggal_kirim`, `foto_bukti`) VALUES
(1, 6, 'JNE', 'frefrrf', 'Diterima', '2025-11-04', '1762439091377.png'),
(2, 3, 'sicepat', 'dewdewe', 'Dikirim', '2025-11-05', NULL),
(3, 4, 'sicepat', 'tttgg', 'Dikirim', '2025-11-24', NULL),
(4, 5, 'rfrefrf', 'refff', 'Dikirim', '2025-11-26', NULL),
(5, 14, 'sicepat', '22233334', 'Dikirim', '2025-11-13', NULL),
(6, 24, 'JNE', 'ref829263', 'Diterima', '2025-11-13', '1763048392200.jpeg'),
(7, 21, 'JNE', 'ref39439', 'Dikirim', '2025-11-12', '1763046152694.jpeg'),
(8, 25, 'JNE', 'refff28292', 'Diterima', '2025-11-13', '1763048422186.jpeg'),
(9, 20, 'JNE', 'refff', 'Dikirim', '2025-11-13', '1763046733725.jpeg'),
(10, 23, 'JNE', 'tttgg', 'Diterima', '2025-11-13', '1763048440134.jpeg'),
(11, 26, 'JNE', 'refff22', 'Diterima', '2025-11-13', '1763048367449.jpeg'),
(12, 1, 'JNE', 'refff133', 'Diterima', '2025-11-13', '1763048620270.jpeg'),
(13, 27, 'JNE', 'ref32893283298', 'Dikirim', '2025-11-14', '1763083697147.jpeg'),
(14, 28, 'JNE', 'rr3335r', 'Diterima', '2025-11-14', '1763084103801.jpeg'),
(15, 29, 'JNE', 'rr3335r', 'Diterima', '2025-11-14', '1763085282716.jpeg'),
(16, 34, 'JNE', 'refff2211', 'Diterima', '2025-11-18', '1763479108502.jpeg'),
(17, 35, 'JNE', 'refff5362882', 'Dikirim', '2025-11-18', '1763479487421.jpeg'),
(18, 37, 'JNE', 'refff', 'Diterima', '2025-11-19', '1763639243991.jpeg'),
(19, 38, 'JNE', 'refff233', 'Dikirim', '2025-11-19', NULL),
(20, 39, 'JNE', 'dewdewe', 'Diterima', '2025-11-20', '1763643507168.jpeg'),
(21, 40, 'sicepat', '22233334', 'Diterima', '2025-11-20', '1763644263637.png'),
(22, 36, 'JNE', '3335333', 'Diterima', '2025-11-20', '1763651224772.jpeg'),
(23, 32, 'JNE', '3232342', 'Diterima', '2025-11-20', '1763655107851.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `metode_pembayaran` varchar(50) DEFAULT NULL,
  `bukti_transfer` varchar(255) DEFAULT NULL,
  `tanggal_pesanan` datetime DEFAULT current_timestamp(),
  `total_harga` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status_pesanan` enum('Menunggu Pembayaran','Menunggu Verifikasi','Dibayar','Diproses','Selesai','Dibatalkan') NOT NULL DEFAULT 'Menunggu Pembayaran'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pesanan`
--

INSERT INTO `pesanan` (`id`, `id_user`, `alamat`, `telepon`, `metode_pembayaran`, `bukti_transfer`, `tanggal_pesanan`, `total_harga`, `status_pesanan`) VALUES
(1, 5, NULL, NULL, NULL, NULL, '2025-11-03 21:52:11', 100000.00, 'Selesai'),
(2, 5, NULL, NULL, NULL, NULL, '2025-11-03 21:52:25', 200000.00, 'Diproses'),
(3, 5, NULL, NULL, NULL, NULL, '2025-11-03 22:22:31', 50000.00, 'Diproses'),
(4, 5, NULL, NULL, NULL, NULL, '2025-11-05 19:21:12', 50000.00, 'Diproses'),
(5, 5, 'makassarr', '08272772', NULL, NULL, '2025-11-05 19:53:18', 200000.00, 'Diproses'),
(6, 5, 'sumenep', '08272772', NULL, NULL, '2025-11-05 20:01:22', 7400000.00, 'Selesai'),
(7, 5, 'jalan perumnas giling pamolokan no.12', '33', NULL, NULL, '2025-11-05 20:09:49', 300000.00, 'Menunggu Pembayaran'),
(8, 5, '333', '2222', NULL, NULL, '2025-11-05 20:17:36', 300000.00, 'Dibayar'),
(9, 5, 'malang', '33222', NULL, NULL, '2025-11-06 22:59:41', 150000.00, 'Menunggu Pembayaran'),
(10, 5, 'batuan', '343434', NULL, NULL, '2025-11-07 08:33:02', 150000.00, 'Menunggu Pembayaran'),
(11, 5, 'saronggi', '33222', NULL, NULL, '2025-11-07 08:38:01', 200000.00, 'Menunggu Pembayaran'),
(12, 5, 'batuan block c 21', '085231998080', NULL, NULL, '2025-11-07 08:45:16', 750000.00, 'Menunggu Pembayaran'),
(13, 5, 'batuan', '474484', NULL, NULL, '2025-11-07 09:15:25', 100000.00, 'Menunggu Pembayaran'),
(14, 5, 'dimana aja ', '33333', NULL, NULL, '2025-11-12 21:49:44', 150000.00, 'Diproses'),
(15, 5, 'haha', '2222', NULL, NULL, '2025-11-13 20:37:43', 200000.00, 'Menunggu Pembayaran'),
(16, 5, 'wewde', 'eee', 'Transfer Bank', NULL, '2025-11-13 21:17:41', 50000.00, 'Menunggu Pembayaran'),
(17, 5, 'wewde', 'eee', 'COD', NULL, '2025-11-13 21:18:07', 50000.00, 'Menunggu Pembayaran'),
(18, 5, 'dfdff', 'dfdff', 'Transfer Bank', NULL, '2025-11-13 21:20:46', 50000.00, 'Menunggu Pembayaran'),
(19, 5, 'dfdff', 'dfdff', 'Transfer Bank', NULL, '2025-11-13 21:21:27', 50000.00, 'Menunggu Pembayaran'),
(20, 5, 'makasan', '039304848333', 'Transfer Bank', NULL, '2025-11-13 21:22:15', 150000.00, 'Diproses'),
(21, 5, 'apa aja ', '02392', 'Transfer Bank', NULL, '2025-11-13 21:24:16', 200000.00, 'Diproses'),
(22, 5, 'maalang', '46543535', 'Transfer Bank', NULL, '2025-11-13 21:30:04', 100000.00, 'Menunggu Pembayaran'),
(23, 5, 'rrrgr', '08272772', 'Transfer Bank', NULL, '2025-11-13 21:39:56', 50000.00, 'Selesai'),
(24, 5, 'solo ', '34204203948', 'Transfer Bank', NULL, '2025-11-13 21:43:20', 150000.00, 'Selesai'),
(25, 5, 'Sampang Madura ', '38292172937282', 'Transfer Bank', '1763046258715.jpeg', '2025-11-13 22:03:53', 600000.00, 'Selesai'),
(26, 5, 'makassar', '0852338292', 'Transfer Bank', '1763048297101.jpeg', '2025-11-13 22:38:09', 150000.00, 'Selesai'),
(27, 5, 'batuan', '08272772', 'Transfer Bank', '1763083650637.jpeg', '2025-11-14 08:27:19', 450000.00, 'Diproses'),
(28, 5, 'malang', '08272772', 'Transfer Bank', '1763084007962.jpeg', '2025-11-14 08:33:17', 300000.00, 'Selesai'),
(29, 5, 'saronggih', '03940324', 'Transfer Bank', '1763085081191.jpeg', '2025-11-14 08:51:08', 800000.00, 'Selesai'),
(30, 5, 'mwmw', '2222', 'Transfer Bank', NULL, '2025-11-14 08:51:52', 200000.00, 'Menunggu Pembayaran'),
(31, 5, 'giling', '2222', 'COD', NULL, '2025-11-14 09:02:31', 500000.00, 'Menunggu Pembayaran'),
(32, 5, 'jskjsak', '333', 'Transfer Bank', '1763433154121.jpeg', '2025-11-18 09:32:13', 150000.00, 'Selesai'),
(33, 5, 'contoh', '08272772', 'COD', NULL, '2025-11-18 16:53:16', 450000.00, 'Menunggu Pembayaran'),
(34, 5, 'molokan', '9238923', 'Transfer Bank', '1763478749680.jpeg', '2025-11-18 22:06:12', 200000.00, 'Selesai'),
(35, 5, 'Makassar, Sulawesi Selatan', '087282937282', 'Transfer Bank', '1763479446209.jpeg', '2025-11-18 22:23:53', 600000.00, 'Diproses'),
(36, 5, 'malang', '3432444', 'Transfer Bank', NULL, '2025-11-18 22:57:43', 400000.00, 'Selesai'),
(37, 5, 'puki', '33222', 'Transfer Bank', '1763529578501.jpeg', '2025-11-19 12:19:11', 100000.00, 'Selesai'),
(38, 12, 'Malang Jawa Timur', '08293822922', 'COD', NULL, '2025-11-19 12:32:40', 400000.00, 'Diproses'),
(39, 12, 'dimana aja ', '474484', 'COD', NULL, '2025-11-19 12:35:25', 100000.00, 'Selesai'),
(40, 5, 'jombang', '304802948', 'Transfer Bank', '1763643770395.jpeg', '2025-11-20 20:02:31', 300000.00, 'Selesai'),
(41, 5, '26egwe', '938938', 'Transfer Bank', '1763689488070.jpg', '2025-11-21 08:44:28', 50000.00, 'Menunggu Verifikasi'),
(42, 5, 'rgg', '44444', 'Transfer Bank', NULL, '2025-11-21 08:45:57', 150000.00, 'Menunggu Pembayaran'),
(43, 5, 'jjjj', '333', 'Transfer Bank', NULL, '2025-11-21 08:48:05', 200000.00, 'Menunggu Pembayaran');

-- --------------------------------------------------------

--
-- Table structure for table `produk`
--

CREATE TABLE `produk` (
  `id` int(11) NOT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `nama_produk` varchar(100) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `harga` decimal(10,2) DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `stok` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produk`
--

INSERT INTO `produk` (`id`, `id_kategori`, `nama_produk`, `deskripsi`, `harga`, `gambar`, `stok`) VALUES
(1, 2, 'Kopi robusta jawa', 'Kopi robusta (Coffea canephora) adalah jenis kopi yang berasal dari Afrika Tengah dan Barat. Kopi robusta memiliki rasa yang khas seperti gabungan kacang dan cokelat.', 50000.00, '1760765566818.jpeg', 111),
(4, 1, 'Kopi Arabika Toraja', 'Kopi Arabika Toraja memiliki karakteristik yang unik dengan sensasi rasa pahit yang hanya terasa diawal saja dan akan hilang dalam sekali teguk. Kopi ini tidak meninggalkan rasa pahit usai meminumnya, yang  mana memang after taste pahit setelah meminum kopi terasa mengganggu bagi beberapa orang.', 200000.00, '1760970834135.webp', 180),
(6, 1, 'Kopi Arabika Bali', 'Kopi jenis ini memiliki aroma yang tipis rempah-rempah serta dalam penyajiannya melewati proses diling basah, dan hal tersebutlah yang membuatnya berbeda dengan yang lainnya. ', 150000.00, '1761721270410.jpg', 278),
(10, 2, 'Kopi Robusta Flores', 'Kopi Flores memiliki citarasa yang khas yang berbeda dari jenis kopi di Indonesia lainnya. Kopi Flores memiliki rasa manis dengan sensasi kacang-kacangan seperti hazelnut, karamel dan juga cokelat. Dari tingkat acidity, kopi Flores memiliki tingkat acidity dan body yang medium dengan rasa yang seimbang dan ringan yang membuat kopi Flores ini cocok di banyak orang.', 300000.00, '1763648753981.jpg', 50),
(11, 3, 'Kopi Liberika Banyuwangi', 'Kopi liberika house blend dengan level medium to dark roast cocok untuk menemani Anda ngopi santai. Sementara itu, kopi liberika dark roast pas untuk dijadikan espresso saat Anda butuh fokus maksimal. Untungnya, produk dengan aftertaste long lasting ini dijual dengan harga terjangkau.', 20000.00, '1763649106026.png', 15),
(12, 3, 'Kopi Liberika Nangka Khas Lumajang', ' rasa fruity (buah) dan sweet (manis), dengan sensasi rasa nangka yang kuat ', 35000.00, '1763649530649.webp', 50),
(13, 4, 'Kopi Ekselsa Wonosalam Khas Jombang', 'Kopi Excelsa Wonosalam memiliki rasa yang unik dan eksotis, sering kali dengan karakter fruity (buah-buahan), chocolatey (cokelat), floral, dan creamy (krim). Rasa ini bisa bervariasi tergantung pada proses pascapanen, dengan proses fermentasi khusus dapat menghasilkan sensasi rasa seperti apel hijau, stroberi, dan madu. ', 101000.00, '1763649759026.jpg', 50),
(14, 4, 'Kopi Ekselsa Telemung ', 'Kopi Excelsa Telemung memiliki rasa yang kompleks dengan sentuhan fruity, earthy, dan spicy, serta aftertaste asam yang ringan. Kombinasi ini menghasilkan rasa yang unik dan seimbang, berbeda dari kopi Arabika dan Robusta, seringkali dengan nuansa manis seperti buah tropis atau karamel. ', 88000.00, '1763649871318.jpg', 50);

-- --------------------------------------------------------

--
-- Table structure for table `ulasan`
--

CREATE TABLE `ulasan` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `komentar` text DEFAULT NULL,
  `tanggal` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ulasan`
--

INSERT INTO `ulasan` (`id`, `id_user`, `id_produk`, `rating`, `komentar`, `tanggal`) VALUES
(1, 5, 6, 3, 'pengiriman cepatt ', '2025-11-20 13:23:08'),
(2, 5, 1, 5, 'mantaaapp siiihhhh', '2025-11-20 13:29:06'),
(3, 5, 6, 5, 'enakkk', '2025-11-20 13:29:30'),
(4, 5, 4, 5, 'enakk bangettt aromanyaa nampoll', '2025-11-20 15:07:23'),
(5, 5, 4, 4, 'pengirimannya cepat', '2025-11-20 15:53:41'),
(6, 5, 4, 3, 'produk nya bocor dikitt', '2025-11-20 16:04:58'),
(7, 5, 4, 5, 'mantappp ga nyesall saya belii\r\n', '2025-11-20 16:09:39'),
(8, 5, 6, 5, 'enak banget ada rasa rempah rempah nya jossss', '2025-11-20 16:12:14'),
(9, 5, 1, 1, 'jelekkk', '2025-11-21 01:25:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `last_login` datetime DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `role`, `last_login`, `status`) VALUES
(1, 'nicowae', 'adminnico@gmail.com', '$2b$10$.CqDgc5Ndql2qmWN/Pb4k.eXJiYlKlx7Q/Cx3s9gvaW3v.ECrOE8S', 'admin', '2025-11-21 08:26:07', 'aktif'),
(5, 'vincent', 'vincent@gmail.com', '$2b$10$6wj.utUmkTYX.CHgfDDao.uHvbU0oA6aFkPyl.OHzTBAoIWrgw316', 'user', '2025-11-21 08:46:22', 'aktif'),
(12, 'frengky', 'frengky@gmail.com', '$2b$10$O5Wge7ynxOTbuoe4nbBh1eXQSGkjwyXhaBzZs7H3Ff6REij09Nz5G', 'user', '2025-11-20 19:58:06', 'aktif');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pesanan` (`id_pesanan`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_pesanan` (`id_pesanan`);

--
-- Indexes for table `pengiriman`
--
ALTER TABLE `pengiriman`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_pesanan` (`id_pesanan`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_produk_kategori` (`id_kategori`);

--
-- Indexes for table `ulasan`
--
ALTER TABLE `ulasan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengiriman`
--
ALTER TABLE `pengiriman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `produk`
--
ALTER TABLE `produk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `ulasan`
--
ALTER TABLE `ulasan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pesanan`
--
ALTER TABLE `detail_pesanan`
  ADD CONSTRAINT `detail_pesanan_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id`),
  ADD CONSTRAINT `detail_pesanan_ibfk_2` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id`);

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengiriman`
--
ALTER TABLE `pengiriman`
  ADD CONSTRAINT `pengiriman_ibfk_1` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan` (`id`);

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);

--
-- Constraints for table `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `fk_produk_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
