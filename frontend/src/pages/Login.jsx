import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login } = useContext(AuthContext);
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
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/produk');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h1>KopiDaeng</h1>
      <h2>Selamat Datang Kembali</h2>

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
        <button type="submit" className="btn">Login</button>
      </form>

      <p className="bottom-link">
        Belum punya akun? <Link to="/register">Daftarlah di sini</Link>
      </p>
    </div>
  );
};

export default Login;
