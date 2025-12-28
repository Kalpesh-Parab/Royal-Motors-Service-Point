import './sidebar.scss';
import logo from '../../assets/logoWhite.png';

export default function Sidebar({ onLogout, setActivePage }) {
  return (
    <aside className='sidebar'>
      <div className='logo'>
        <img src={logo} alt='Royal Motors' />
      </div>

      <nav>
        <button onClick={() => setActivePage('services')}>Services</button>

        <button onClick={() => setActivePage('invoice')}>Create Invoice</button>

        <button disabled>Leads</button>
        <button disabled>Invoices</button>
      </nav>

      <button className='logout-btn' onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
