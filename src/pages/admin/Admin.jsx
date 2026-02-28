import './admin.scss';
import useAdminAuth from './hooks/useAdminAuth';
import AdminLogin from './components/AdminLogin';
import Dashboard from './Dashboard';

export default function Admin() {
  const { isLoggedIn, login, logout } = useAdminAuth();

  const handleLoginSuccess = (token) => {
    login(token);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-wrapper">

      {!isLoggedIn && (
        <AdminLogin onSuccess={handleLoginSuccess} />
      )}

      {isLoggedIn && (
        <Dashboard onLogout={handleLogout} />
      )}

    </div>
  );
}