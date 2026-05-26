import { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { useNavigate, Link } from 'react-router-dom';

import Swal from 'sweetalert2';
const AdminProdukTambah = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_produk: '',
    id_kategori: '',
    deskripsi: '',
    harga: '',
    stok: ''
  });
  const [gambar, setGambar] = useState(null);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const response = await api.get('/produk/kategori/all');
      const list = response.data.kategori || [];
      setKategoriList(list);
      if (list.length > 0) {
        setFormData(prev => ({ ...prev, id_kategori: list[0].id.toString() }));
      }
    } catch (err) {
      console.error('Failed to fetch kategori list', err);
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
    if (gambar) {
      data.append('gambar', gambar);
    }

    try {
      await api.post('/produk', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Produk berhasil ditambahkan!');
      navigate('/admin/produk');
    } catch (err) {
      Swal.fire(err.response?.data?.message || 'Gagal menambahkan produk');
    }
  };

  return (
    <div className="dashboard-body" style={{ margin: 0, padding: 0, minHeight: '100vh', background: 'transparent' }}>
      <div className="main-container dashboard-page-wrapper">
        <SidebarAdmin active="produk" />

        <main className="dashboard-main-content">
          <div className="header-section">
            <h1>Tambah Produk Baru</h1>
          </div>

          <form onSubmit={handleSubmit} className="content-form">
            <div className="form-group">
              <label htmlFor="nama_produk">Nama Produk</label>
              <input type="text" id="nama_produk" name="nama_produk" placeholder="Contoh: Kopi Arabika Toraja" value={formData.nama_produk} onChange={handleChange} required />
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
              <textarea id="deskripsi" name="deskripsi" placeholder="Jelaskan keunikan produk kopi Anda di sini..." value={formData.deskripsi} onChange={handleChange} required></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="harga">Harga (Rp)</label>
              <input type="number" id="harga" name="harga" placeholder="Contoh: 25000 (tulis angka saja)" value={formData.harga} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="stok">Stok</label>
              <input type="number" id="stok" name="stok" value={formData.stok} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="gambar">Gambar Produk</label>
              <div className="file-input-wrapper" style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%', background: '#f8f4e9', border: '2px dashed #d35400', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <input type="file" name="gambar" id="gambar" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                <span className="file-input-label" style={{ display: 'block', fontWeight: 'bold', color: '#d35400', marginBottom: '5px' }}>
                  {gambar ? gambar.name : 'Klik atau seret gambar ke sini'}
                </span>
                <span className="file-input-hint" style={{ fontSize: '12px', color: '#888' }}>JPG, PNG, atau WEBP.</span>
              </div>
            </div>
            
            <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <button type="submit" className="btn" style={{ cursor: 'pointer' }}>Simpan Produk</button>
              <Link to="/admin/produk" className="link-kembali" style={{ color: '#d35400', textDecoration: 'none', fontWeight: 'bold' }}>Batal</Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AdminProdukTambah;
