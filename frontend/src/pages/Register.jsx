import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-hide alert mimic
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/users/register', { nama, email, password });
      setSuccessMsg('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal registrasi');
    }
  };

  return (
    <div className="auth-container">
      <h1>KopiDaeng</h1>
      <h2>Buat Akun Baru</h2>

      {successMsg && (
        <div className="alert success" style={{ transition: 'opacity 0.5s ease' }}>{successMsg}</div>
      )}

      {errorMsg && (
        <div className="alert error" style={{ transition: 'opacity 0.5s ease' }}>{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
        {/* Dummy inputs to catch browser's aggressive auto-fill */}
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="password" style={{ display: 'none' }} aria-hidden="true" />

        <div className="form-group">
          <input 
            type="text" 
            name="nama" 
            placeholder="Nama Lengkap" 
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            autoComplete="new-name"
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="new-email"
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required 
          />
        </div>
        <button type="submit" className="btn">Daftar</button>
      </form>

      <p className="bottom-link">
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
};

export default Register;
