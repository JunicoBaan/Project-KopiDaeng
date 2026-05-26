import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './ProdukList.css';

const ProdukList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const queryParams = new URLSearchParams(location.search);
  const urlQuery = queryParams.get('q') || '';

  const [produk, setProduk] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchProduk(urlQuery);
  }, [urlQuery]);

  const fetchProduk = async (query = '') => {
    try {
      const response = await api.get(`/produk?q=${encodeURIComponent(query)}`);
      setProduk(response.data.produk || []);
    } catch (err) {
      console.error('Failed to fetch produk', err);
    }
  };

  const showDetail = (nama, gambar, deskripsi) => {
    setModalData({ nama, gambar, deskripsi });
  };

  const closeModal = () => {
    setModalData(null);
  };

  return (
    <>
      <Navbar query={urlQuery} onSearch={(q) => fetchProduk(q)} />

      <div className="main-container" style={{ marginTop: '40px' }}>
        <div className="produk-grid">
          {produk.length > 0 ? (
            produk.map((p) => (
              <div key={p.id} className="produk-card">
                <div className="img-container">
                  <span className={`badge-stok ${p.stok <= 0 ? 'habis' : ''}`}>
                    {p.stok > 0 ? `Sisa: ${p.stok}` : 'Habis'}
                  </span>
                  <img 
                    src={p.gambar ? `http://localhost:5000/uploads/${p.gambar}` : 'https://placehold.co/400x300?text=No+Image'} 
                    alt={p.nama_produk}
                    className="produk-gambar"
                  />
                </div>

                <div className="produk-content">
                  <h3 className="produk-nama">{p.nama_produk}</h3>

                  {/* RATING */}
                  <div className="produk-rating" style={{ margin: '15px 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: 'gold', fontSize: '18px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} style={{ color: i < Math.round(p.avg_rating || 0) ? 'gold' : '#e0e0e0' }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: '500' }}>
                      {p.avg_rating > 0 ? `${parseFloat(p.avg_rating).toFixed(1)} (${p.ulasan_count})` : 'Belum ada ulasan'}
                    </span>
                  </div>

                  <div className="produk-footer">
                    <p className="produk-harga">
                      Rp {parseFloat(p.harga).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="btn-group">
                    <Link to={`/produk/detail/${p.id}`} className="btn-detail">
                      <i className="fa-solid fa-eye"></i> Detail
                    </Link>

                    {p.stok > 0 ? (
                      <Link 
                        to={`/pesanan/tambah/${p.id}`} 
                        className="btn-beli"
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
                      >
                        <i className="fa-solid fa-cart-plus"></i> Pesan
                      </Link>
                    ) : (
                      <button className="btn-disabled" disabled>
                        <i className="fa-solid fa-ban"></i> Habis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#7f8c8d' }}>
              <h3>Kopi tidak ditemukan</h3>
              <p>Coba gunakan kata kunci lain.</p>
            </div>
          )}
        </div>
      </div>

      {/* POPUP */}
      <div className="modal-bg" style={{ display: modalData ? 'flex' : 'none' }}>
        {modalData && (
          <div className="modal-box">
            <img src={modalData.gambar} className="modal-img" alt="Detail" />
            <h3 className="modal-title">{modalData.nama}</h3>
            <p className="modal-text">{modalData.deskripsi}</p>
            <div className="modal-close" onClick={closeModal}>Tutup</div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ProdukList;
