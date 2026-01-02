import { useEffect, useState } from 'react';
import API from '../adminApi';
import './invoicesPage.scss';

const PAGE_SIZE = 10;

/* 🔧 Format bike number for DISPLAY
   MH12OW0490 → MH 12 OW 0490 */
const formatBikeNumber = (value = '') => {
  if (!value) return '-';
  return value.toUpperCase().replace(/^(.{2})(.{2})(.{2})(.*)$/, '$1 $2 $3 $4');
};

/* 🔧 Clean search query before API call
   Removes spaces + uppercases */
const sanitizeSearchQuery = (value = '') =>
  value.replace(/\s+/g, '').toUpperCase();

export default function InvoicesPage() {
  const [allInvoices, setAllInvoices] = useState([]);
  const [visibleInvoices, setVisibleInvoices] = useState([]);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  /* ---------- FETCH ALL INVOICES ---------- */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/invoices');
      setAllInvoices(res.data);
      setPage(1);
    } catch {
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL LOAD ---------- */
  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------- LIVE SEARCH (DEBOUNCED) ---------- */
  useEffect(() => {
    const timer = setTimeout(async () => {
      const cleanedQuery = sanitizeSearchQuery(query);

      // If search box is empty → show all invoices
      if (!cleanedQuery) {
        fetchAll();
        return;
      }

      try {
        setLoading(true);
        const res = await API.get(`/api/invoices/search?q=${cleanedQuery}`);
        setAllInvoices(res.data);
        setPage(1);
      } catch {
        alert('Search failed');
      } finally {
        setLoading(false);
      }
    }, 400); // ⏱ debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  /* ---------- PAGINATION ---------- */
  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setVisibleInvoices(allInvoices.slice(start, end));
  }, [allInvoices, page]);

  const totalPages = Math.ceil(allInvoices.length / PAGE_SIZE);

  /* ---------- OPEN PRINT PAGE ---------- */
  const openInvoice = (id) => {
    window.open(`/admin/invoices/${id}/print`, '_blank');
  };

  return (
    <div className='invoices-page'>
      {/* ---------- HEADER ---------- */}
      <div className='invoices-header'>
        <h2>Invoices</h2>

        <div className='search-bar'>
          <input
            placeholder='Search by Bike No or Mobile'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className='table-wrapper'>
        {loading ? (
          <p className='status'>Loading invoices...</p>
        ) : visibleInvoices.length === 0 ? (
          <p className='status'>No invoices found</p>
        ) : (
          <table className='invoice-table'>
            <thead>
              <tr>
                <th>Bike No</th>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {visibleInvoices.map((inv) => (
                <tr
                  key={inv._id}
                  onClick={() => openInvoice(inv._id)}
                  title='Click to open invoice'
                >
                  <td>{formatBikeNumber(inv.bikeNumber)}</td>
                  <td>{inv.owner?.name || '-'}</td>
                  <td>{inv.owner?.mobile || '-'}</td>
                  <td>
                    {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className='amount'>₹ {inv.grandTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------- PAGINATION ---------- */}
      {!loading && totalPages > 1 && (
        <div className='pagination'>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
