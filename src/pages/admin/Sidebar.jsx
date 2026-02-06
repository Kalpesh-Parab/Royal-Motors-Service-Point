import './sidebar.scss';
import logo from '../../assets/logoWhite.png';

export default function Sidebar({ onLogout, setActivePage }) {
  return (
    <aside className='sidebar'>
      <div className='top'>
        <div className='logo'>
          <img src={logo} alt='Royal Motors' />
        </div>

        <nav>
          <button onClick={() => setActivePage('analytics')}>Analytics</button>

          <button onClick={() => setActivePage('invoices')}>Invoices</button>

          <button onClick={() => setActivePage('create-invoice')}>
            Create Invoice
          </button>

          <button onClick={() => setActivePage('services')}>Services</button>
          <button onClick={() => setActivePage('recently-due')}>
            Recently Due
          </button>
          <button onClick={() => setActivePage('whatsapp-messages')}>
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
