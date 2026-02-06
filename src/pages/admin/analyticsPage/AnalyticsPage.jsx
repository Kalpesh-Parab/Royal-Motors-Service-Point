import { useEffect, useMemo, useState } from 'react';
import API from '../adminApi';
import './analyticsPage.scss';

/* ---------- COUNT UP HOOK ---------- */
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

/* ---------- MONTH DIFF ---------- */
const monthDiff = (from, to) =>
  (to.getFullYear() - from.getFullYear()) * 12 +
  (to.getMonth() - from.getMonth());

export default function AnalyticsPage() {
  const [apInvoices, setApInvoices] = useState([]);
  const [apLoading, setApLoading] = useState(true);

  const now = new Date();
  const [apMode, setApMode] = useState('THIS_MONTH');
  const [apMonth, setApMonth] = useState(now.getMonth());
  const [apYear, setApYear] = useState(now.getFullYear());

  useEffect(() => {
    API.get('/api/invoices')
      .then((res) => setApInvoices(res.data))
      .catch(() => alert('Failed to load analytics'))
      .finally(() => setApLoading(false));
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */

  const apFilteredInvoices = useMemo(() => {
    if (apMode === 'ALL') return apInvoices;

    let start, end;

    if (apMode === 'THIS_MONTH') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (apMode === 'LAST_MONTH') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      start = new Date(apYear, apMonth, 1);
      end = new Date(apYear, apMonth + 1, 0);
    }

    return apInvoices.filter((inv) => {
      const d = new Date(inv.createdAt);
      return d >= start && d <= end;
    });
  }, [apInvoices, apMode, apMonth, apYear, now]);

  /* ---------------- METRICS ---------------- */

  const apTotalRevenue = useMemo(
    () => apFilteredInvoices.reduce((s, i) => s + i.grandTotal, 0),
    [apFilteredInvoices],
  );

  const apTotalInvoices = apFilteredInvoices.length;

  const apAvgInvoice =
    apTotalInvoices === 0 ? 0 : Math.round(apTotalRevenue / apTotalInvoices);

  /* ---------- CATEGORY REVENUE ---------- */
  const apCategoryRevenue = useMemo(() => {
    const map = {};

    apFilteredInvoices.forEach((inv) => {
      inv.categories.forEach((cat) => {
        map[cat.categoryName] =
          (map[cat.categoryName] || 0) + cat.categoryTotal;
      });
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [apFilteredInvoices]);

  const apMaxCategory = Math.max(...apCategoryRevenue.map((c) => c.value), 1);

  /* ---------- COUNTERS ---------- */
  const revenueCount = useCountUp(apTotalRevenue);
  const invoiceCount = useCountUp(apTotalInvoices);
  const avgInvoiceCount = useCountUp(apAvgInvoice);

  /* ---------- 3 MONTH DUE CUSTOMERS ---------- */
  const apDueCustomers = useMemo(() => {
    const map = {};

    apInvoices.forEach((inv) => {
      const bike = inv.bikeNumber;
      if (
        !map[bike] ||
        new Date(inv.createdAt) > new Date(map[bike].createdAt)
      ) {
        map[bike] = inv;
      }
    });

    return Object.values(map)
      .map((inv) => {
        const months = monthDiff(new Date(inv.createdAt), now);
        return { ...inv, months };
      })
      .filter((inv) => inv.months >= 3 && inv.months < 4)
      .sort((a, b) => a.months - b.months)
      .slice(0, 3);
  }, [apInvoices, now]);

  const openInvoice = (id) => {
    window.open(`/admin/invoices/${id}/print`, '_blank');
  };

  if (apLoading) {
    return <div className='ap-container'>Loading analytics…</div>;
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <div className='ap-container'>
      {/* HEADER */}
      <div className='ap-header'>
        <h2>Garage Analytics</h2>

        <div className='ap-controls'>
          <div className='ap-toggle'>
            {['ALL', 'THIS_MONTH', 'LAST_MONTH'].map((f) => (
              <button
                key={f}
                className={apMode === f ? 'active' : ''}
                onClick={() => setApMode(f)}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className='ap-picker'>
            <select
              value={apMonth}
              onChange={(e) => {
                setApMonth(+e.target.value);
                setApMode('CUSTOM');
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('en-IN', { month: 'long' })}
                </option>
              ))}
            </select>

            <select
              value={apYear}
              onChange={(e) => {
                setApYear(+e.target.value);
                setApMode('CUSTOM');
              }}
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='ap-grid'>
        <div className='ap-card'>
          <h4>Total Revenue</h4>
          <p className='ap-big accent'>
            ₹ {revenueCount.toLocaleString('en-IN')}
          </p>
          <span>Selected period</span>
        </div>

        <div className='ap-card'>
          <h4>Invoices Generated</h4>
          <p className='ap-big accent'>{invoiceCount}</p>
          <span>Jobs completed</span>
        </div>

        <div className='ap-card'>
          <h4>Average Invoice Value</h4>
          <p className='ap-big accent'>
            ₹ {avgInvoiceCount.toLocaleString('en-IN')}
          </p>
          <span>Per job</span>
        </div>

        {/* 🔔 3 MONTH DUE */}
        <div className='ap-card ap-due'>
          <h4>Recently Due (3 Months)</h4>

          {apDueCustomers.length === 0 ? (
            <p className='ap-due-empty'>No customers due recently 🎉</p>
          ) : (
            <ul className='ap-due-list'>
              {apDueCustomers.map((inv) => (
                <li key={inv._id} onClick={() => openInvoice(inv._id)}>
                  <span className='bike'>{inv.bikeNumber}</span>
                  <span className='mobile'>{inv.owner?.mobile}</span>
                  <span className='ago'>{inv.months} months ago</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* 📊 REVENUE BY CATEGORY */}
        <div className='ap-card ap-categories'>
          <h4>Revenue by Category</h4>

          {apCategoryRevenue.map((cat) => (
            <div key={cat.name} className='ap-bar-row'>
              <div className='ap-bar-label'>{cat.name}</div>

              <div className='ap-bar-track'>
                <div
                  className='ap-bar-fill'
                  style={{
                    width: `${(cat.value / apMaxCategory) * 100}%`,
                  }}
                />
              </div>

              <div className='ap-bar-amount'>
                ₹ {cat.value.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
