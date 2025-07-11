import './contact.scss';
import map from '../../assets/map.png';
import instw from '../../assets/instw.png';
import whatsapp from '../../assets/whatsapp.png';
import work from '../../assets/work.png';

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
      value: `Monday to Wednesday, Friday to Sunday
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
              <div className='value'>{inf.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;
