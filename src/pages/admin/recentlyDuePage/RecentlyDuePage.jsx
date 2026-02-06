import { useEffect, useMemo, useState } from 'react';
import API from '../adminApi';
import './recentlyDuePage.scss';

/* ---------- DATE HELPERS ---------- */
const subtractMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
};

/* ---------- WORK SUMMARY ---------- */
function getWorkSummary(inv) {
  const services = [];
  inv.categories?.forEach((cat) => {
    cat.services?.forEach((s) => services.push(s.serviceName));
  });
  return services.slice(0, 4).join(', ') + (services.length > 4 ? '…' : '');
}

/* ---------- TEMPLATE VARIABLE REPLACER ---------- */
function applyTemplate(template, inv) {
  return template
    .replace(/{{name}}/g, inv.owner?.name || '')
    .replace(/{{bikeNumber}}/g, inv.bikeNumber || '')
    .replace(/{{bikeModel}}/g, inv.bike?.model || '')
    .replace(/{{work}}/g, getWorkSummary(inv));
}

export default function RecentlyDuePage() {
  const [invoices, setInvoices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [dueRange, setDueRange] = useState(3);
  const [page, setPage] = useState(1);

  const pageSize = 5;
  const today = new Date();

  /* ---------- DATE WINDOW ---------- */
  const toDate = subtractMonths(today, dueRange);
  const fromDate = subtractMonths(today, dueRange + 1);

  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    Promise.all([API.get('/api/invoices'), API.get('/api/whatsapp-templates')])
      .then(([invRes, tplRes]) => {
        setInvoices(invRes.data);
        setTemplates(tplRes.data.filter((t) => t.active));
      })
      .catch(() => alert('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- FILTER DUE INVOICES ---------- */
  const dueInvoices = useMemo(() => {
    const latestByBike = {};

    invoices.forEach((inv) => {
      const bike = inv.bikeNumber;
      if (
        !latestByBike[bike] ||
        new Date(inv.createdAt) > new Date(latestByBike[bike].createdAt)
      ) {
        latestByBike[bike] = inv;
      }
    });

    return Object.values(latestByBike).filter((inv) => {
      const serviceDate = new Date(inv.createdAt);
      return serviceDate >= fromDate && serviceDate < toDate;
    });
  }, [invoices, fromDate, toDate]);

  /* ---------- PAGINATION ---------- */
  const paginatedData = dueInvoices.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  /* ---------- SEND WHATSAPP ---------- */
  const sendWhatsApp = (inv) => {
    const templateId = selectedTemplate[inv._id];
    if (!templateId) {
      alert('Please select a message');
      return;
    }

    const tpl = templates.find((t) => t._id === templateId);
    if (!tpl) {
      alert('Template not found');
      return;
    }

    const message = encodeURIComponent(applyTemplate(tpl.message, inv));
    const phone = inv.owner?.mobile;

    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
  };

  if (loading) {
    return <div className='rd-container'>Loading…</div>;
  }

  return (
    <div className='rd-container'>
      {/* ---------- FILTER BUTTONS ---------- */}
      <div className='rd-filters'>
        {[3, 6, 9].map((m) => (
          <button
            key={m}
            className={dueRange === m ? 'active' : ''}
            onClick={() => {
              setDueRange(m);
              setPage(1);
            }}
          >
            {m} Months
          </button>
        ))}
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      {dueInvoices.length === 0 ? (
        <p className='rd-empty'>
          No vehicles due for {dueRange}-month service 🎉
        </p>
      ) : (
        <>
          {/* ---------- TABLE ---------- */}
          <table className='rd-table'>
            <thead>
              <tr>
                <th>Vehicle No</th>
                <th>Owner</th>
                <th>Bike Model</th>
                <th>Work Done</th>
                <th>Message</th>
                <th>Send</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((inv) => (
                <tr key={inv._id}>
                  <td className='bike'>{inv.bikeNumber}</td>
                  <td>{inv.owner?.name}</td>
                  <td>{inv.bike?.model}</td>
                  <td className='work'>{getWorkSummary(inv)}</td>
                  <td>
                    <select
                      value={selectedTemplate[inv._id] || ''}
                      onChange={(e) =>
                        setSelectedTemplate((p) => ({
                          ...p,
                          [inv._id]: e.target.value,
                        }))
                      }
                    >
                      <option value=''>Select message</option>
                      {templates.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className='send-btn'
                      onClick={() => sendWhatsApp(inv)}
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ---------- PAGINATION ---------- */}
          <div className='rd-pagination'>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>

            <span>Page {page}</span>

            <button
              disabled={page * pageSize >= dueInvoices.length}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
