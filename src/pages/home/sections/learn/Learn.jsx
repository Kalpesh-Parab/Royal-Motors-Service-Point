import './learn.scss';
import arrow from '../../../../assets/contact.png';
import re1 from "../../../../assets/re1.jpg"
import royalLogo from "../../../../assets/royalLogo.png"

import { useNavigate } from 'react-router-dom';

const Learn = () => {
  const navigate = useNavigate();

  return (
      <section className='Learn'>
          <div className="shape1"></div>
      <div className='top'>
        <div className='tHead'>
          Learn more <br /> about the <span>company</span>
        </div>
        <div className='contactUs' onClick={() => navigate(`/about`)}>
          View more
          <div className='arrow'>
            <img src={arrow} alt='' loading='lazy' />
          </div>
        </div>
      </div>
      <div className='bottom'>
        <div className='image'>
          <img src={re1} alt='' />
          <img src={royalLogo} alt="" className='RE'/>
        </div>
        <div className='info'>
          <div className='title'>
            Royal Motors Service Point, established in March 1999, is more than
            just a motorcycle garage
          </div>
          <p>
            It's a destination for Royal Enfield lovers who demand excellence,
            authenticity, and personal care for their machines. With over{' '}
            <span>26 years of hands-on experience</span>, we have become a
            trusted name in the biking community, known for our deep expertise,
            consistent quality, and a true passion for everything Royal Enfield.
          </p>
          <p>
            Our story began with one man’s unwavering love for the iconic thump
            of a Royal Enfield. What started as a small garage driven by
            dedication and hard work has grown into a fully equipped service
            center that has earned the trust of thousands of riders. For a time,
            we proudly served as an authorized Royal Enfield workshop, a
            recognition that solidified our reputation for professional-grade
            service and deep technical knowledge.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Learn;
