import React, { useEffect, useMemo, useState } from 'react';
import API from '../adminApi';
import './analyticsPage.scss';

/* ---------- COUNT UP HOOK ---------- */
// Updated to handle both positive (revenue) and negative (loss) numbers smoothly
function useCountUp(value, duration = 900) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (
        (increment > 0 && start >= value) ||
        (increment < 0 && start <= value) ||
        increment === 0
      ) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return display;
}

/* ---------- EXACT DAYS DIFF ---------- */
const getDaysDiff = (targetDate, currentDate) => {
  const d1 = new Date(targetDate);
  const d2 = new Date(currentDate);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

export default function AnalyticsPage() {
  const [apInvoices, setApInvoices] = useState([]);
  const [apExpenses, setApExpenses] = useState([]);
  const [apLoading, setApLoading] = useState(true);

  // Using state for "now" so it stays consistent during the render cycle
  const [now] = useState(new Date());

  const [apMode, setApMode] = useState('THIS_MONTH');
  const [apMonth, setApMonth] = useState(now.getMonth());
  const [apYear, setApYear] = useState(now.getFullYear());

  useEffect(() => {
    // Make sure to replace '/api/expenses' with your exact endpoint if it differs
    Promise.all([API.get('/api/invoices'), API.get('/api/expenses')])
      .then(([invRes, expRes]) => {
        setApInvoices(invRes.data);
        setApExpenses(expRes.data);
      })
      .catch(() => alert('Failed to load analytics'))
      .finally(() => setApLoading(false));
  }, []);

  /* ---------------- FILTER BOUNDARIES ---------------- */
  const { start, end } = useMemo(() => {
    let s, e;
    if (apMode === 'THIS_MONTH') {
      s = new Date(now.getFullYear(), now.getMonth(), 1);
      e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (apMode === 'LAST_MONTH') {
      s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      e = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      s = new Date(apYear, apMonth, 1);
      e = new Date(apYear, apMonth + 1, 0);
    }
    return { start: s, end: e };
  }, [apMode, apMonth, apYear, now]);

  /* ---------------- FILTER LOGIC (INVOICES) ---------------- */
  const apFilteredInvoices = useMemo(() => {
    if (apMode === 'ALL') return apInvoices;
    return apInvoices.filter((inv) => {
      const d = new Date(inv.invoiceDate || inv.createdAt);
      return d >= start && d <= end;
    });
  }, [apInvoices, apMode, start, end]);

  /* ---------------- FILTER LOGIC (EXPENSES) ---------------- */
  const apFilteredExpenses = useMemo(() => {
    if (apMode === 'ALL') return apExpenses;
    return apExpenses.filter((exp) => {
      // Strictly considering paymentDate as requested
      const d = new Date(exp.paymentDate);
      return d >= start && d <= end;
    });
  }, [apExpenses, apMode, start, end]);

  /* ---------------- METRICS ---------------- */
  const apTotalGross = useMemo(
    () => apFilteredInvoices.reduce((s, i) => s + i.grandTotal, 0),
    [apFilteredInvoices],
  );

  const apTotalExpenses = useMemo(
    () => apFilteredExpenses.reduce((s, e) => s + (e.paymentAmount || 0), 0),
    [apFilteredExpenses],
  );

  const apNetRevenue = apTotalGross - apTotalExpenses;
  const apTotalInvoices = apFilteredInvoices.length;
  const apAvgInvoice =
    apTotalInvoices === 0 ? 0 : Math.round(apTotalGross / apTotalInvoices);

  /* ---------- CATEGORY REVENUE ---------- */
  const apCategoryRevenue = useMemo(() => {
    const map = {};

    apFilteredInvoices.forEach((inv) => {
      inv.categories?.forEach((cat) => {
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
  const netRevenueCount = useCountUp(apNetRevenue);
  const invoiceCount = useCountUp(apTotalInvoices);
  const avgInvoiceCount = useCountUp(apAvgInvoice);

  /* ---------- STRICT 3 MONTH DUE WIDGET ---------- */
  const apDueCustomers = useMemo(() => {
    const map = {};

    // 1. Get the absolute latest invoice per vehicle
    apInvoices.forEach((inv) => {
      const bike = inv.bikeNumber;
      if (
        !map[bike] ||
        new Date(inv.invoiceDate) > new Date(map[bike].invoiceDate)
      ) {
        map[bike] = inv;
      }
    });

    const activeDueList = [];

    // 2. Apply strict calendar math (0 to 3 days window)
    Object.values(map).forEach((inv) => {
      const targetDate = new Date(inv.invoiceDate);
      targetDate.setMonth(targetDate.getMonth() + 3);

      const diffDays = getDaysDiff(targetDate, now);

      if (diffDays >= 0 && diffDays <= 3) {
        activeDueList.push({ ...inv, diffDays });
      }
    });

    // 3. Sort by urgency
    return activeDueList.sort((a, b) => b.diffDays - a.diffDays).slice(0, 4);
  }, [apInvoices, now]);

  const openInvoice = (id) => {
    window.open(`/admin/invoices/${id}/print`, '_blank');
  };

  if (apLoading) {
    return <div className='ap-container loading'>Loading analytics…</div>;
  }

  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
        {/* DYNAMIC NET REVENUE CARD */}
        <div className='ap-card'>
          <h4>Net Revenue</h4>
          <p
            className='ap-big'
            style={{ color: apNetRevenue >= 0 ? '#25d366' : '#ff4d4d' }}
          >
            {apNetRevenue >= 0 ? '▲' : '▼'} ₹{' '}
            {Math.abs(netRevenueCount).toLocaleString('en-IN')}
          </p>
          <span style={{ fontSize: '11px' }}>
            Gross: ₹{apTotalGross.toLocaleString('en-IN')} | Exp: ₹
            {apTotalExpenses.toLocaleString('en-IN')}
          </span>
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

        {/* 🔔 3 MONTH DUE WIDGET */}
        <div className='ap-card ap-due'>
          <h4>(3 Months Due)</h4>

          {apDueCustomers.length === 0 ? (
            <p className='ap-due-empty'>
              No vehicles in the 3-day active window. 🎉
            </p>
          ) : (
            <ul className='ap-due-list'>
              {apDueCustomers.map((inv) => (
                <li key={inv._id} onClick={() => openInvoice(inv._id)}>
                  <span className='bike'>{inv.bikeNumber}</span>
                  <span className='mobile'>{inv.owner?.mobile}</span>
                  <span className='ago'>
                    {inv.diffDays === 0
                      ? 'Due Today'
                      : `${inv.diffDays} day(s) overdue`}
                  </span>
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
