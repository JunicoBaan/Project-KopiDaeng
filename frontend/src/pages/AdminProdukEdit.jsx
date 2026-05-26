import { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { useNavigate, useParams, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminProdukEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_produk: '',
    id_kategori: '1',
    deskripsi: '',
    harga: '',
    stok: '',
    old_gambar: ''
  });
  const [gambar, setGambar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    fetchProdukAndKategori();
  }, [id]);

  const fetchProdukAndKategori = async () => {
    try {
      const [resKategori, resProduk] = await Promise.all([
        api.get('/produk/kategori/all'),
        api.get(`/produk/${id}`)
      ]);

      setKategoriList(resKategori.data.kategori || []);

      const p = resProduk.data.produk;
      setFormData({
        nama_produk: p.nama_produk,
        id_kategori: p.id_kategori ? p.id_kategori.toString() : '1',
        deskripsi: p.deskripsi,
        harga: p.harga,
        stok: p.stok,
        old_gambar: p.gambar || ''
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGambar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nama_produk', formData.nama_produk);
    data.append('id_kategori', formData.id_kategori);
    data.append('deskripsi', formData.deskripsi);
    data.append('harga', formData.harga);
    data.append('stok', formData.stok);
    data.append('old_gambar', formData.old_gambar);
    if (gambar) {
      data.append('gambar', gambar);
    }

    try {
      // the backend route is POST /produk/edit/:id
      await api.post(`/produk/edit/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Produk berhasil diperbarui!');
      navigate('/admin/produk');
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal memperbarui produk');
    }
  };

  if (loading) return <div style={{ padding: '30px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'transparent' }}>
      <div className="main-container dashboard-page-wrapper">
        <SidebarAdmin active="produk" />

        <main className="dashboard-main-content">
          <div className="header-section">
            <h1>Edit Produk</h1>
          </div>

          <form onSubmit={handleSubmit} className="content-form">
            <div className="form-group">
              <label htmlFor="nama_produk">Nama Produk</label>
              <input type="text" id="nama_produk" name="nama_produk" value={formData.nama_produk} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="id_kategori">Kategori</label>
              <select 
                id="id_kategori" 
                name="id_kategori" 
                value={formData.id_kategori} 
                onChange={handleChange} 
                required
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '10px',
                  border: '1px solid #dcdcdc',
                  background: '#fff',
                  fontSize: '1rem',
                  color: '#3d2b1f',
                  boxSizing: 'border-box',
                  marginTop: '8px'
                }}
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                {kategoriList.map(kat => (
                  <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="deskripsi">Deskripsi</label>
              <textarea id="deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="harga">Harga (Rp)</label>
              <input type="number" id="harga" name="harga" value={formData.harga} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="stok">Stok</label>
              <input type="number" id="stok" name="stok" value={formData.stok} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="gambar">Gambar Produk</label>
              {formData.old_gambar && (
                <img src={`http://localhost:5000/uploads/${formData.old_gambar}`} alt="Gambar saat ini" className="current-product-image" style={{ display: 'block', maxWidth: '200px', marginBottom: '15px', borderRadius: '8px' }} />
              )}
              <div className="file-input-wrapper" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%', background: '#f8f4e9', border: '2px dashed #d35400', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <input type="file" name="gambar" id="gambar" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <span className="file-input-label" style={{ display: 'block', fontWeight: 'bold', color: '#d35400', marginBottom: '5px' }}>
                  {gambar ? gambar.name : 'Ganti gambar (klik atau seret)'}
                </span>
                <span className="file-input-hint" style={{ fontSize: '12px', color: '#888' }}>Biarkan kosong jika tidak ingin mengganti gambar.</span>
              </div>
            </div>
            
            <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button type="submit" className="btn" style={{ cursor: 'pointer' }}>Perbarui Produk</button>
              <Link to="/admin/produk" className="link-kembali" style={{ color: '#d35400', textDecoration: 'none', fontWeight: 'bold' }}>Batal</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdminProdukEdit;
