import { useEffect, useMemo, useState } from 'react';
import API from '../adminApi';
import './expensesPage.scss';

/* ---------- DATE FILTER HELPERS ---------- */
const getMonthRange = (month, year) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start, end };
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState('ALL'); // ALL | THIS_MONTH | LAST_MONTH | CUSTOM
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [editingId, setEditingId] = useState(null);

  /* ---------- FORM STATE ---------- */
  const [form, setForm] = useState({
    vendorInvoiceDate: '',
    vendorInvoiceNumber: '',
    vendorName: '',
    description: '',
    invoiceTotal: '',
    paymentAmount: '',
    paymentMode: 'CASH',
    paymentDate: '',
    notes: '',
  });

  /* ---------- FETCH ---------- */
  const fetchExpenses = () => {
    API.get('/api/expenses')
      .then((res) => setExpenses(res.data))
      .catch(() => alert('Failed to fetch expenses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* ---------- HANDLE INPUT ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/api/expenses/${editingId}`, form);
      } else {
        await API.post('/api/expenses', form);
      }

      setForm({
        vendorInvoiceDate: '',
        vendorInvoiceNumber: '',
        vendorName: '',
        description: '',
        invoiceTotal: '',
        paymentAmount: '',
        paymentMode: 'CASH',
        paymentDate: '',
        notes: '',
      });

      setEditingId(null);
      fetchExpenses();
    } catch {
      alert('Failed to save expense');
    }
  };

  /* ---------- EDIT ---------- */
  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setForm({
      ...exp,
      vendorInvoiceDate: exp.vendorInvoiceDate?.slice(0, 10),
      paymentDate: exp.paymentDate?.slice(0, 10),
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;

    try {
      await API.delete(`/api/expenses/${id}`);
      fetchExpenses();
    } catch {
      alert('Delete failed');
    }
  };

  /* ---------- FILTER ---------- */
  const filteredExpenses = useMemo(() => {
    let start, end;

    if (mode === 'THIS_MONTH') {
      ({ start, end } = getMonthRange(today.getMonth(), today.getFullYear()));
    } else if (mode === 'LAST_MONTH') {
      ({ start, end } = getMonthRange(
        today.getMonth() - 1,
        today.getFullYear(),
      ));
    } else if (mode === 'CUSTOM') {
      ({ start, end } = getMonthRange(month, year));
    }

    let data = [...expenses];

    if (mode !== 'ALL') {
      data = data.filter((exp) => {
        const d = new Date(exp.paymentDate);
        return d >= start && d <= end;
      });
    }

    // newest first
    return data.sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
    );
  }, [expenses, mode, month, year]);

  if (loading) return <div className='exp-container'>Loading...</div>;

  const currentYear = today.getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className='exp-container'>
      {/* ---------- FORM ---------- */}
      <form className='exp-form' onSubmit={handleSubmit}>
        <h3>{editingId ? 'Edit Expense' : 'Add Expense'}</h3>

        <div className='grid'>
          <div className='field'>
            <label>Vendor Invoice Date</label>
            <input
              type='date'
              name='vendorInvoiceDate'
              value={form.vendorInvoiceDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field'>
            <label>Invoice / Voucher No</label>
            <input
              type='text'
              name='vendorInvoiceNumber'
              value={form.vendorInvoiceNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field'>
            <label>Vendor Name</label>
            <input
              type='text'
              name='vendorName'
              value={form.vendorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field'>
            <label>Expense Description</label>
            <input
              type='text'
              name='description'
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field'>
            <label>Invoice Total</label>
            <input
              type='number'
              name='invoiceTotal'
              value={form.invoiceTotal}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field'>
            <label>Payment Amount</label>
            <input
              type='number'
              name='paymentAmount'
              value={form.paymentAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field'>
            <label>Payment Mode</label>
            <select
              name='paymentMode'
              value={form.paymentMode}
              onChange={handleChange}
            >
              <option value='CASH'>Cash</option>
              <option value='UPI'>UPI</option>
            </select>
          </div>

          <div className='field'>
            <label>Payment Date</label>
            <input
              type='date'
              name='paymentDate'
              value={form.paymentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className='field full'>
            <label>Notes</label>
            <input
              type='text'
              name='notes'
              value={form.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type='submit'>
          {editingId ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      {/* ---------- FILTERS ---------- */}
      <div className='exp-filters'>
        <button onClick={() => setMode('ALL')}>All</button>
        <button onClick={() => setMode('THIS_MONTH')}>This Month</button>
        <button onClick={() => setMode('LAST_MONTH')}>Last Month</button>

        <select
          onChange={(e) => {
            setMonth(+e.target.value);
            setMode('CUSTOM');
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString('en-IN', { month: 'long' })}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            setYear(+e.target.value);
            setMode('CUSTOM');
          }}
        >
          {years.map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className='exp-table-wrapper'>
        <table className='exp-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp._id}>
                <td>{new Date(exp.paymentDate).toLocaleDateString()}</td>
                <td>{exp.vendorName}</td>
                <td>{exp.description}</td>
                <td>₹ {exp.paymentAmount}</td>
                <td>{exp.paymentMode}</td>

                <td>
                  <button onClick={() => handleEdit(exp)}>Edit</button>
                  <button onClick={() => handleDelete(exp._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
