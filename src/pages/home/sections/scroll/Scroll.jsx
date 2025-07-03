import './scroll.scss';

const Scroll = () => {
  const phrase = 'Royal Motors Service Point';
  const separator = '|';

  const repeatedElements = Array(20).fill(null).map((_, index) => (
    <span key={index} className='scroll-pair'>
      <span className='text'>{phrase}</span>
      <span className='separator'>{separator}</span>
    </span>
  ));

  return (
    <section className='Scroll'>
      <div className='scroll-wrapper'>
        <div className='scroll-text'>{repeatedElements}</div>
      </div>
    </section>
  );
};

export default Scroll;
