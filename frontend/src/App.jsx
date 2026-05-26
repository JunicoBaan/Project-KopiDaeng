import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ProdukList from './pages/ProdukList';
import ProdukDetail from './pages/ProdukDetail';
import Checkout from './pages/Checkout';
import PesananSaya from './pages/PesananSaya';
import PesananDetailUser from './pages/PesananDetailUser';
import UlasanTambah from './pages/UlasanTambah';
import UploadBukti from './pages/UploadBukti';
import AdminProduk from './pages/AdminProduk';
import AdminProdukTambah from './pages/AdminProdukTambah';
import AdminProdukEdit from './pages/AdminProdukEdit';
import AdminPesanan from './pages/AdminPesanan';
import AdminPesananDetail from './pages/AdminPesananDetail';
import AdminUsers from './pages/AdminUsers';
import AdminUsersEdit from './pages/AdminUsersEdit';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-coffee-50 font-sans">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/produk" element={<ProdukList />} />
            <Route path="/produk/detail/:id" element={<ProdukDetail />} />
            <Route path="/pesanan/tambah/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/pesanan/saya" element={<ProtectedRoute><PesananSaya /></ProtectedRoute>} />
            <Route path="/pesanan/saya/detail/:id" element={<ProtectedRoute><PesananDetailUser /></ProtectedRoute>} />
            <Route path="/pesanan/upload-bukti/:id" element={<ProtectedRoute><UploadBukti /></ProtectedRoute>} />
            <Route path="/ulasan/tambah/:id" element={<ProtectedRoute><UlasanTambah /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/produk" element={<ProtectedRoute role="admin"><AdminProduk /></ProtectedRoute>} />
            <Route path="/admin/produk/create" element={<ProtectedRoute role="admin"><AdminProdukTambah /></ProtectedRoute>} />
            <Route path="/admin/produk/edit/:id" element={<ProtectedRoute role="admin"><AdminProdukEdit /></ProtectedRoute>} />
            <Route path="/admin/pesanan" element={<ProtectedRoute role="admin"><AdminPesanan /></ProtectedRoute>} />
            <Route path="/admin/pesanan/detail/:id" element={<ProtectedRoute role="admin"><AdminPesananDetail /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/users/edit/:id" element={<ProtectedRoute role="admin"><AdminUsersEdit /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
