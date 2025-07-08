import './whyChooseUs.scss';
import c1 from '../../../../assets/c1.jpg';
import c2 from '../../../../assets/c2.png';
import c3 from '../../../../assets/re1.jpg';
import logoWhite from '../../../../assets/logoWhite.png';

const WhyChooseUs = () => {
  const services = [
    {
      name: `26+ Years of Experience`,
      desc: `Servicing Royal Enfields since 1999 with deep mechanical know-how and a legacy of quality`,
      image: c1,
    },
    {
      name: `Expert Mechanics`,
      desc: `Skilled hands trained specifically in Royal Enfield repair and customization.`,
      image: c2,
    },
    {
      name: `Authorized Workshop Background`,
      desc: `Former authorized Royal Enfield service center - a badge of trust and technical expertise.`,
      image: c3,
    },
    {
      name: `Custom Modification Specialists`,
      desc: `From retro styles to rugged tourers, we bring your dream build to life`,
      image: c1,
    },
  ];

  return (
    <section className='WhyChooseUs'>
      <div className='shape1'></div>
      <div className='top'>
        <div className='heading'>
          Why <span>Choose Us?</span>
        </div>
      </div>
      <div className='services'>
        {services.map((ser) => (
          <div className='service'>
            <div className='image'>
              <img src={ser.image} alt='' />
            </div>
            <div className='bottom'>
              <div className='name'>{ser.name}</div>
              <div className='desc'>{ser.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='banner'>
        <div className='logo'>
          <img src={logoWhite} alt='' />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
