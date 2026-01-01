import { useEffect, useState } from 'react';
import './dashboard.scss';
import Sidebar from './Sidebar';
import InvoiceCreate from './invoice/InvoiceCreate';
import ServicesPanel from './AdminServices/ServicesPanel';
import InvoicesPage from './InvoicesPage/InvoicesPage';
import AnalyticsPage from './analyticsPage/AnalyticsPage';

export default function Dashboard({ onLogout }) {
  const [visible, setVisible] = useState(false);
  const [activePage, setActivePage] = useState('analytics');

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`dashboard ${visible ? 'show' : ''}`}>
      <Sidebar onLogout={onLogout} setActivePage={setActivePage} />

      <div className='dashboard-content'>
        {activePage === 'analytics' && (
          <>
            <h1>Dashboard</h1>
            <AnalyticsPage />
          </>
        )}
        {activePage === 'invoices' && (
          <>
            <h1>Invoices</h1>
            <InvoicesPage />
          </>
        )}

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
