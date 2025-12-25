import { useEffect, useRef, useState } from 'react';
import './admin.scss';
import useAdminAuth from './hooks/useAdminAuth';
import AdminLogin from './components/AdminLogin';
import Shutter from './components/Shutter';
import OpenShutterHint from './components/OpenShutterHint';
import Dashboard from './Dashboard';

export default function Admin() {
  const { isLoggedIn, login, logout } = useAdminAuth();

  const scrollRef = useRef(null);
  const [shutterProgress, setShutterProgress] = useState(0);
  const [canOpen, setCanOpen] = useState(false);

  // Restore shutter state on refresh
  useEffect(() => {
    const open = localStorage.getItem('shutter_open') === 'true';

    if (isLoggedIn && open) {
      setShutterProgress(1);
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isLoggedIn]);

  // REAL scroll → shutter movement (touchpad friendly)
  useEffect(() => {
    if (!canOpen || !scrollRef.current) return;

    const el = scrollRef.current;

    const onScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      const progress = Math.min(el.scrollTop / maxScroll, 1);

      setShutterProgress(progress);

      if (progress >= 1) {
        localStorage.setItem('shutter_open', 'true');
        document.body.style.overflow = 'auto';
        setCanOpen(false);
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [canOpen]);

  const handleLoginSuccess = (token) => {
    login(token);
    setShutterProgress(0);
    setCanOpen(true);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shutter_open');
    logout();
  };

  return (
    <div className='admin-wrapper'>
      <Shutter progress={shutterProgress} />

      {!isLoggedIn && <AdminLogin onSuccess={handleLoginSuccess} />}

      {isLoggedIn && shutterProgress < 1 && <OpenShutterHint />}

      {isLoggedIn && shutterProgress === 1 && <Dashboard/>}

      {/* Invisible scroll engine */}
      {isLoggedIn && canOpen && (
        <div ref={scrollRef} className='scroll-driver' />
      )}
    </div>
  );
}
