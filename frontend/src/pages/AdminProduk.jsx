import { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminProduk = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduk();
  }, []);

  const fetchProduk = async () => {
    try {
      const response = await api.get('/produk');
      setProduk(response.data.produk || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Konfirmasi',
      text: 'Anda yakin ingin menghapus produk ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#e74c3c'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/produk/${id}`);
          fetchProduk(); // reload data
          Swal.fire('Terhapus!', 'Produk berhasil dihapus.', 'success');
        } catch (err) {
          Swal.fire('Gagal menghapus produk');
        }
      }
    });
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'transparent' }}>
      <div className="main-container dashboard-page-wrapper">
        <SidebarAdmin active="produk" />

        <main className="dashboard-main-content">
          <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ margin: 0 }}>Daftar Produk</h1>
            <Link to="/admin/produk/create" className="btn" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>Tambah Produk Baru</Link>
          </div>

          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
            <table className="product-table" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Kategori</th> 
                  <th>Deskripsi</th>
                  <th>Harga</th>
                  <th>Stok</th>
                  <th>Gambar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {produk.length > 0 ? (
                  produk.map(p => (
                    <tr key={p.id}>
                      <td>{p.nama_produk}</td>
                      <td>{p.nama_kategori || '-'}</td> 
                      <td>{p.deskripsi}</td>
                      <td>Rp {(parseFloat(p.harga) || 0).toLocaleString('id-ID', { minimumFractionDigits: 2 })}</td>
                      <td>{p.stok != null ? p.stok : '0'}</td>
                      <td>
                        {p.gambar ? (
                          <img src={`http://localhost:5000/uploads/${p.gambar}`} alt={p.nama_produk} className="product-image" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                          <Link to={`/admin/produk/edit/${p.id}`} className="btn-edit" style={{ padding: '6px 12px', background: '#f39c12', color: 'white', borderRadius: '6px', textDecoration: 'none', whiteSpace: 'nowrap', border: 'none' }}>Edit</Link>
                          <button onClick={() => handleDelete(p.id)} className="btn-delete" style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      Belum ada produk. Silakan tambahkan produk baru.
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

export default AdminProduk;
