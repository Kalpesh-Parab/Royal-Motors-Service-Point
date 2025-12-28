import { useEffect, useState } from 'react';
import './dashboard.scss';
import Sidebar from './Sidebar';
import ServicesPanel from './ServicesPanel';
import InvoiceCreate from './invoice/InvoiceCreate';

export default function Dashboard({ onLogout }) {
  const [visible, setVisible] = useState(false);
  const [activePage, setActivePage] = useState('invoice');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`dashboard ${visible ? 'show' : ''}`}>
      <Sidebar onLogout={onLogout} setActivePage={setActivePage} />

      <div className='dashboard-content'>
        {activePage === 'services' && (
          <>
            <h1>Services</h1>
            <ServicesPanel />
          </>
        )}

        {activePage === 'invoice' && (
          <>
            <h1>Create Invoice</h1>
            <InvoiceCreate />
          </>
        )}
      </div>
    </div>
  );
}
