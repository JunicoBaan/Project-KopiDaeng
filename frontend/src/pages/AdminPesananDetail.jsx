import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useParams, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminPesananDetail = () => {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form pengiriman
  const [jasaKurir, setJasaKurir] = useState('');
  const [nomorResi, setNomorResi] = useState('');
  const [tanggalKirim, setTanggalKirim] = useState('');
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

  const handlePengirimanSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('id_pesanan', pesanan.id);
    formData.append('jasa_kurir', jasaKurir);
    formData.append('nomor_resi', nomorResi);
    formData.append('tanggal_kirim', tanggalKirim);
    if (fotoBukti) {
      formData.append('foto_bukti', fotoBukti);
    }

    try {
      await api.post('/pengiriman/tambah', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Informasi pengiriman berhasil disimpan!');
      fetchDetail(); // reload
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal menyimpan pengiriman');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;
  if (!pesanan) return <div style={{ padding: '30px', textAlign: 'center' }}>Pesanan tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      <div className="main-container">
        <div className="header-section">
          <h1>Detail Pesanan #{pesanan.id}</h1>
          <Link to="/admin/pesanan" className="btn" style={{ textDecoration: 'none' }}>← Kembali ke Daftar Pesanan</Link>
        </div>

        {/* ======== Info Pesanan ======== */}
        <div className="order-info" style={{ marginBottom: '20px' }}>
          <p><strong>Nama Pelanggan:</strong> {pesanan.nama_pelanggan}</p>
          <p><strong>Email:</strong> {pesanan.email}</p>
          <p><strong>Tanggal Pesanan:</strong> {new Date(pesanan.tanggal_pesanan).toLocaleString('id-ID')}</p>
          <p><strong>Status Pesanan:</strong> {pesanan.status_pesanan}</p>
          <p><strong>Total Harga:</strong> Rp {pesanan.total_harga.toLocaleString('id-ID')}</p>
        </div>

        {/* ======== Tabel Produk Dipesan ======== */}
        <h2>Daftar Produk Dipesan</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="product-table" style={{ width: '100%', marginBottom: '30px' }}>
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Jumlah</th>
                <th>Harga Satuan</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detail.length > 0 ? (
                detail.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.nama_produk}</td>
                    <td>{d.jumlah}</td>
                    <td>Rp {d.hargaSaat_pesan.toLocaleString('id-ID')}</td>
                    <td>Rp {d.subtotal.toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Tidak ada item di pesanan ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ======== Informasi Pengiriman ======== */}
        <hr style={{ margin: '30px 0', border: '1px solid #ddd' }} />
        <h2>Informasi Pengiriman</h2>

        {!pesanan.jasa_kurir ? (
          <form onSubmit={handlePengirimanSubmit} className="form-pengiriman" style={{ background: '#f8f4e9', padding: '20px', borderRadius: '10px' }}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Jasa Kurir</label>
              <input type="text" value={jasaKurir} onChange={e => setJasaKurir(e.target.value)} placeholder="Contoh: JNE, SiCepat" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Nomor Resi</label>
              <input type="text" value={nomorResi} onChange={e => setNomorResi(e.target.value)} placeholder="Masukkan nomor resi" required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Tanggal Kirim</label>
              <input type="date" value={tanggalKirim} onChange={e => setTanggalKirim(e.target.value)} required style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Foto Bukti Pengiriman (Opsional)</label>
              <input type="file" accept="image/*" onChange={e => setFotoBukti(e.target.files[0])} />
            </div>

            <button type="submit" className="btn" style={{ cursor: 'pointer' }}>Simpan Pengiriman</button>
          </form>
        ) : (
          <div className="info-box" style={{ background: '#e9f8ee', padding: '20px', borderRadius: '10px' }}>
            <p><strong>Kurir:</strong> {pesanan.jasa_kurir}</p>
            <p><strong>Nomor Resi:</strong> {pesanan.nomor_resi}</p>
            <p><strong>Status Kirim:</strong> {pesanan.status_kirim}</p>
            <p><strong>Tanggal Kirim:</strong> {pesanan.tanggal_kirim ? new Date(pesanan.tanggal_kirim).toLocaleDateString('id-ID') : '-'}</p>
            {pesanan.foto_bukti && (
              <>
                <p><strong>Foto Bukti:</strong></p>
                <img src={`http://localhost:5000/uploads/${pesanan.foto_bukti}`} alt="Bukti Pengiriman" style={{ width: '200px', borderRadius: '8px', marginTop: '10px' }} />
              </>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default AdminPesananDetail;
