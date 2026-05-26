import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useParams, useNavigate, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);

  const [jumlah, setJumlah] = useState(1);
  const [alamat, setAlamat] = useState('');
  const [telepon, setTelepon] = useState('');
  const [catatan, setCatatan] = useState('');
  const [metodePembayaran, setMetodePembayaran] = useState('Transfer Bank');

  useEffect(() => {
    fetchProduk();
  }, [id]);

  const fetchProduk = async () => {
    try {
      const response = await api.get(`/produk/${id}`);
      setProduk(response.data.produk);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleJumlahChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (produk && val > produk.stok) val = produk.stok;
    setJumlah(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/pesanan/checkout', {
        items: [{ id_produk: produk.id, jumlah }],
        alamat: `${alamat} ${catatan ? `(Catatan: ${catatan})` : ''}`,
        telepon,
        metode_pembayaran: metodePembayaran
      });
      
      const { id_pesanan } = response.data;

      if (metodePembayaran === 'Transfer Bank') {
        Swal.fire({
          title: 'Pesanan Berhasil Dibuat!',
          text: 'Silakan lakukan pembayaran dan unggah bukti transfer agar pesanan Anda dapat diproses.',
          icon: 'success',
          confirmButtonText: 'Bayar & Upload Bukti',
          confirmButtonColor: '#e67e22'
        }).then(() => {
          navigate(`/pesanan/upload-bukti/${id_pesanan}`);
        });
      } else {
        Swal.fire({
          title: 'Pesanan Berhasil!',
          text: 'Pesanan Anda dengan metode Bayar di Tempat (COD) telah berhasil dibuat.',
          icon: 'success',
          confirmButtonText: 'Lihat Pesanan Saya',
          confirmButtonColor: '#e67e22'
        }).then(() => {
          navigate('/pesanan/saya');
        });
      }
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal melakukan checkout');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;
  if (!produk) return <div style={{ padding: '30px', textAlign: 'center' }}>Produk tidak ditemukan.</div>;

  const total = produk.harga * jumlah;

  return (
    <>
      <Navbar />

      <div className="main-container" style={{ marginTop: '40px', maxWidth: '850px' }}>
        <div className="katalog-header">
          <h1>Checkout Pesanan</h1>
          <p>Selesaikan pesanan Anda dengan melengkapi informasi di bawah ini</p>
        </div>

        {/* SUMMARY CARD */}
        <div className="produk-card" style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', background: '#ffffff', borderRadius: '16px', marginBottom: '30px', flexDirection: 'row' }}>
          <img 
            src={produk.gambar ? `http://localhost:5000/uploads/${produk.gambar}` : 'https://placehold.co/400x300?text=No+Image'} 
            alt={produk.nama_produk} 
            style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} 
          />
          <div style={{ textAlign: 'left', flex: 1 }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#3d2b1f', fontSize: '1.4rem' }}>{produk.nama_produk}</h3>
            <p style={{ margin: '0 0 12px 0', color: '#7f8c8d', fontSize: '0.95rem' }}>{produk.deskripsi?.substring(0, 80)}...</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ background: '#fdf2e9', color: '#e67e22', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>Stok: {produk.stok}</span>
              <h4 style={{ margin: 0, color: '#d35400', fontSize: '1.2rem' }}>Rp {(parseFloat(produk.harga) || 0).toLocaleString('id-ID')}</h4>
            </div>
          </div>
        </div>

        {/* CHECKOUT FORM */}
        <form onSubmit={handleSubmit} className="content-form" style={{ background: '#fcfaf8', padding: '35px', borderRadius: '20px', border: '1px solid #f0e6d2', boxShadow: '0 8px 25px rgba(0,0,0,0.03)' }}>
          <h2 style={{ color: '#4a2c2a', marginBottom: '25px', fontSize: '1.5rem', borderBottom: '2px solid #f0e6d2', paddingBottom: '10px' }}>Informasi Pengiriman</h2>
          
          <div className="form-row" style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e0dccc', marginBottom: '25px' }}>
            <div className="form-group" style={{ margin: 0, flex: 1 }}>
              <label htmlFor="jumlah" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#3d2b1f' }}>Jumlah Pembelian</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input 
                  type="number" 
                  name="jumlah" 
                  id="jumlah" 
                  value={jumlah} 
                  onChange={handleJumlahChange} 
                  min="1" 
                  max={produk.stok} 
                  required 
                  style={{ width: '90px', padding: '10px', borderRadius: '8px', border: '2px solid #e67e22', textAlign: 'center', fontSize: '1.1rem', fontWeight: 'bold', color: '#d35400' }} 
                />
                <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>Bungkus / Pcs</span>
              </div>
            </div>
            <div className="total-display" style={{ textAlign: 'right', flex: 1 }}>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '1rem' }}>Total Pembayaran</p>
              <h2 style={{ margin: 0, color: '#d35400', fontSize: '1.8rem' }}>Rp {(parseFloat(total) || 0).toLocaleString('id-ID')}</h2>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="alamat" style={{ fontWeight: '600', color: '#3d2b1f' }}>Alamat Lengkap Pengiriman</label>
            <textarea 
              id="alamat" 
              name="alamat" 
              required 
              placeholder="Masukkan nama jalan, RT/RW, kelurahan, kecamatan, dan kota..."
              value={alamat}
              onChange={e => setAlamat(e.target.value)}
              style={{ width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #dcdcdc', minHeight: '100px', marginTop: '8px', fontSize: '0.95rem' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label htmlFor="telepon" style={{ fontWeight: '600', color: '#3d2b1f' }}>Nomor WhatsApp</label>
              <input 
                type="text" 
                id="telepon" 
                name="telepon" 
                required 
                placeholder="08xxxxxxxxxx"
                value={telepon}
                onChange={e => setTelepon(e.target.value)}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #dcdcdc', marginTop: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div className="form-group" style={{ flex: 1, margin: 0 }}>
              <label htmlFor="catatan" style={{ fontWeight: '600', color: '#3d2b1f' }}>Catatan (opsional)</label>
              <input 
                type="text" 
                id="catatan" 
                name="catatan" 
                placeholder="Contoh: Titip di pos satpam"
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #dcdcdc', marginTop: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label htmlFor="metode_pembayaran" style={{ fontWeight: '600', color: '#3d2b1f' }}>Metode Pembayaran</label>
            <select 
              id="metode_pembayaran" 
              name="metode_pembayaran" 
              required
              value={metodePembayaran}
              onChange={e => setMetodePembayaran(e.target.value)}
              style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #dcdcdc', marginTop: '8px', background: '#fff', fontSize: '1rem', color: '#3d2b1f' }}
            >
              <option value="Transfer Bank">Transfer Bank (Verifikasi Manual)</option>
              <option value="COD">Bayar di Tempat (COD)</option>
            </select>
          </div>
          
          <div className="form-actions" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Link to="/produk" className="btn-detail" style={{ textDecoration: 'none', padding: '14px 25px', borderRadius: '12px', background: '#f5f5f5', color: '#333', border: 'none', fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Batal</Link>
            <button type="submit" className="btn-beli" style={{ cursor: 'pointer', padding: '14px 25px', borderRadius: '12px', background: 'linear-gradient(135deg, #e67e22, #d35400)', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', flex: 2 }}>Konfirmasi & Buat Pesanan</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Checkout;
