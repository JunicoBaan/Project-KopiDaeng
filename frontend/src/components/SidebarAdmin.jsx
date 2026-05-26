import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const SidebarAdmin = ({ active }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <h3>KopiDaeng</h3>
      </div>

      <nav className="sidebar-nav">
        <Link to="/admin/dashboard" className={active === 'dashboard' ? 'active' : ''}>Dashboard</Link>
        <Link to="/admin/produk" className={active === 'produk' ? 'active' : ''}>Manajemen Produk</Link>
        <Link to="/admin/users" className={active === 'users' ? 'active' : ''}>Manajemen Users</Link>
        <Link to="/admin/pesanan" className={active === 'pesanan' ? 'active' : ''}>Manajemen Pesanan</Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-link" style={{ width: '100%', border: 'none', cursor: 'pointer' }}>Logout</button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
