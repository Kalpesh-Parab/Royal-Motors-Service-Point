import './header.scss';
import logo from '../../assets/logo.png';
import royalLogo from '../../assets/royalLogo.png';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <section className='Header'>
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
