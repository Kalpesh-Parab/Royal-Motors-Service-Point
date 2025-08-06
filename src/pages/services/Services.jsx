import './services.scss';
import s1 from '../../assets/s1.png';
import s2 from '../../assets/s2.png';
import s3 from '../../assets/s3.png';
import s4 from '../../assets/s4.png';
import mech3 from '../../assets/mech3.png';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();
  const data = [
    {
      icon: s1,
      title: `Basic Maintenance & Repairs`,
      points: [
        `Regular Servicing`,
        `Engine Repair & Overhaul`,
        `Brake System Overhaul`,
        `Clutch Plate Replacement & Adjustment`,
        `Electrical & Wiring Repairs`,
        `Pickup & Drop Service`,
        `Emergency Breakdown Assistance`,
      ],
    },
    {
      icon: s2,
      title: `Performance Upgrades`,
      points: [
        `Performance Tuning & Upgrades (ECU, Carburetor, Sprockets)`,
        `Custom Modifications (Styling, Body Kits, Ergonomics)`,
        `Suspension & Fork Servicing`,
        `Chain Sprocket Kit Replacement`,
        `Silencer & Exhaust Customization`,
      ],
    },
    {
      icon: s3,
      title: `Restoration & Custom Builds`,
      points: [
        `Complete Bike Restoration (Vintage & Modern)`,
        `Painting & Restoration (Color Change, Touch-Ups)`,
        `Spare Parts & Accessories (Genuine & Custom)`,
        `Custom Seats, Handlebar, Mirrors & Lighting`,
        `Full Rebuild Projects (Engine + Frame Work)`,
      ],
    },
    {
      icon: s4,
      title: `Cosmetic Care & Protection`,
      points: [
        `Bike Detailing & Polishing`,
        `Ceramic Coating & Paint Protection`,
        `Rust Treatment & Underbody Coating`,
        `Waterless Wash & Seat Conditioning`,
        `Tyre Replacement & Wheel Balancing`,
      ],
    },
  ];

  return (
    <section className='Services'>
      <div className='tHead'>
        Services<span> We Provide</span>
      </div>
      <div className='cards'>
        {data.map((card, i) => (
          <div className='card' key={i}>
            <div className='icon'>
              <img src={card.icon} alt='' />
            </div>
            <div className='title'>{card.title}</div>
            <div className='points'>
              <ul>
                {card.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div className='mechanic'>
        <img src={mech3} alt='' />
        <div className='slogan'>
          We ensure your bike will be in good condition and protected!!
        </div>
      </div>
      <div className='shape2'></div>
    </section>
  );
};

export default Services;
