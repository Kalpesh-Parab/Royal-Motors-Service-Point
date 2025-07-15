import './contact.scss';
import map from '../../assets/map.png';
import instw from '../../assets/instw.png';
import whatsapp from '../../assets/whatsapp.png';
import work from '../../assets/work.png';
import mech2 from '../../assets/mech2.png';

const Contact = () => {
  const info = [
    {
      icon: map,
      link: `https://maps.app.goo.gl/X2FfvQmuA2eVXS3A8`,
      key: `Address:`,
      value: `Royal Motors Service Point Porwal Road, Dhanori Next to
      Revel Orchid, Opposite Park Spring Society Pune, Maharashtra`,
    },
    {
      icon: whatsapp,
      link: `https://wa.me/8275596717`,
      key: `Phone / WhatsApp:`,
      value: `+91 97678 52720 / +91 9422024560`,
    },
    {
      icon: instw,
      link: `https://www.instagram.com/royal_motors_dhanori/?igsh=MnFhb2R0bzJkcGV3#`,
      key: `Instagram:`,
      value: `@royal_motors_dhanori`,
    },
    {
      icon: work,
      key: `Working Hours:`,
      value: `Monday to Wednesday, Friday to Sunday<br/>
9:30 AM – 6:00 PM Closed on Thursdays`,
    },
  ];
  return (
    <section className='Contact'>
      <div className='heading'>
        <span>Contact</span> us now!
      </div>
      <div className='infoWrapper'>
        {info.map((inf) => (
          <div className='info'>
            <div className='left'>
              <img src={inf.icon} alt='' />
            </div>
            <div className='right'>
              <div className='key'>{inf.key}</div>
              <div
                className='value'
                dangerouslySetInnerHTML={{ __html: inf.value }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className='mechanic'>
        <img src={mech2} alt='' />
      </div>
      <div className='shape2'></div>
      <div className='map'>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.156205428822!2d73.9116377!3d18.6120426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c131d667a495%3A0xcba6205e9235481!2sRoyal%20Motors!5e0!3m2!1sen!2sin!4v1752597753325!5m2!1sen!2sin'
          width='100%'
          height='100%'
          style={{ border: 0 }}
          allowFullScreen=''
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          title='Royal Motors Location'
        ></iframe>
      </div>
      <div className='form'></div>
    </section>
  );
};

export default Contact;
