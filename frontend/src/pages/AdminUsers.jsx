import { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/manage');
      setUsers(response.data.users || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAutoNonaktif = async () => {
    try {
      await api.post('/users/auto-nonaktif');
      Swal.fire('Berhasil menonaktifkan otomatis user (>14 hari)');
      fetchUsers();
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal auto-nonaktif');
    }
  };

  const handleNonaktif = async (id) => {
    try {
      await api.post(`/users/nonaktif/${id}`);
      fetchUsers();
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal nonaktifkan');
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Yakin ingin hapus user ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#e74c3c'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/users/hapus/${id}`);
          fetchUsers();
          Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
        } catch (err) {
          Swal.fire(err.response?.data?.message || 'Gagal hapus user');
        }
      }
    });
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'transparent' }}>
      <div className="main-container dashboard-page-wrapper">
        <SidebarAdmin active="users" />

      <main className="dashboard-main-content">
        <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#ffffff', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div>
            <h1 style={{ margin: 0, color: '#3d2b1f', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>Manajemen Pengguna</h1>
            <p style={{ margin: '8px 0 0 0', color: '#7f8c8d', fontSize: '0.95rem' }}>Kelola hak akses, status pelanggan, dan blokir pengguna pasif.</p>
          </div>
          <div className="actions" style={{ display: 'flex', gap: '12px' }}>
            <Link to="/admin/dashboard" className="btn-kembali">Kembali</Link>
            <button onClick={handleAutoNonaktif} className="btn-danger" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(231,76,60,0.3)' }}>
              Auto-Nonaktif (&gt;14 Hari)
            </button>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
          <table className="product-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', tableLayout: 'auto' }}>
            <thead>
              <tr style={{ background: '#fdfbf7', color: '#3d2b1f', textAlign: 'left', fontSize: '0.9rem' }}>
                <th style={{ padding: '12px 10px', borderRadius: '10px 0 0 10px', fontWeight: '700' }}>ID</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Nama</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Email</th>
                <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'center' }}>Role</th>
                <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 10px', fontWeight: '700' }}>Last Login</th>
                <th style={{ padding: '12px 10px', fontWeight: '700', textAlign: 'center' }}>Inaktif</th>
                <th style={{ padding: '12px 10px', borderRadius: '0 10px 10px 0', fontWeight: '700', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(u => (
                  <tr key={u.id} style={{ opacity: u.status === 'nonaktif' ? 0.65 : 1, transition: 'all 0.2s ease', background: u.status === 'nonaktif' ? '#fafafa' : '#ffffff' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', fontSize: '0.9rem' }}><span style={{ color: '#7f8c8d', fontWeight: 'bold' }}>#{u.id}</span></td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', fontWeight: 'bold', color: '#2c3e50', fontSize: '0.95rem' }}>{u.nama}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', color: '#7f8c8d', fontSize: '0.85rem', wordBreak: 'break-all' }}>{u.email}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', textAlign: 'center' }}>
                      <span style={{ 
                        background: u.role === 'admin' ? '#ebf5fb' : '#f8f9f9', 
                        color: u.role === 'admin' ? '#2980b9' : '#7f8c8d', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        border: `1px solid ${u.role === 'admin' ? '#b9dcf2' : '#e5e8e8'}`,
                        display: 'inline-block'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', textAlign: 'center' }}>
                      <span style={{ 
                        background: u.status === 'aktif' ? '#eafaf1' : '#fdedec', 
                        color: u.status === 'aktif' ? '#27ae60' : '#c0392b', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {u.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', fontSize: '0.8rem', color: '#34495e' }}>
                      {u.last_login ? new Date(u.last_login).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : <span style={{color:'#bdc3c7', fontStyle:'italic'}}>Belum pernah</span>}
                    </td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', textAlign: 'center' }}>
                      <span style={{ 
                        color: u.days_inactive > 14 ? '#c0392b' : '#7f8c8d', 
                        fontWeight: u.days_inactive > 14 ? 'bold' : 'normal',
                        fontSize: '0.85rem'
                      }}>
                        {u.days_inactive || 0}
                      </span>
                    </td>
                    
                    <td style={{ padding: '10px', borderBottom: '1px solid #f1f2f6', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'nowrap' }}>
                        <Link to={`/admin/users/edit/${u.id}`} className="btn-edit" style={{ padding: '6px 12px', background: '#f39c12', color: 'white', borderRadius: '6px', textDecoration: 'none', whiteSpace: 'nowrap', border: 'none' }}>Edit</Link>
                        
                        {u.status === 'aktif' && (
                          <button onClick={() => handleNonaktif(u.id)} className="btn-danger" style={{ padding: '6px 12px', background: '#e67e22', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Nonaktifkan</button>
                        )}

                        <button onClick={() => handleDelete(u.id)} className="btn-delete" style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d', fontSize: '1.1rem' }}>Belum ada pengguna terdaftar di sistem.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsers;
