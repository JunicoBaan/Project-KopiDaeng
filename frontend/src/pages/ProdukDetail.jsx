import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const ProdukDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [produk, setProduk] = useState(null);
  const [ulasan, setUlasan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await api.get(`/produk/${id}`);
      setProduk(response.data.produk);
      setUlasan(response.data.ulasan || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getAverageRating = () => {
    if (ulasan.length === 0) return 0;
    const total = ulasan.reduce((acc, curr) => acc + curr.rating, 0);
    return total / ulasan.length;
  };

  const avgRating = getAverageRating();

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;
  if (!produk) return <div style={{ padding: '30px', textAlign: 'center' }}>Produk tidak ditemukan.</div>;

  return (
    <>
      <Navbar />

      <div className="main-container detail-produk" style={{ padding: '30px' }}>

        {/* ================== PRODUK ================== */}
        <div className="produk-wrapper" style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>

          {/* GAMBAR */}
          <div className="produk-gambar" style={{ width: '350px', height: '350px', borderRadius: '15px', overflow: 'hidden', flexShrink: 0 }}>
            <img 
              src={produk.gambar ? `http://localhost:5000/uploads/${produk.gambar}` : 'https://placehold.co/400x300?text=No+Image'} 
              alt={produk.nama_produk} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* INFO PRODUK */}
          <div className="produk-info" style={{ flex: 1 }}>
            <h1>{produk.nama_produk}</h1>

            {/* RATING */}
            <div className="rating-box">
              {ulasan.length > 0 ? (
                <>
                  <span className="rating-stars" style={{ color: 'gold', fontSize: '20px' }}>
                    {Array.from({ length: Math.round(avgRating) }).map((_, i) => (
                      <span key={i}>★ </span>
                    ))}
                  </span>
                  <span>{avgRating.toFixed(1)} • {ulasan.length} ulasan</span>
                </>
              ) : (
                <span>Belum ada ulasan</span>
              )}
            </div>

            <h2>Rp {parseFloat(produk.harga).toLocaleString('id-ID')}</h2>

            <p style={{ lineHeight: '1.8', color: '#555', marginBottom: '25px', fontSize: '1.05rem' }}>{produk.deskripsi}</p>

            <Link 
              to={`/pesanan/tambah/${produk.id}`} 
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  Swal.fire({
                    title: 'Oops!',
                    text: 'Silakan login terlebih dahulu untuk melakukan pesanan.',
                    icon: 'warning',
                    confirmButtonText: 'Login Sekarang',
                    confirmButtonColor: '#e67e22'
                  }).then((result) => {
                    if (result.isConfirmed || result.isDismissed) {
                      navigate('/login');
                    }
                  });
                }
              }}
              style={{ 
                textDecoration: 'none', 
                display: 'inline-flex', 
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #e67e22, #d35400)', 
                color: 'white', 
                padding: '14px 32px', 
                borderRadius: '30px', 
                fontWeight: 'bold', 
                fontSize: '1.1rem', 
                boxShadow: '0 6px 20px rgba(230,126,34,0.3)', 
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(230,126,34,0.4)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(230,126,34,0.3)';
              }}
            >
              🛒 Pesan Sekarang
            </Link>
          </div>

        </div>

        <hr style={{ margin: '30px 0', border: 'none', borderBottom: '1px solid #f5f1f1' }} />

        {/* ================== ULASAN ================== */}
        <h2>Ulasan Pelanggan</h2>

        {ulasan.length === 0 && <p>Belum ada ulasan untuk produk ini.</p>}

        <div id="ulasanContainer">
          {ulasan.map((u, index) => (
            <div 
              key={index} 
              className="ulasan-card ulasan-item" 
              style={{ 
                display: !showAllReviews && index >= 3 ? 'none' : 'block',
                background: 'white', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '15px', 
                border: '1px solid #eee' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <strong style={{ color: '#3d2b1f', fontSize: '1.1rem' }}>{u.nama_user || 'Pengguna Anonim'}</strong>
                <div className="ulasan-rating" style={{ color: 'gold', fontSize: '16px' }}>
                  {Array.from({ length: u.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              <p style={{ margin: '10px 0', color: '#555', lineHeight: '1.6' }}>{u.komentar}</p>

              <small style={{ color: '#999', fontSize: '0.85rem' }}>{new Date(u.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
            </div>
          ))}
        </div>

        {ulasan.length > 3 && (
          <button 
            className="btn-lihat" 
            style={{ background: '#d87a2f', color: 'white', padding: '8px 16px', borderRadius: '8px', marginTop: '10px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? "Tutup" : "Lihat Semua"}
          </button>
        )}

      </div>
    </>
  );
};

export default ProdukDetail;
