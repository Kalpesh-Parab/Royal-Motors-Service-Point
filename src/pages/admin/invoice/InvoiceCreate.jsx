import "./invoiceCreate.scss"
import { useEffect, useState } from 'react';
import API from '../adminApi';
import { toast } from 'react-toastify';

import OwnerDetails from './components/OwnerDetails';
import BikeDetails from './components/BikeDetails';
import ServiceCategories from './components/ServiceCategories';

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
    date: new Date().toISOString().slice(0, 10),
  });

  const [availableCategories, setAvailableCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, outTime: getCurrentTime() }));
  }, []);

  useEffect(() => {
    API.get('api/services')
      .then((res) => setAvailableCategories(res.data))
      .catch(() => toast.error('Failed to load services'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'bikeNumber') {
      const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      setForm((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 SUBMIT HANDLER
  const handleSubmit = async () => {
    try {
      if (!form.bikeNumber || !form.ownerName || !form.mobile) {
        return toast.error('Please fill owner & bike details');
      }

      if (!categories.length) {
        return toast.error('Add at least one service category');
      }

      // Validate categories
      for (const cat of categories) {
        if (!cat.services.length) {
          return toast.error(
            `Select at least one service in ${cat.categoryName}`
          );
        }

        if (cat.pricingMode === 'SERVICE') {
          const invalid = cat.services.some((s) => !s.price || s.price <= 0);
          if (invalid) {
            return toast.error(
              `Enter prices for all services in ${cat.categoryName}`
            );
          }
        }

        if (cat.pricingMode === 'CATEGORY' && !cat.categoryPrice) {
          return toast.error(
            `Enter category price for ${cat.categoryName}`
          );
        }
      }

      const payload = {
        bikeNumber: form.bikeNumber,
        owner: {
          name: form.ownerName,
          address: form.address,
          mobile: form.mobile,
          email: form.email,
        },
        bike: {
          model:
            form.bikeModel === 'OTHER'
              ? form.customBikeModel
              : form.bikeModel,
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
      toast.success('Invoice created successfully');

      // reset
      setForm({
        bikeNumber: '',
        ownerName: '',
        address: '',
        mobile: '',
        email: '',
        bikeModel: '',
        customBikeModel: '',
        bikeKms: '',
        inTime: '',
        outTime: getCurrentTime(),
        date: new Date().toISOString().slice(0, 10),
      });
      setCategories([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-create">
      <h2>Create Invoice</h2>

      <OwnerDetails form={form} onChange={handleChange} />
      <BikeDetails form={form} onChange={handleChange} />

      <ServiceCategories
        availableCategories={availableCategories}
        categories={categories}
        setCategories={setCategories}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: 20 }}
      >
        {loading ? 'Creating Invoice...' : 'Create Invoice'}
      </button>
    </div>
  );
}
