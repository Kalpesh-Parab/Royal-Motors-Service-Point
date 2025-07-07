import './shine.scss';
import red from '../../../../assets/red.png';
import redshine from '../../../../assets/redshine.png';

const Shine = () => {
  const services = [
    `Regular Servicing`,
    `Brake & Clutch Work`,
    `Tyre & Chain Kit Replacement`,
    `Electrical Fixes`,
    `Minor Custom Modifications`,
  ];

  return (
      <section className='Shine'>
          <div className="Shape1"></div>
      <div className='text'>Available for</div>
      <div className='available'>
        {services.map((ser, index) => (
          <div key={index} className='service'>
            {ser}
          </div>
        ))}
      </div>
      <div className='keep'>
        <div className='left'>
                  <img src={red} alt='' />
                  <div className="shiny">
                      <img src={redshine} alt="" />
                  </div>
        </div>
        <div className='right'>
          <div className='title'>
            We keep your legacy to <span>shine till centuries.</span>
          </div>
          <div className='short'>royalmotorservicepoint*since1999</div>
        </div>
      </div>
    </section>
  );
};

export default Shine;
