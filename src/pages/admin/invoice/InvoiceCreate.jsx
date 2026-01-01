import './invoiceCreate.scss';
import { useEffect, useState } from 'react';
import API from '../adminApi';
import { toast } from 'react-toastify';

import OwnerDetails from './components/OwnerDetails';
import BikeDetails from './components/BikeDetails';
import ServiceCategories from './components/ServiceCategories';
import RecentInvoices from './RecentInvoices';

export default function InvoiceCreate() {
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
  };

  const [form, setForm] = useState({
    bikeNumber: '',
    ownerName: '',
    address: '',
    mobile: '',
    email: '',
    bikeModel: '',
    customBikeModel: '',
    bikeKms: '',
    inTime: '',
    outTime: '',
    date: '',
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, outTime: getCurrentTime() }));
  }, []);

  useEffect(() => {
    API.get('api/services')
      .then((res) => setAvailableCategories(res.data))
      .catch(() => toast.error('Failed to load services'));

    loadRecentInvoices();
  }, []);

  const loadRecentInvoices = async () => {
    try {
      const res = await API.get('api/invoices');
      setRecentInvoices(res.data.slice(0, 3));
    } catch {
      toast.error('Failed to load recent invoices');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'bikeNumber') {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setForm((prev) => ({ ...prev, bikeNumber: cleaned }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.bikeNumber || !form.ownerName || !form.mobile) {
        return toast.error('Please fill owner & bike details');
      }

      if (!form.date || !form.inTime) {
        return toast.error('Please select bike in date & time');
      }

      if (!categories.length) {
        return toast.error('Add at least one service category');
      }

      const payload = {
        bikeNumber: form.bikeNumber,
        invoiceDate: form.date,
        owner: {
          name: form.ownerName,
          address: form.address,
          mobile: form.mobile,
          email: form.email,
        },
        bike: {
          model:
            form.bikeModel === 'OTHER' ? form.customBikeModel : form.bikeModel,
          kms: Number(form.bikeKms),
        },
        timings: {
          inTime: form.inTime,
          outTime: form.outTime,
        },
        categories: categories.map((cat) => ({
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          pricingMode: cat.pricingMode,
          services: cat.services.map((s) => ({
            serviceName: s.name,
            price: s.price,
          })),
          categoryPrice: cat.categoryPrice || 0,
        })),
      };

      setLoading(true);
      await API.post('api/invoices', payload);
      toast.success('Invoice created');

      setCategories([]);
      loadRecentInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='invoice-create'>
      <h2>Create Invoice</h2>

      <OwnerDetails form={form} onChange={handleChange} />
      <BikeDetails form={form} onChange={handleChange} />

      <ServiceCategories
        availableCategories={availableCategories}
        categories={categories}
        setCategories={setCategories}
      />

      <button onClick={handleSubmit} disabled={loading} style={{marginTop:'2vw'}}>
        {loading ? 'Creating...' : 'Create Invoice'}
      </button>

      <RecentInvoices invoices={recentInvoices} />
    </div>
  );
}
