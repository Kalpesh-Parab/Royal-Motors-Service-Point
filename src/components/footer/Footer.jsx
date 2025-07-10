import './footer.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import contactBike from '../../assets/contactBike.png';
import aboutBike from '../../assets/aboutBike.png';
import cbike from '../../assets/cbike.png';
import serviceBike from '../../assets/serviceBike.png';
import insta from '../../assets/insta.png';
import logoBlack from '../../assets/logoBlack.png';
import arrow from '../../assets/contact.png';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine bike image based on current route
  let bikeImage = contactBike;

  switch (location.pathname) {
    case '/about':
      bikeImage = aboutBike;
      break;
    case '/services':
      bikeImage = serviceBike;
      break;
    case '/contact':
      bikeImage = cbike;
      break;
    default:
      bikeImage = contactBike;
  }

  return (
    <section className='Footer'>
      <div className='image'>
        <img src={bikeImage} alt='' />
      </div>
      <div className='navlinks'>
        <div className='link' onClick={() => navigate(`/`)}>
          Home
          <img src={arrow} alt='' />
        </div>
        <div className='link' onClick={() => navigate(`/about`)}>
          About us
          <img src={arrow} alt='' />
        </div>
        <div className='link' onClick={() => navigate(`/services`)}>
          Our Services
          <img src={arrow} alt='' />
        </div>
        <div className='link' onClick={() => navigate(`/contact`)}>
          Contact Us
          <img src={arrow} alt='' />
        </div>
      </div>
      <div className='bottom'>
        <div className='tab'>
          <img src={insta} alt='' />
          <a
            href='https://www.instagram.com/royal_motors_dhanori?igsh=MnFhb2R0bzJkcGV3'
            target='_blank'
            rel='noopener noreferrer'
          >
            Instagram: <br />
            @royal_motors_dhanori
          </a>
        </div>
        <div className='tab'>
          <div className='logo'>
            <img src={logoBlack} alt='' />
          </div>
        </div>
        <div className='tab'>royalmotorservicepoint*since1999</div>
      </div>
    </section>
  );
};

export default Footer;
