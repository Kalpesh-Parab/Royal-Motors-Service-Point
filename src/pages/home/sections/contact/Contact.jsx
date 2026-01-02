import './contact.scss';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import arrow from '../../../../assets/contact.png';
import mech from '../../../../assets/mech.png';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const form = useRef();
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_lm6wua7',
        'template_bxpz39f',
        form.current,
        'cHTX2zDYOc4kN6Vsc'
      )
      .then(() => {
        toast.success('Enquiry submitted successfully');
        form.current.reset();
      })
      .catch((error) => {
        console.error(error);
        toast.error('Oops! Something went wrong.');
      });
  };

  return (
    <section className='ContactHome'>
      <div className='shape1'></div>
      <div className='top'>
        <div className='tHead'>
          <span>Contact</span> Us
        </div>
        <div className='contactUs' onClick={() => navigate(`/contact`)}>
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
        <form className='form' ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input type='text' name='name' placeholder='Your Name' required />

          <label>Choose Your Model</label>
          <select name='model' required>
            <option value=''>-- Select --</option>
            <option>Hunter 360</option>
            <option>Classic 650</option>
            <option>Goan Classic 350</option>
            <option>Scram 440</option>
            <option>Bear 650</option>
            <option>Classic 350</option>
            <option>Guerrilla 450</option>
            <option>Shotgun 650</option>
            <option>Himalayan 450</option>
            <option>Bullet 350</option>
            <option>Super Meteor 650</option>
            <option>Meteor 350</option>
            <option>Interceptor 650</option>
            <option>Continental GT 650</option>
          </select>

          <label>Phone No.</label>
          <input type='tel' name='phone' placeholder='Mobile Number' required />

          <label>Query</label>
          <input type='text' name='query' placeholder='Your Query' required />

          <button type='submit' className='contactUs'>
            Submit
            <div className='arrow'>
              <img src={arrow} alt='' loading='lazy' />
            </div>
          </button>
        </form>

        <div className='mech'>
          <img src={mech} alt='' />
        </div>
      </div>
    </section>
  );
};

export default Contact;
