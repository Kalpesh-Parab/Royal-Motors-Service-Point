import React, { useEffect, useMemo, useState } from 'react';
import API from '../adminApi';
import './recentlyDuePage.scss';

/* ---------- HELPERS ---------- */

// Calculate exact difference in days between two dates, ignoring time
const getDaysDiff = (targetDate, currentDate) => {
  const d1 = new Date(targetDate);
  const d2 = new Date(currentDate);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

// Gets only the absolute latest invoice for each unique bike
const getLatestInvoices = (invoices) => {
  const map = {};
  invoices.forEach((inv) => {
    const bike = inv.bikeNumber;
    if (
      !map[bike] ||
      new Date(inv.invoiceDate) > new Date(map[bike].createdAt)
    ) {
      map[bike] = inv;
    }
  });
  return Object.values(map);
};

// Determines if a vehicle is exactly due (0-3 days) or borderline (-7 to -1 days)
const getStrictStatus = (invoiceDateStr, filterMonths) => {
  const targetDate = new Date(invoiceDateStr);
  targetDate.setMonth(targetDate.getMonth() + parseInt(filterMonths, 10));

  const diffDays = getDaysDiff(targetDate, new Date());

  if (diffDays >= 0 && diffDays <= 3) return 'due';
  if (diffDays >= -3 && diffDays < 0) return 'borderline';
  return null;
};

// Extracts top 3 services performed
const getWorkSummary = (inv) => {
  const services = [];
  inv.categories?.forEach((cat) => {
    cat.services?.forEach((s) => services.push(s.serviceName));
  });
  return services.slice(0, 3).join(', ') + (services.length > 3 ? '…' : '');
};

// Injects invoice data into the WhatsApp template
const applyTemplate = (template, inv) => {
  return template
    .replace(/{{name}}/g, inv.owner?.name || 'Rider')
    .replace(/{{bikeNumber}}/g, inv.bikeNumber || '')
    .replace(/{{bikeModel}}/g, inv.bike?.model || '')
    .replace(/{{work}}/g, getWorkSummary(inv));
};

/* ---------- COMPONENTS ---------- */

// Reusable table component for clean UI code
const VehicleTable = ({
  title,
  data,
  templates,
  selectedTemplates,
  onTemplateChange,
  onSend,
}) => (
  <div className='rd-table-section'>
    <h3 className='rd-table-title'>
      {title} <span className='count-badge'>{data.length}</span>
    </h3>
    {data.length === 0 ? (
      <p className='rd-empty'>No vehicles to display right now.</p>
    ) : (
      <table className='rd-table'>
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Owner</th>
            <th>Model</th>
            <th>Last Service</th>
            <th>Top Work Done</th>
            <th>Message Template</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((inv) => (
            <tr key={inv._id}>
              <td className='font-bold'>{inv.bikeNumber}</td>
              <td>{inv.owner?.name}</td>
              <td>{inv.bike?.model}</td>
              <td>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
              <td className='text-sm text-gray'>{getWorkSummary(inv)}</td>
              <td>
                <select
                  className='rd-select'
                  value={selectedTemplates[inv._id] || ''}
                  onChange={(e) => onTemplateChange(inv._id, e.target.value)}
                >
                  <option value=''>Select Template...</option>
                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button className='rd-btn-send' onClick={() => onSend(inv)}>
                  Send WA
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default function RecentlyDuePage() {
  const [invoices, setInvoices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [filter, setFilter] = useState('3'); // Defaults to 3 months
  const [loading, setLoading] = useState(true);

  /* ---------- FETCH ---------- */
  useEffect(() => {
    Promise.all([API.get('/api/invoices'), API.get('/api/whatsapp-templates')])
      .then(([invRes, tplRes]) => {
        setInvoices(invRes.data);
        setTemplates(tplRes.data.filter((t) => t.active));
      })
      .catch(() => alert('Failed to load data. Please check your connection.'))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- CORE LOGIC ---------- */
  const { dueList, borderlineList } = useMemo(() => {
    const latest = getLatestInvoices(invoices);
    const due = [];
    const borderline = [];

    latest.forEach((inv) => {
      const status = getStrictStatus(inv.invoiceDate, filter);
      if (status === 'due') due.push(inv);
      if (status === 'borderline') borderline.push(inv);
    });

    // Sort both arrays: oldest invoice first (closest to dropping off)
    const sortByDate = (a, b) =>
      new Date(a.invoiceDate) - new Date(b.invoiceDate);
    due.sort(sortByDate);
    borderline.sort(sortByDate);

    return { dueList: due, borderlineList: borderline };
  }, [invoices, filter]);

  /* ---------- WHATSAPP ---------- */
  const handleSendWhatsApp = (inv) => {
    const templateId = selectedTemplates[inv._id];
    if (!templateId) return alert('Please select a message template first.');

    const tpl = templates.find((t) => t._id === templateId);
    if (!tpl) return alert('Selected template could not be found.');

    const message = encodeURIComponent(applyTemplate(tpl.message, inv));
    const phone = inv.owner?.mobile;

    if (!phone) return alert('No mobile number on file for this owner.');

    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
  };

  const handleTemplateChange = (invoiceId, templateId) => {
    setSelectedTemplates((prev) => ({ ...prev, [invoiceId]: templateId }));
  };

  if (loading)
    return <div className='rd-container loading'>Loading Service Data...</div>;

  return (
    <div className='rd-container'>
      <header className='rd-header'>
        <h2>Service Reminders</h2>
        <div className='rd-filters'>
          <button
            className={filter === '3' ? 'active' : ''}
            onClick={() => setFilter('3')}
          >
            3 Months
          </button>
          <button
            className={filter === '6' ? 'active' : ''}
            onClick={() => setFilter('6')}
          >
            6 Months
          </button>
          <button
            className={filter === '9' ? 'active' : ''}
            onClick={() => setFilter('9')}
          >
            9 Months
          </button>
        </div>
      </header>

      <VehicleTable
        title='Active Due (0-3 Days Window)'
        data={dueList}
        templates={templates}
        selectedTemplates={selectedTemplates}
        onTemplateChange={handleTemplateChange}
        onSend={handleSendWhatsApp}
      />

      <VehicleTable
        title='Approaching Deadline (Next 3 Days)'
        data={borderlineList}
        templates={templates}
        selectedTemplates={selectedTemplates}
        onTemplateChange={handleTemplateChange}
        onSend={handleSendWhatsApp}
      />
    </div>
  );
}
