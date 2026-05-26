import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        Swal.fire({
          title: 'Akses Ditolak! 🚫',
          text: 'Anda harus login terlebih dahulu.',
          icon: 'error',
          confirmButtonColor: '#d35400'
        }).then(() => setRedirectPath('/login'));
      } else if (role && user.role !== role) {
        Swal.fire({
          title: 'Akses Ilegal! ⚠️',
          text: 'Anda tidak memiliki hak akses sebagai Admin.',
          icon: 'warning',
          confirmButtonColor: '#d35400'
        }).then(() => setRedirectPath('/produk'));
      }
    }
  }, [user, loading, role]);

  if (loading) {
    return <div>Loading...</div>; // Atau spinner
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // Jika kondisi gagal, jangan render children (tahan halaman sampai Swal ditutup)
  if (!user || (role && user.role !== role)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
