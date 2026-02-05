import { useEffect, useState } from 'react';
import API from '../adminApi';
import './invoicesPage.scss';
import whatsapp from '../../../assets/whatsapp.png';

const PAGE_SIZE = 10;

/* ---------- FORMAT BIKE NUMBER ---------- */
const formatBikeNumber = (value = '') =>
  value
    ? value.toUpperCase().replace(/^(.{2})(.{2})(.{2})(.*)$/, '$1 $2 $3 $4')
    : '-';

/* ---------- SANITIZE SEARCH ---------- */
const sanitizeSearchQuery = (value = '') =>
  value.replace(/\s+/g, '').toUpperCase();

/* ---------- BUILD SERVICE LINES ---------- */
const buildServiceLines = (invoice) => {
  const lines = [];

  invoice.categories.forEach((cat) => {
    if (cat.pricingMode === 'SERVICE') {
      cat.services.forEach((s) => {
        lines.push(`• ${s.serviceName} — ₹ ${s.price}`);
      });
    } else {
      lines.push(`• ${cat.categoryName} — ₹ ${cat.categoryTotal}`);
    }
  });

  return lines.join('\n');
};

/* ---------- BUILD WHATSAPP MESSAGE ---------- */
const buildWhatsAppMessage = (invoice) => {
  const services = buildServiceLines(invoice);

  return `
🧾 ROYAL MOTORS – SERVICE INVOICE 🏍️
Trusted Two-Wheeler Service & Care

📍 Royal Motors Service Point
Porwal Road, Dhanori, Pune
📞 +91 97678 52720
━━━━━━━━━━━━━━━━━━

👤 Customer Details
Name: ${invoice.owner?.name || '-'}
Mobile: ${invoice.owner?.mobile || '-'}

🚲 Bike Details
Bike No: ${formatBikeNumber(invoice.bikeNumber)}
Model: ${invoice.bike?.model || '-'}
Service Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}
━━━━━━━━━━━━━━━━━━

🔧 Service Details
${services}

━━━━━━━━━━━━━━━━━━
💰 GRAND TOTAL: ₹ ${invoice.grandTotal}
━━━━━━━━━━━━━━━━━━

💳 Payment Mode:
Kindly make the payment via UPI / Scanner
📲 UPI ID / Mobile No: 9767852720
📄 This is a digitally generated invoice and does not require a physical signature.
Thank you for choosing Royal Motors 🙏
Ride Safe. Ride Smooth.
`.trim();
};

export default function InvoicesPage({ onEdit }) {
  const [allInvoices, setAllInvoices] = useState([]);
  const [visibleInvoices, setVisibleInvoices] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  /* ---------- FETCH ---------- */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/invoices');
      setAllInvoices(res.data);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------- LIVE SEARCH ---------- */
  useEffect(() => {
    const timer = setTimeout(async () => {
      const cleaned = sanitizeSearchQuery(query);
      if (!cleaned) return fetchAll();

      setLoading(true);
      const res = await API.get(`/api/invoices/search?q=${cleaned}`);
      setAllInvoices(res.data);
      setPage(1);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  /* ---------- PAGINATION ---------- */
  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE;
    setVisibleInvoices(allInvoices.slice(start, start + PAGE_SIZE));
  }, [allInvoices, page]);

  const totalPages = Math.ceil(allInvoices.length / PAGE_SIZE);

  /* ---------- WHATSAPP ---------- */
  const sendWhatsAppInvoice = (e, invoice) => {
    e.stopPropagation();
    const phone = invoice.owner?.mobile;
    if (!phone) return alert('Mobile number not found');

    const message = buildWhatsAppMessage(invoice);
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleDeleteInvoice = async (e, invoiceId) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this invoice?',
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/api/invoices/${invoiceId}`);
      setAllInvoices((prev) => prev.filter((inv) => inv._id !== invoiceId));
    } catch (err) {
      alert('Failed to delete invoice');
      console.error(err);
    }
  };

  return (
    <div className='invoices-page'>
      <div className='invoices-header'>
        <h2>Invoices</h2>

        <input
          className='search-bar'
          placeholder='Search by Bike No or Mobile'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <table className='invoice-table'>
        <thead>
          <tr>
            <th>Bike</th>
            <th>Customer</th>
            <th>Mobile</th>
            <th>Date</th>
            <th>Total</th>
            <th>WhatsApp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleInvoices.map((inv) => (
            <tr
              key={inv._id}
              onClick={() => window.open(`/admin/invoices/${inv._id}/print`)}
            >
              <td>{formatBikeNumber(inv.bikeNumber)}</td>
              <td>{inv.owner?.name}</td>
              <td>{inv.owner?.mobile}</td>
              <td>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
              <td>₹ {inv.grandTotal}</td>
              <td>
                <button onClick={(e) => sendWhatsAppInvoice(e, inv)}>
                  <img src={whatsapp} alt='' className='wpsmall' />
                  Send
                </button>
              </td>

              <td className='actions'>
                <button
                  className='edit-btn'
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(inv._id);
                  }}
                >
                  ✏️
                </button>

                <button
                  className='delete-btn'
                  onClick={(e) => handleDeleteInvoice(e, inv._id)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className='pagination'>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
