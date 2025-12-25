import './shutter.scss';
import shutterImg from '../../../assets/shutter.png';

export default function Shutter({ progress }) {
  return (
    <div
      className='shutter'
      style={{
        transform: `translateY(-${progress * 100}%)`,
      }}
    >
      <img src={shutterImg} alt='Garage Shutter' />
    </div>
  );
}
