import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
const UploadBukti = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pesanan, setPesanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bank');
  const [selectedBank, setSelectedBank] = useState('');
  const [showQris, setShowQris] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/pesanan/detail/${id}`);
      setPesanan(response.data.pesanan);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire("Pilih file bukti terlebih dahulu");
      return;
    }
    const formData = new FormData();
    formData.append('bukti_transfer', file);

    try {
      await api.post(`/pesanan/upload-bukti/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Bukti pembayaran berhasil dikirim!');
      navigate('/pesanan/saya');
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal upload bukti');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;
  if (!pesanan) return <div style={{ padding: '30px', textAlign: 'center' }}>Pesanan tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      <div className="main-container pay-container" style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>

        <h1>Upload Bukti Pembayaran</h1>
        <p>Total yang harus dibayar:</p>
        <h2 style={{ color: '#d35400' }}>
          Rp {pesanan.total_harga.toLocaleString('id-ID')}
        </h2>

        {/* PAYMENT TABS */}
        <div className="pay-tabs" style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', gap: '10px' }}>
          <button className={`tab-btn ${activeTab === 'bank' ? 'active' : ''}`} onClick={() => setActiveTab('bank')} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none', background: activeTab === 'bank' ? '#d35400' : '#eee', color: activeTab === 'bank' ? 'white' : 'black' }}>Transfer Bank</button>
          <button className={`tab-btn ${activeTab === 'qris' ? 'active' : ''}`} onClick={() => setActiveTab('qris')} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none', background: activeTab === 'qris' ? '#d35400' : '#eee', color: activeTab === 'qris' ? 'white' : 'black' }}>QRIS</button>
        </div>

        {/* BANK TRANSFER SECTION */}
        {activeTab === 'bank' && (
          <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '15px', padding: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', marginBottom: '25px' }}>
            <h3>Pilih Bank</h3>

            <div className={`bank-option ${selectedBank === 'bca' ? 'selected' : ''}`} onClick={() => setSelectedBank('bca')} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', marginBottom: '12px', borderRadius: '10px', background: selectedBank === 'bca' ? '#fff7e6' : '#fff', cursor: 'pointer', border: `2px solid ${selectedBank === 'bca' ? '#d35400' : 'transparent'}` }}>
              <img src="/images/bca.png" alt="BCA" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <b>BCA</b><br />
                1234567890 a.n Junico
              </div>
            </div>

            <div className={`bank-option ${selectedBank === 'bri' ? 'selected' : ''}`} onClick={() => setSelectedBank('bri')} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', marginBottom: '12px', borderRadius: '10px', background: selectedBank === 'bri' ? '#fff7e6' : '#fff', cursor: 'pointer', border: `2px solid ${selectedBank === 'bri' ? '#d35400' : 'transparent'}` }}>
              <img src="/images/bri.png" alt="BRI" style={{ width: '80px', height: 'auto', objectFit: 'contain' }} />
              <div style={{ flex: 1, textAlign: 'left' }}>
                <b>BRI</b><br />
                9876543210 a.n Junico
              </div>
            </div>
          </div>
        )}

        {/* QRIS SECTION */}
        {activeTab === 'qris' && (
          <div className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '15px', padding: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', marginBottom: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Scan QRIS untuk Membayar</h3>
            <img src="/images/qris.png" alt="QRIS KopiDaeng" style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <p style={{ fontSize: '0.9rem', color: '#7f8c8d', margin: 0 }}>Atas Nama: <b>Junico / KopiDaeng</b></p>
          </div>
        )}

        {/* FORM UPLOAD */}
        <form onSubmit={handleSubmit} className="glass-card" style={{ background: 'rgba(255, 255, 255, 0.7)', borderRadius: '15px', padding: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', marginBottom: '25px' }}>
          <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Upload Bukti Pembayaran</label>
            <input type="file" name="bukti_transfer" onChange={e => setFile(e.target.files[0])} required />
          </div>

          <button type="submit" className="btn" style={{ cursor: 'pointer' }}>Kirim Bukti Pembayaran</button>
        </form>

      </div>

      {/* QRIS MODAL */}
      <div className="modal-bg" style={{ display: showQris ? 'flex' : 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <div className="modal-box" style={{ background: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h3>Silakan Scan QRIS</h3>
          <p>(Simulasi Gambar QRIS)</p>
          <br />
          <button className="close-modal" onClick={() => setShowQris(false)} style={{ background: '#d35400', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Tutup</button>
        </div>
      </div>
    </>
  );
};

export default UploadBukti;
