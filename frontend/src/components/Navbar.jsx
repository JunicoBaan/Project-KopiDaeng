import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ query = '', onSearch }) => {
  const { user, logout } = useContext(AuthContext);
  const [search, setSearch] = useState(query);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(search);
    } else {
      navigate(`/produk?q=${search}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHashClick = (e, hashId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/#${hashId}`);
      setTimeout(() => {
        const element = document.getElementById(hashId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    } else {
      navigate(`/#${hashId}`, { replace: true });
      setTimeout(() => {
        const element = document.getElementById(hashId);
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50); // slight delay to allow router to update
    }
  };

  const isHashActive = (hash) => location.pathname === '/' && location.hash === `#${hash}`;
  const isBerandaActive = location.pathname === '/' && !location.hash;

  return (
    <nav className="user-navbar">
      <div className="nav-logo">
        <Link to="/" style={{ textDecoration: 'none', color: '#ffcc80', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-mug-hot" style={{ fontSize: '1.4rem', color: '#e67e22' }}></i> KopiDaeng
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/" className={isBerandaActive ? "nav-item active" : "nav-item"}>Beranda</Link>
        <NavLink to="/produk" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>Katalog</NavLink>
        <a href="#about" onClick={(e) => handleHashClick(e, 'about')} className={isHashActive('about') ? "nav-item active" : "nav-item"}>Tentang Kami</a>
        <a href="#testimoni" onClick={(e) => handleHashClick(e, 'testimoni')} className={isHashActive('testimoni') ? "nav-item active" : "nav-item"}>Ulasan</a>
      </div>

      {location.pathname !== '/' && (
        <div className="nav-search">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              name="q" 
              placeholder="Cari kopi..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit"><i className="fa fa-search"></i></button>
          </form>
        </div>
      )}

      <div className="nav-right">
        {user && (
          <NavLink to="/pesanan/saya" className={({ isActive }) => isActive ? "cart-link active" : "cart-link"} title="Keranjang Pesanan">
            <i className="fa fa-shopping-cart"></i>
          </NavLink>
        )}

        {user ? (
          <div className="user-menu">
            <span className="greeting">Hai, {user.nama}</span>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          </div>
        ) : (
          <Link className="btn-login" to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
