import './header.scss';
import logo from '../../assets/logo.png';
import royalLogo from '../../assets/royalLogo.png';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // scrolling down
        setShowHeader(false);
      } else {
        // scrolling up
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <section className={`Header ${!showHeader ? 'hide' : ''}`}>
      <div className='logo'>
        <img src={logo} alt='' />
      </div>

      <div className='navlinks'>
        <NavLink
          to='/'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to='/about'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
        >
          About Us
        </NavLink>
        <NavLink
          to='/services'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
        >
          Our Services
        </NavLink>
        <NavLink
          to='/contact'
          className={({ isActive }) => `link ${isActive ? 'active' : ''}`}
        >
          Contact Us
        </NavLink>
      </div>

      <div className='royalLogo'>
        <img src={royalLogo} alt='' />
      </div>
    </section>
  );
};

export default Header;
