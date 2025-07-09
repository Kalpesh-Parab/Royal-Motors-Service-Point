import './contact.scss';
import arrow from '../../../../assets/contact.png';
import mech from '../../../../assets/mech.png';

const Contact = () => {
  return (
    <section className='Contact'>
      <div className='top'>
        <div className='tHead'>
          <span>Contact</span> Us
        </div>
        <div className='contactUs' onClick={() => navigate(`/about`)}>
          Contact us
          <div className='arrow'>
            <img src={arrow} alt='' loading='lazy' />
          </div>
        </div>
      </div>
      <div className='desc'>
        Have questions or need to book a service? We're here to help!
      </div>
      <div className='bottom'>
        <div className='form'>
          <label htmlFor=''>Name</label>
          <input type='text' name='' id='' />
          <label htmlFor=''>Choose Model</label>
          <select name='' id=''>
            <option value=''>Hunter 360</option>
            <option value=''>Classic 650</option>
            <option value=''>Goan Classic 350</option>
            <option value=''>Scram 440</option>
            <option value=''>Bear 650</option>
            <option value=''>Classic 350</option>
            <option value=''>Guerrilla 450</option>
            <option value=''>Shotgun 650</option>
            <option value=''>Himalayan 450</option>
            <option value=''>Bullet 350</option>
            <option value=''>Super Meteor 650</option>
            <option value=''>Meteor 350</option>
            <option value=''>Interceptor 650</option>
            <option value=''>Continental GT 650</option>
          </select>
          <label htmlFor=''>Your E-Mail </label>
          <input type='email' name='' id='' />
          <label htmlFor=''>Your Phone No. </label>
          <input type='tel' name='' id='' />
              </div>
              <div className="mech">
                  <img src={mech} alt="" />
              </div>
      </div>
    </section>
  );
};

export default Contact;
