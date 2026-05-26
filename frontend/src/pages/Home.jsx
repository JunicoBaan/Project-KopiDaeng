import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [produkBest, setProdukBest] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const fetchBestSellers = async () => {
    try {
      const response = await api.get('/produk');
      setProdukBest(response.data.produk.slice(0, 4)); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produk?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNavbarSearch = (query) => {
    navigate(`/produk?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="home-page">
      <Navbar onSearch={handleNavbarSearch} />

      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Kopi Asli <span>Nusantara</span></h1>
          <p className="hero-subtitle">Dari biji kopi pilihan terbaik, diolah dengan sepenuh hati untuk menghadirkan secangkir semangat setiap hari.</p>
          
          <form className="hero-search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              className="hero-search-input" 
              placeholder="Cari kopi favoritmu" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">Cari Kopi</button>
          </form>

          <Link to="/produk" className="btn-home">Eksplor Katalog</Link>
        </div>
      </header>

      {/* FEATURES SECTION */}
      <section className="section" style={{ background: '#fdfbf7' }}>
        <h2 className="section-title">Mengapa KopiDaeng?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-award" style={{ color: '#e67e22', fontSize: '3rem' }}></i></div>
            <h3 className="feature-title">Biji Premium</h3>
            <p className="feature-text">Kami hanya memilih biji kopi kualitas terbaik langsung dari petani lokal tersertifikasi.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-fire-burner" style={{ color: '#e74c3c', fontSize: '3rem' }}></i></div>
            <h3 className="feature-title">Roasting Segar</h3>
            <p className="feature-text">Kopi dipanggang segar setiap hari untuk memastikan aroma dan rasa yang optimal.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><i className="fa-solid fa-truck-fast" style={{ color: '#3498db', fontSize: '3rem' }}></i></div>
            <h3 className="feature-title">Pengiriman Cepat</h3>
            <p className="feature-text">Pesanan Anda dikemas dengan aman dan dikirim ke seluruh penjuru Indonesia.</p>
          </div>
        </div>
      </section>

      {/* BEST SELLER SECTION */}
      <section className="section best-seller-bg" style={{ background: '#fff' }}>
        <h2 className="section-title">Produk Terlaris</h2>
        <div className="product-marquee-wrapper">
          <div className="product-marquee">
            {produkBest.length > 0 ? (
              [...produkBest, ...produkBest].map((item, index) => (
                <div key={`${item.id}-${index}`} className="marquee-product-card">
                  <div style={{ height: '220px', overflow: 'hidden', padding: '15px', boxSizing: 'border-box' }}>
                    <img 
                      src={`http://localhost:5000/uploads/${item.gambar}`} 
                      alt={item.nama_produk} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.5s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#3d2b1f', margin: '0 0 10px 0', fontWeight: '700' }}>{item.nama_produk}</h3>
                    <p style={{ fontWeight: '800', color: '#e67e22', fontSize: '1.3rem', margin: '0 0 20px 0' }}>
                      Rp {parseFloat(item.harga).toLocaleString('id-ID')}
                    </p>
                    <Link to={`/produk/detail/${item.id}`} style={{ marginTop: 'auto', background: '#fdf2e9', color: '#e67e22', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', border: '1px solid #fae5d3', transition: '0.3s' }} onMouseOver={e => {e.currentTarget.style.background = '#fae5d3'; e.currentTarget.style.color = '#d35400'}} onMouseOut={e => {e.currentTarget.style.background = '#fdf2e9'; e.currentTarget.style.color = '#e67e22'}}>
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>Tidak ada data best seller.</p>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link to="/produk" className="btn-home" style={{ background: 'transparent', border: '2px solid #e67e22', color: '#e67e22' }}>Lihat Semua Produk ➔</Link>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section id="testimoni" className="testimonial-section">
        <div className="testimonial-container">
          <h2 className="section-title" style={{ color: 'white' }}>Apa Kata Mereka?</h2>
          <div className="testimonial-marquee-wrapper">
            <div className="testimonial-marquee">
              {/* ORIGINAL CARDS */}
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "KopiDaeng memberikan pengalaman ngopi yang luar biasa. Aroma Kopi Arabika Toraja-nya benar-benar juara. Sangat direkomendasikan bagi pecinta kopi sejati!"
                </p>
                <div>
                  <div className="testimonial-author">Ahmad Ridwan</div>
                  <div className="testimonial-role">Barista & Coffee Enthusiast</div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "Setiap pagi selalu diawali dengan secangkir Robusta Jawa dari KopiDaeng. Rasanya kuat, pekat, dan benar-benar membangkitkan semangat kerja seharian!"
                </p>
                <div>
                  <div className="testimonial-author">Sarah Maulina</div>
                  <div className="testimonial-role">Pekerja Lepas</div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "Kualitas bijinya tidak pernah mengecewakan. Roastingnya pas dan pengirimannya selalu cepat. KopiDaeng kini jadi langganan wajib di kedai saya."
                </p>
                <div>
                  <div className="testimonial-author">Budi Santoso</div>
                  <div className="testimonial-role">Pemilik Kedai Kopi</div>
                </div>
              </div>

              {/* DUPLICATE CARDS FOR INFINITE SCROLL */}
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "KopiDaeng memberikan pengalaman ngopi yang luar biasa. Aroma Kopi Arabika Toraja-nya benar-benar juara. Sangat direkomendasikan bagi pecinta kopi sejati!"
                </p>
                <div>
                  <div className="testimonial-author">Ahmad Ridwan</div>
                  <div className="testimonial-role">Barista & Coffee Enthusiast</div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "Setiap pagi selalu diawali dengan secangkir Robusta Jawa dari KopiDaeng. Rasanya kuat, pekat, dan benar-benar membangkitkan semangat kerja seharian!"
                </p>
                <div>
                  <div className="testimonial-author">Sarah Maulina</div>
                  <div className="testimonial-role">Pekerja Lepas</div>
                </div>
              </div>

              <div className="testimonial-card">
                <p className="testimonial-quote">
                  "Kualitas bijinya tidak pernah mengecewakan. Roastingnya pas dan pengirimannya selalu cepat. KopiDaeng kini jadi langganan wajib di kedai saya."
                </p>
                <div>
                  <div className="testimonial-author">Budi Santoso</div>
                  <div className="testimonial-role">Pemilik Kedai Kopi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT COMPACT */}
      <section id="about" className="section" style={{ background: '#fdfbf7' }}>
        <div className="about-compact">
          <div className="about-text">
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px' }}>Sejarah KopiDaeng</h2>
            <p style={{ color: '#7f8c8d', lineHeight: 1.8, marginBottom: '20px' }}>
              Berdiri sejak tahun 2018, KopiDaeng bermula dari sebuah garasi kecil di sudut kota dengan satu misi sederhana: membawa biji kopi Nusantara kualitas terbaik langsung ke cangkir Anda. 
              Berawal dari kecintaan sang pendiri terhadap hasil bumi lokal, kami mulai menjelajahi berbagai perkebunan di pelosok Indonesia, menjalin kemitraan langsung dengan para petani yang berdedikasi tinggi.
            </p>
            <p style={{ color: '#7f8c8d', lineHeight: 1.8, marginBottom: '30px' }}>
              Kini, KopiDaeng telah bertumbuh menjadi jembatan antara kekayaan alam Nusantara dan para penikmat kopi sejati. Kami memastikan setiap biji disangrai dengan sempurna untuk mengeluarkan potensi rasa dan aroma terbaiknya.
            </p>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '15px', color: '#e67e22' }}>Informasi Kontak</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#3d2b1f', fontWeight: 500, lineHeight: 2 }}>
              <li><i className="fa-solid fa-map-location-dot" style={{ width: '25px', color: '#e67e22' }}></i> Center Point of Indonesia, Makassar, Sulawesi Selatan</li>
              <li><i className="fa-solid fa-envelope" style={{ width: '25px', color: '#e67e22' }}></i> kopidaeng@gmail.com</li>
              <li><i className="fa-brands fa-whatsapp" style={{ width: '25px', color: '#e67e22' }}></i> 0823-9305-8060</li>
            </ul>
          </div>
          <div className="about-img">
            <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Tentang KopiDaeng" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
