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

export default function AnalyticsPage() {
  const [apInvoices, setApInvoices] = useState([]);
  const [apLoading, setApLoading] = useState(true);

  const now = new Date();
  const [apMode, setApMode] = useState('THIS_MONTH'); // ALL | THIS_MONTH | LAST_MONTH | CUSTOM
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
    [apFilteredInvoices]
  );

  const apTotalInvoices = apFilteredInvoices.length;

  const apAvgInvoice =
    apTotalInvoices === 0 ? 0 : Math.round(apTotalRevenue / apTotalInvoices);

  /* ---------- SERVICE MIX ---------- */

  const apServiceMix = useMemo(() => {
    let service = 0;
    let category = 0;

    apFilteredInvoices.forEach((inv) => {
      inv.categories.forEach((cat) => {
        if (cat.pricingMode === 'SERVICE') service += cat.categoryTotal;
        else category += cat.categoryTotal;
      });
    });

    const total = service + category || 1;

    return {
      servicePct: Math.round((service / total) * 100),
      categoryPct: Math.round((category / total) * 100),
    };
  }, [apFilteredInvoices]);

  /* ---------- CATEGORY REVENUE ---------- */

  const apCategoryRevenue = useMemo(() => {
    const map = {};
    apFilteredInvoices.forEach((inv) => {
      inv.categories.forEach((cat) => {
        map[cat.categoryName] =
          (map[cat.categoryName] || 0) + cat.categoryTotal;
      });
    });

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [apFilteredInvoices]);

  const apMaxCategory = Math.max(...apCategoryRevenue.map((c) => c.value), 1);

  /* ---------- COUNTERS ---------- */
  const revenueCount = useCountUp(apTotalRevenue);
  const invoiceCount = useCountUp(apTotalInvoices);
  const avgInvoiceCount = useCountUp(apAvgInvoice);

  if (apLoading) {
    return <div className='ap-container'>Loading analytics…</div>;
  }

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
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {apFilteredInvoices.length === 0 ? (
        <div className='ap-empty'>No data available for selected period</div>
      ) : (
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

          <div className='ap-card ap-mix'>
            <h4>Service Mix Ratio</h4>

            <div className='ap-mix-row'>
              <span>Service Based</span>
              <div className='ap-mix-bar'>
                <div style={{ width: `${apServiceMix.servicePct}%` }} />
              </div>
              <span>{apServiceMix.servicePct}%</span>
            </div>

            <div className='ap-mix-row'>
              <span>Category Based</span>
              <div className='ap-mix-bar'>
                <div style={{ width: `${apServiceMix.categoryPct}%` }} />
              </div>
              <span>{apServiceMix.categoryPct}%</span>
            </div>
          </div>

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
      )}
    </div>
  );
}
