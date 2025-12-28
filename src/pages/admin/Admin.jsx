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
  const [isShutterOpen, setIsShutterOpen] = useState(false);

  // Restore shutter state
  useEffect(() => {
    const open = localStorage.getItem('shutter_open') === 'true';

    if (isLoggedIn && open) {
      setShutterProgress(1);
      setIsShutterOpen(true);
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isLoggedIn]);

  // Scroll → shutter movement
  useEffect(() => {
    if (!canOpen || !scrollRef.current || isShutterOpen) return;

    const el = scrollRef.current;

    const onScroll = () => {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const raw = el.scrollTop / maxScroll;
      const progress = Math.min(Math.max(raw, 0), 1);

      setShutterProgress(progress);

      // 🔒 HARD LOCK
      if (progress >= 0.98) {
        setShutterProgress(1);
        setIsShutterOpen(true);
        setCanOpen(false);
        localStorage.setItem('shutter_open', 'true');
        document.body.style.overflow = 'auto';
      }
    };

    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [canOpen, isShutterOpen]);

  const handleLoginSuccess = (token) => {
    login(token);
    setShutterProgress(0);
    setIsShutterOpen(false);
    setCanOpen(true);

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shutter_open');
    setIsShutterOpen(false);
    setShutterProgress(0);
    setCanOpen(false);
    logout();
  };

  return (
    <div className="admin-wrapper">
      <Shutter progress={shutterProgress} isOpen={isShutterOpen} />

      {!isLoggedIn && <AdminLogin onSuccess={handleLoginSuccess} />}

      {isLoggedIn && !isShutterOpen && <OpenShutterHint />}

      {isLoggedIn && isShutterOpen && (
        <Dashboard onLogout={handleLogout} />
      )}

      {/* Scroll driver only while opening */}
      {isLoggedIn && !isShutterOpen && canOpen && (
        <div ref={scrollRef} className="scroll-driver" />
      )}
    </div>
  );
}
