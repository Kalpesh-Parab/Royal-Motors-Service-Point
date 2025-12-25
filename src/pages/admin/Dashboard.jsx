import { useEffect, useState } from 'react';
import './dashboard.scss';
import Sidebar from './Sidebar';
import ServicesPanel from './ServicesPanel'; // we'll build next

export default function Dashboard() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay for cinematic effect
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`dashboard ${visible ? 'show' : ''}`}>
      <Sidebar />
      <div className='dashboard-content'>
        <h1>Services</h1>
        <ServicesPanel />
      </div>
    </div>
  );
}
