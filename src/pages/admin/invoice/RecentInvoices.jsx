import { useNavigate } from 'react-router-dom';
import './recentInvoices.scss';

export default function RecentInvoices({ invoices }) {
  const navigate = useNavigate();

  if (!invoices.length) return null;

  return (
    <section className='recent-invoices'>
      <h3>Recent Invoices</h3>

      <ul className='invoice-list'>
        {invoices.map((inv) => (
          <li key={inv._id} className='invoice-card'>
            <div className='details'>
              <strong>{inv.bikeNumber}</strong>
              <p>₹ {inv.grandTotal}</p>
            </div>

            <button
              onClick={() => navigate(`/admin/invoices/${inv._id}/print`)}
            >
              View / Print
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
