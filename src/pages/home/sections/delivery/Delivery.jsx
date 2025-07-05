import './delivery.scss';
import arrow from '../../../../assets/contact.png';
import royalLogo from '../../../../assets/royalLogo.png';
import logoWhite from '../../../../assets/logoWhite.png';

const Delivery = () => {
  return (
    <section className='Delivery'>
      <div className='top'>
        <div className='tHead'>
          <span>Same-Day</span>
          <br /> Delivery Available
        </div>
        <div className='contactUs' onClick={() => navigate(`/about`)}>
          Contact us
          <div className='arrow'>
            <img src={arrow} alt='' loading='lazy' />
          </div>
        </div>
      </div>
      <div className='desc'>
        At Royal Motors Service Point, we know how important your bike is to
        your daily life and your passion for riding. That’s why we offer
        same-day delivery on a wide range of services — from routine maintenance
        to repairs and upgrades.
      </div>
      <div className='banner'>
        <div className='image'>
          <img src={royalLogo} alt='' />
        </div>
        <div className='logo'>
          <img src={logoWhite} alt='' />
        </div>
      </div>
      <div className='text'>
        Our efficient workflow and skilled mechanics ensure that many jobs are
        completed within hours, without compromising on quality.
          </div>
          
    </section>
  );
};

export default Delivery;
