import './weProvide.scss';
import { useNavigate } from 'react-router-dom';
import arrow from '../../../../assets/contact.png';
import royalLogo from '../../../../assets/royalLogo.png';
import logoWhite from '../../../../assets/logoWhite.png';
import service1 from '../../../../assets/service1.png';
import service2 from '../../../../assets/service2.png';
import service3 from '../../../../assets/service3.png';
import service4 from '../../../../assets/service4.png';

const WeProvide = () => {
  const navigate = useNavigate();
  const services = [
    {
      name: `Basic Maintenance & Repairs`,
      image: service1,
    },
    {
      name: `Performance Upgrades`,
      image: service2,
    },
    {
      name: `Restoration & Custom Builds`,
      image: service3,
    },
    {
      name: `Cosmetic Care & Protection`,
      image: service4,
    },
  ];

  return (
    <section className='WeProvide'>
      <div className='shape1'></div>
      <div className='top'>
        <div className='heading'>
          Services <span>We Provide</span>
        </div>
        <div className='contactUs' onClick={() => navigate(`/services`)}>
          View more
          <div className='arrow'>
            <img src={arrow} alt='' loading='lazy' />
          </div>
        </div>
      </div>
      <div className='services'>
        {services.map((ser) => (
          <div className='service'>
            <div className='image'>
              <img src={ser.image} alt='' />
            </div>
            <div className='name' onClick={() => navigate(`/services`)}>
              {ser.name}
              <div className='arrow'>
                <img src={arrow} alt='' loading='lazy' />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='subHeading'>
        We provide multiple services <br />
        for your <span>Royal Enfield</span>
      </div>
      <div className='banner'>
        <div className='royalLogo'>
          <img src={royalLogo} alt='' />
        </div>
        <div className='logo'>
          <img src={logoWhite} alt='' />
        </div>
      </div>
    </section>
  );
};

export default WeProvide;
