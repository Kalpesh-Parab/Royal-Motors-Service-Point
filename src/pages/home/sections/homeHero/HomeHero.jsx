import './homeHero.scss';
import arrow from '../../../../assets/contact.png';
import { useNavigate } from 'react-router-dom';

const HomeHero = () => {
  const navigate = useNavigate();
  return (
    <section className='HomeHero'>
      <div className='heading'>
        Ride Strong. <br />
        Ride Royal.
      </div>
      <div className='subHeading'>We Keep Your Enfield Legendary.</div>
      <div className='desc'>For your Royal Enfield servicing</div>
      <div className='bottom'>
        <div className='contactUs' onClick={() => navigate(`/contact`)}>
          Contact us
          <div className='arrow'>
            <img src={arrow} alt='' />
          </div>
              </div>
              <div className="info">
                  royalmotorservicepoint*since1999
              </div>
      </div>
    </section>
  );
};

export default HomeHero;
