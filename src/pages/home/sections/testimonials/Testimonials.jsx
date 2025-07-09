import './testimonials.scss';
import arrow from '../../../../assets/contact.png';
import prof from '../../../../assets/prof.png';
import star from '../../../../assets/star.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Testimonials = () => {
  const navigate = useNavigate();

  const testimonials = [
    {
      quote: `“It's a good place to service your Royal Enfield bike. For me, it was way better than
the company’s service center. Service quality: 4 Stars Cost of service: 5 Stars Time:
5 Stars (usually provide service on the same day) [Most importantly, unlike official
company service centers, here you don’t have to take a prior appointment.] They
will not ask you to add/replace vehicle parts unless they are truly necessary
and irreparable.”`,
      name: `Swapnil`,
      stars: 5,
    },
    {
      quote: `“Skilled mechanics, the owner of the shop Alex himself is an enthusiast and knows how a Bullet shall be treated. It is one of the best service centers in Pune — you can drop your bike without any worries and i will be taken care of. Though the charges are similar to the RE service center, the amount of satisfaction and joy you get is worth every penny you invest. Have never given my bike to any other center
once I visited this place.”`,
      name: `Gaurav`,
      stars: 5,
    },
    {
      quote: `“They are experts of Royal Enfield. A perfect place to get your bike serviced. There is a professional approach. They'll make a job card to ensure all your problems are captured properly. They’ll also make extra efforts to repair the bike, for example, one of my bike parts was not available, so they used one which was lying with them without any additional cost.”`,
      name: `Anshul`,
      stars: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handleCardClick = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className='Testimonials'>
      <div className='top'>
        <div className='heading'>
          What Our <br />
          <span> Customers </span>Say
        </div>
        <div className='contactUs' onClick={() => navigate(`/about`)}>
          Contact us
          <div className='arrow'>
            <img src={arrow} alt='' loading='lazy' />
          </div>
        </div>
      </div>
      <div className='cards'>
        {testimonials.map((card, index) => {
          const total = testimonials.length;
          const offset = (index - activeIndex + total) % total;

          const zIndex = total - offset;
          const isActive = offset === 0;

          // Stack diagonally
          const translate = offset * -1.2;
          const rotation = offset * 3;

          return (
            <div
              key={index}
              className={`card ${isActive ? 'active' : ''}`}
              style={{
                zIndex,
                transform: `translate(${translate}vw, ${
                  translate * 0
                }vw) rotate(${rotation}deg)`,
                opacity: offset > 2 ? 0 : 1, // limit to 3 cards visible
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              onClick={handleCardClick}
            >
              <div className='quote'>{card.quote}</div>
              <div className='desc'>
                <div className='image'>
                  <img src={prof} alt='' />
                </div>
                <div className='details'>
                  <div className='name'>{card.name}</div>
                  <div className='proud'>A Proud Royal Enfield Owner</div>
                </div>
                <div className='rating'>
                  {[...Array(card.stars)].map((_, i) => (
                    <img key={i} src={star} alt='star' className='star' />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className='contact'>
        Want to share your experience? We'd love to hear from you!
        <br />
        Reach out on Instagram{' '}
        <a
          href='https://www.instagram.com/royal_motors_dhanori?igsh=MnFhb2R0bzJkcGV3'
          target='_blank'
          rel='noopener noreferrer'
        >
          @royal_motors_dhanori
        </a>{' '}
        or drop us a message anytime.
      </div>
    </section>
  );
};

export default Testimonials;
