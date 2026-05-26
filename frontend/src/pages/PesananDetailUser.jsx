import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const PesananDetailUser = () => {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fotoBukti, setFotoBukti] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/pesanan/detail/${id}`);
      setPesanan(response.data.pesanan);
      setDetail(response.data.detail || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleTerimaPesanan = async (e) => {
    e.preventDefault();
    if (!fotoBukti) {
      Swal.fire("Harap upload foto bukti penerimaan!");
      return;
    }
    const formData = new FormData();
    formData.append('foto_bukti', fotoBukti);

    try {
      await api.post(`/pesanan/saya/terima/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Pesanan berhasil dikonfirmasi!');
      fetchDetail(); // reload detail
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal mengonfirmasi pesanan');
    }
  };

  const getStatusBadge = (status) => {
    let bg = '#f5f0ea', color = '#4a2c2a';
    if (status === 'Selesai') { bg = '#e8f5e9'; color = '#2e7d32'; }
    else if (status === 'Dibatalkan') { bg = '#ffebee'; color = '#c62828'; }
    else if (status === 'Menunggu Verifikasi' || status === 'Menunggu Pembayaran') { bg = '#fff8e1'; color = '#f57f17'; }
    else if (status === 'Diproses' || status === 'Dikirim') { bg = '#efebe9'; color = '#5d4037'; }
    
    return (
      <span style={{ 
        padding: '5px 12px', 
        borderRadius: '20px', 
        fontWeight: '600', 
        fontSize: '0.85rem',
        background: bg,
        color: color,
        display: 'inline-block',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
      }}>
        {status}
      </span>
    );
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center', color: '#4a2c2a' }}>Loading...</div>;
  if (!pesanan) return <div style={{ padding: '30px', textAlign: 'center', color: '#4a2c2a' }}>Pesanan tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      <div className="main-container" style={{ maxWidth: '1000px', margin: '40px auto', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
        
        {/* HEADER SECTION - COFFEE STYLE */}
        <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e0dccc', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', color: '#4a2c2a', margin: 0, fontWeight: '700' }}>Detail Pesanan #{pesanan.id}</h1>
          <Link to="/pesanan/saya" className="btn" style={{ textDecoration: 'none', width: 'auto', padding: '10px 20px', fontSize: '0.9rem', borderRadius: '30px', background: '#4a2c2a', color: '#fff', border: 'none', transition: 'all 0.3s' }}>← Kembali ke Riwayat</Link>
        </div>

        {/* TWO-COLUMN GRID INFO CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {/* CARD 1: INFORMASI PESANAN */}
          <div style={{ background: '#fdfaf6', padding: '25px', borderRadius: '16px', border: '1px solid #e0dccc', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#4a2c2a', marginTop: 0, marginBottom: '15px', borderBottom: '1px dashed #e0dccc', paddingBottom: '8px' }}>Informasi Pesanan</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Tanggal Pesanan:</strong> {new Date(pesanan.tanggal_pesanan).toLocaleString('id-ID')}</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Total Harga:</strong> <span style={{ color: '#e67e22', fontWeight: 'bold', fontSize: '1.1rem' }}>Rp {pesanan.total_harga.toLocaleString('id-ID')}</span></p>
              <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Status Pesanan:</strong> {getStatusBadge(pesanan.status_pesanan)}</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Metode Bayar:</strong> <span style={{ fontWeight: '600', color: '#4a2c2a' }}>{pesanan.metode_pembayaran}</span></p>
            </div>
          </div>

          {/* CARD 2: ALAMAT PENGIRIMAN */}
          <div style={{ background: '#fdfaf6', padding: '25px', borderRadius: '16px', border: '1px solid #e0dccc', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#4a2c2a', marginTop: 0, marginBottom: '15px', borderBottom: '1px dashed #e0dccc', paddingBottom: '8px' }}>Alamat Pengiriman</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', lineHeight: '1.6' }}>
              <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Telepon:</strong> {pesanan.telepon}</p>
              <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Alamat:</strong> {pesanan.alamat}</p>
            </div>
          </div>

        </div>

        {/* CARD 3: INFORMASI PENGIRIMAN (COFFEE COLOR) */}
        {pesanan.jasa_kurir && (
          <div style={{ background: '#f8f4e9', padding: '25px', borderRadius: '16px', border: '1px solid #e0dccc', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: '1.3rem', color: '#4a2c2a', marginTop: 0, marginBottom: '15px', borderBottom: '1px dashed #e0dccc', paddingBottom: '8px' }}>Informasi Pengiriman</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Kurir:</strong> {pesanan.jasa_kurir}</p>
                <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Nomor Resi:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.95rem', background: '#fff', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e0dccc', color: '#4a2c2a' }}>{pesanan.nomor_resi}</span></p>
                <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Status Kirim:</strong> <span style={{ fontWeight: '600', color: '#e67e22' }}>{pesanan.status_kirim}</span></p>
                <p style={{ margin: 0 }}><strong style={{ color: '#555' }}>Tanggal Kirim:</strong> {pesanan.tanggal_kirim ? new Date(pesanan.tanggal_kirim).toLocaleDateString('id-ID') : '-'}</p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: '#555' }}>Estimasi Tiba:</strong>{' '}
                  {pesanan.tanggal_kirim 
                    ? new Date(new Date(pesanan.tanggal_kirim).getTime() + 3*24*60*60*1000).toLocaleDateString('id-ID') 
                    : '-'}
                </p>
              </div>

              {pesanan.bukti_pengiriman && (
                <div style={{ textAlign: 'center', background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #e0dccc' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#4a2c2a' }}>
                    <strong>
                      {pesanan.status_kirim === 'Diterima' ? 'Bukti Penerimaan:' : 'Bukti Pengiriman:'}
                    </strong>
                  </p>
                  <img 
                    src={`http://localhost:5000/uploads/${pesanan.bukti_pengiriman}`} 
                    alt="Bukti" 
                    style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', border: '1px solid #e0dccc' }} 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* CARD 4: PAY BOX (TRANSFER BANK WAITING) */}
        {!pesanan.bukti_transfer && pesanan.metode_pembayaran === 'Transfer Bank' && (
          <div className="pay-box" style={{ marginTop: '20px', padding: '30px', border: '1px solid #e67e22', borderRadius: '16px', background: '#fdf2e9', textAlign: 'center', boxShadow: '0 4px 15px rgba(230,126,34,0.1)', marginBottom: '30px' }}>
            <h3 style={{ color: '#d35400', margin: '0 0 10px 0', fontSize: '1.4rem' }}>Pesanan Menunggu Pembayaran</h3>
            <p style={{ margin: '0 0 20px 0', color: '#555', lineHeight: '1.6' }}>Silakan selesaikan pembayaran Anda via Transfer Bank / QRIS, kemudian unggah bukti pembayaran agar kami dapat segera memproses pesanan Anda.</p>
            <Link 
              to={`/pesanan/upload-bukti/${pesanan.id}`} 
              className="btn" 
              style={{ 
                background: 'linear-gradient(135deg, #e67e22, #d35400)', 
                color: 'white', 
                padding: '12px 30px', 
                borderRadius: '30px', 
                textDecoration: 'none', 
                fontWeight: 'bold', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                width: 'auto',
                boxShadow: '0 4px 15px rgba(230,126,34,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Bayar & Upload Bukti Pembayaran ➔
            </Link>
          </div>
        )}

        {/* CARD 5: PRODUK DIPESAN TABLE */}
        <h2 style={{ marginTop: '30px', fontSize: '1.4rem', color: '#4a2c2a', marginBottom: '15px' }}>Produk Dipesan</h2>

        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #e0dccc', marginBottom: '30px' }}>
          <table className="product-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#f8f4e9' }}>
                <th style={{ padding: '15px', borderBottom: '1px solid #e0dccc', textAlign: 'left', fontWeight: '600', color: '#4a2c2a' }}>Nama Produk</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e0dccc', textAlign: 'center', fontWeight: '600', color: '#4a2c2a' }}>Jumlah</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e0dccc', textAlign: 'right', fontWeight: '600', color: '#4a2c2a' }}>Harga Satuan</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #e0dccc', textAlign: 'right', fontWeight: '600', color: '#4a2c2a' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e0dccc' }}>
                  <td style={{ padding: '15px', textAlign: 'left', fontWeight: '500' }}>{item.nama_produk}</td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>{item.jumlah}</td>
                  <td style={{ padding: '15px', textAlign: 'right' }}>Rp {item.hargaSaat_pesan.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '15px', textAlign: 'right', fontWeight: '600', color: '#4a2c2a' }}>Rp {item.subtotal.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARD 6: CONFIRMATION BOX (COFFEE WORK) */}
        {pesanan.status_kirim === 'Dikirim' && (
          <div className="confirm-box" style={{ marginTop: '20px', padding: '30px', border: '1px solid #e0dccc', borderRadius: '16px', background: '#fdfbfa', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '1.25rem', color: '#4a2c2a', textAlign: 'center', fontWeight: '700' }}>Konfirmasi Pesanan Diterima</h3>
            <form onSubmit={handleTerimaPesanan} style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              
              {/* Coffee Styled Custom File Input */}
              <div className="file-input-wrapper" style={{ 
                border: '2px dashed #e67e22', 
                borderRadius: '12px', 
                padding: '20px', 
                background: '#fffcf9', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                display: 'block',
                textAlign: 'center',
                width: '100%',
                maxWidth: '450px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}>
                <span style={{ color: '#d35400', fontWeight: '600' }}>
                  {fotoBukti ? `Terpilih: ${fotoBukti.name}` : 'Upload Foto Bukti Penerimaan'}
                </span>
                <input 
                  type="file" 
                  name="foto_bukti" 
                  onChange={e => setFotoBukti(e.target.files[0])} 
                  required 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer'
                  }} 
                />
              </div>

              <button 
                type="submit" 
                className="btn" 
                style={{ 
                  cursor: 'pointer', 
                  width: 'auto', 
                  padding: '12px 40px', 
                  background: '#4a2c2a', 
                  color: 'white', 
                  borderRadius: '30px', 
                  fontWeight: 'bold', 
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(74, 44, 42, 0.3)',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
              >
                Pesanan Diterima
              </button>
            </form>
          </div>
        )}

        {/* CARD 7: ULASAN BUTTON (COFFEE WARM STYLE) */}
        {pesanan.status_pesanan === 'Selesai' && detail.length > 0 && (
          <div className="review-box" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link 
              to={`/ulasan/tambah/${detail[0].id_produk}`} 
              className="btn" 
              style={{ 
                width: 'auto',
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                textDecoration: 'none', 
                background: 'linear-gradient(135deg, #e67e22, #d35400)',
                color: 'white',
                padding: '12px 30px',
                borderRadius: '30px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(230,126,34,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              Beri Ulasan Produk
            </Link>
          </div>
        )}

      </div>
    </>
  );
};

export default PesananDetailUser;
