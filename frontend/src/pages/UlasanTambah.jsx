import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
const UlasanTambah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/produk/${id}/ulasan`, { rating, komentar });
      Swal.fire('Ulasan berhasil dikirim!');
      navigate(`/produk/detail/${id}`);
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal mengirim ulasan');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;
  if (!produk) return <div style={{ padding: '30px', textAlign: 'center' }}>Produk tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      <div className="main-container">
        <h1>Beri Ulasan untuk {produk.nama_produk}</h1>

        <form onSubmit={handleSubmit}>
          <label>Rating:</label>
          <div id="ratingBox" style={{ marginBottom: '20px' }}>
            {[1, 2, 3, 4, 5].map(val => (
              <span 
                key={val} 
                className={`rating-star ${rating >= val ? 'active' : ''}`} 
                onClick={() => setRating(val)}
                style={{ fontSize: '35px', cursor: 'pointer', color: rating >= val ? 'gold' : '#ccc' }}
              >
                ★
              </span>
            ))}
          </div>

          <label>Komentar:</label><br />
          <textarea 
            name="komentar" 
            rows="4" 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} 
            placeholder="Tulis ulasanmu..."
            value={komentar}
            onChange={e => setKomentar(e.target.value)}
            required
          ></textarea>

          <br /><br />
          <button className="btn" type="submit" style={{ cursor: 'pointer' }}>Kirim Ulasan</button>
        </form>
      </div>
    </>
  );
};

export default UlasanTambah;
