import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const PesananSaya = () => {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPesanan();
  }, []);

  const fetchPesanan = async () => {
    try {
      const response = await api.get('/pesanan/saya');
      setPesanan(response.data.pesanan);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Navbar />

      <div className="main-container">
        <div className="header-section">
          <h1>Riwayat Pesanan</h1>
          <Link to="/produk" className="btn" style={{ textDecoration: 'none' }}>Lanjut Belanja</Link>
        </div>

        {pesanan.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="product-table" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Total Harga</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pesanan.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{new Date(p.tanggal_pesanan).toLocaleString('id-ID')}</td>
                    <td>{p.status_pesanan}</td>
                    <td>Rp {parseFloat(p.total_harga).toLocaleString('id-ID', {minimumFractionDigits:2})}</td>
                    <td>
                      <Link 
                        to={`/pesanan/saya/detail/${p.id}`} 
                        className="btn-small" 
                        style={{ 
                          padding: '6px 12px', 
                          fontSize: '13px', 
                          background: '#d87a2f', 
                          color: 'white', 
                          borderRadius: '6px', 
                          textDecoration: 'none',
                          display: 'inline-block'
                        }}
                      >
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ marginTop: '20px', textAlign: 'center' }}>Belum ada pesanan yang tercatat.</p>
        )}
      </div>
    </>
  );
};

export default PesananSaya;
