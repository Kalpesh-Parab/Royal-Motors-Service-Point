import './shutter.scss';
import shutterImg from '../../../assets/shutter.png';

export default function Shutter({ progress, isOpen }) {
  return (
    <div
      className={`shutter ${isOpen ? 'open' : ''}`}
      style={
        isOpen
          ? { transform: 'translateY(-100%)' }
          : { transform: `translateY(-${progress * 100}%)` }
      }
    >
      <img src={shutterImg} alt='Garage Shutter' />
    </div>
  );
}
