import './sidebar.scss';
import logo from '../../assets/logoWhite.png';

export default function Sidebar({ onLogout, setActivePage, activePage }) {
  return (
    <aside className='sidebar'>
      <div className='top'>
        <div className='logo'>
          <img src={logo} alt='Royal Motors' />
        </div>

        <nav>
          <button
            className={activePage === 'analytics' ? 'active' : ''}
            onClick={() => setActivePage('analytics')}
          >
            Analytics
          </button>

          <button
            className={activePage === 'invoices' ? 'active' : ''}
            onClick={() => setActivePage('invoices')}
          >
            Invoices
          </button>

          <button
            className={activePage === 'create-invoice' ? 'active' : ''}
            onClick={() => setActivePage('create-invoice')}
          >
            Create Invoice
          </button>

          <button
            className={activePage === 'services' ? 'active' : ''}
            onClick={() => setActivePage('services')}
          >
            Services
          </button>

          <button
            className={activePage === 'recently-due' ? 'active' : ''}
            onClick={() => setActivePage('recently-due')}
          >
            Recently Due
          </button>

          <button
            className={activePage === 'whatsapp-messages' ? 'active' : ''}
            onClick={() => setActivePage('whatsapp-messages')}
          >
            WhatsApp Messages
          </button>
        </nav>
      </div>

      <button className='logout-btn' onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
