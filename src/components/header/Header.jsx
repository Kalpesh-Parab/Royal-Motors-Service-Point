import './header.scss';
import logo from '../../assets/logo.png';
import royalLogo from '../../assets/royalLogo.png';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <section className={`Header ${!showHeader ? 'hide' : ''}`}>
      <div className='logo' onClick={() => navigate('/')}>
        <img src={logo} alt='Logo' />
      </div>

      <div
        className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(prev => !prev)}
      >
        <span />
        <span />
        <span />
      </div>

      <div className={`navlinks ${isMobileMenuOpen ? 'show' : ''}`}>
        <NavLink
          to='/'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink
          to='/about'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          About Us
        </NavLink>
        <NavLink
          to='/services'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Our Services
        </NavLink>
        <NavLink
          to='/contact'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Contact Us
        </NavLink>
      </div>

      <div className='royalLogo'>
        <img src={royalLogo} alt='Royal Logo' />
      </div>
    </section>
  );
};

export default Header;
