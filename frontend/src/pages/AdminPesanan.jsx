import { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { Link, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminPesanan = () => {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleShowBukti = (imgUrl) => {
    Swal.fire({
      title: 'Bukti Transfer',
      imageUrl: imgUrl,
      imageAlt: 'Bukti Transfer Pelanggan',
      confirmButtonText: 'Tutup',
      confirmButtonColor: '#d35400'
    });
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    try {
      const response = await api.get('/pesanan');
      setPesanan(response.data.pesanan || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e, id) => {
    e.preventDefault();
    const status_pesanan = e.target.status_pesanan.value;
    try {
      await api.post(`/pesanan/update-status/${id}`, { status_pesanan });
      
      if (status_pesanan === 'Diproses') {
        Swal.fire({
          title: 'Status Diperbarui!',
          text: 'Pesanan diubah ke status Diproses. Anda akan dialihkan untuk mengisi informasi pengiriman.',
          icon: 'success',
          confirmButtonColor: '#d35400'
        }).then(() => {
          navigate(`/admin/pesanan/detail/${id}`);
        });
      } else {
        Swal.fire('Status pesanan diperbarui!');
        fetchPesanan(); // reload
      }
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal update status pesanan');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'transparent' }}>
      <div className="main-container dashboard-page-wrapper">
        <SidebarAdmin active="pesanan" />

        <main className="dashboard-main-content">
          <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>Daftar Pesanan Pelanggan</h1>
          </div>

          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <table className="product-table" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Nama Pelanggan</th>
                  <th>Tanggal Pesanan</th>
                  <th>Total Harga</th>
                  <th>Metode Bayar</th>
                  <th>Status Pesanan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pesanan.length > 0 ? (
                  pesanan.map(p => (
                    <tr key={p.id}>
                      <td>
                        <Link to={`/admin/pesanan/detail/${p.id}`} className="btn-link" style={{ color: '#d35400', fontWeight: 'bold' }}>#{p.id}</Link>
                      </td>
                      <td>{p.nama_pelanggan}</td>
                      <td>{new Date(p.tanggal_pesanan).toLocaleString('id-ID')}</td>
                      <td>Rp {parseFloat(p.total_harga).toLocaleString('id-ID')}</td>
                      <td>
                        <div><strong>{p.metode_pembayaran}</strong></div>
                        {p.metode_pembayaran === 'Transfer Bank' && (
                          p.bukti_transfer ? (
                            <button 
                              onClick={() => handleShowBukti(`http://localhost:5000/uploads/${p.bukti_transfer}`)}
                              className="btn-small"
                              style={{ 
                                marginTop: '5px',
                                padding: '4px 8px', 
                                fontSize: '11px', 
                                background: '#2ecc71', 
                                color: 'white', 
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                              }}
                            >
                              Bukti TF
                            </button>
                          ) : (
                            <span style={{ color: '#e74c3c', fontSize: '0.85rem', fontWeight: 'bold' }}>Belum Upload</span>
                          )
                        )}
                      </td>
                      <td>{p.status_pesanan}</td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <form onSubmit={(e) => handleUpdateStatus(e, p.id)} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap' }}>
                          <select 
                            name="status_pesanan" 
                            defaultValue={p.status_pesanan} 
                            required
                            style={{ padding: '6px', borderRadius: '5px', border: '1px solid #aaa', minWidth: '150px' }}
                          >
                            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                            <option value="Diproses">Diproses</option>
                            <option value="Dikirim">Dikirim</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Dibatalkan">Dibatalkan</option>
                          </select>
                          <button type="submit" className="btn-edit" style={{ background: '#d87a2f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Update</button>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Belum ada pesanan.
                    </td>
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

export default AdminPesanan;
