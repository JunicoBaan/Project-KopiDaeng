import { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { useNavigate, useParams, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminUsersEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    role: 'user',
    status: 'aktif'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      const u = response.data.user;
      setFormData({
        nama: u.nama,
        email: u.email,
        role: u.role,
        status: u.status
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/edit/${id}`, formData);
      Swal.fire('Data pengguna berhasil diperbarui!');
      navigate('/admin/users');
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal memperbarui pengguna');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'transparent' }}>
      <div className="main-container dashboard-page-wrapper">
        <SidebarAdmin active="users" />

      <main className="dashboard-main-content">
        <div className="header-section">
          <h1>✏️ Edit Data Pengguna</h1>
        </div>

        <form onSubmit={handleSubmit} className="content-form">
          <div className="form-group">
            <label htmlFor="nama">Nama</label>
            <input type="text" id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button type="submit" className="btn" style={{ cursor: 'pointer' }}>Simpan Perubahan</button>
            <Link to="/admin/users" className="link-kembali" style={{ color: '#d35400', textDecoration: 'none', fontWeight: 'bold' }}>Batal</Link>
          </div>
        </form>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersEdit;
