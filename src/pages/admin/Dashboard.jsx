import { useEffect, useState } from 'react';
import './dashboard.scss';
import Sidebar from './Sidebar';
import InvoiceCreate from './invoice/InvoiceCreate';
import ServicesPanel from './AdminServices/ServicesPanel';
import InvoicesPage from './InvoicesPage/InvoicesPage';
import AnalyticsPage from './analyticsPage/AnalyticsPage';
import RecentlyDuePage from './recentlyDuePage/RecentlyDuePage';
import WhatsAppMessagesPage from './WhatsAppMessagesPage/WhatsAppMessagesPage';

export default function Dashboard({ onLogout }) {
  const [visible, setVisible] = useState(false);
  const [activePage, setActivePage] = useState('analytics');
  const [editInvoiceId, setEditInvoiceId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`dashboard ${visible ? 'show' : ''}`}>
      <Sidebar
        onLogout={onLogout}
        activePage={activePage}
        setActivePage={(page) => {
          setEditInvoiceId(null); // always reset
          setActivePage(page);
        }}
      />

      <div className='dashboard-content'>
        {/* ANALYTICS (DEFAULT) */}
        {activePage === 'analytics' && (
          <>
            <h1>Dashboard</h1>
            <AnalyticsPage />
          </>
        )}

        {/* INVOICE LIST */}
        {activePage === 'invoices' && (
          <>
            <h1>Invoices</h1>
            <InvoicesPage
              onEdit={(id) => {
                setEditInvoiceId(id);
                setActivePage('create-invoice');
              }}
            />
          </>
        )}

        {/* CREATE / EDIT INVOICE */}
        {activePage === 'create-invoice' && (
          <>
            <h1>{editInvoiceId ? 'Edit Invoice' : 'Create Invoice'}</h1>
            <InvoiceCreate editId={editInvoiceId} />
          </>
        )}

        {/* SERVICES */}
        {activePage === 'services' && (
          <>
            <h1>Services</h1>
            <ServicesPanel />
          </>
        )}

        {/* RECENTLY DUE */}
        {activePage === 'recently-due' && (
          <>
            <h1>Recently Due</h1>
            <RecentlyDuePage />
          </>
        )}

        {/* WHATSAPP MESSAGES */}
        {activePage === 'whatsapp-messages' && (
          <>
            <h1>WhatsApp Messages</h1>
            <WhatsAppMessagesPage />
          </>
        )}
      </div>
    </div>
  );
}
