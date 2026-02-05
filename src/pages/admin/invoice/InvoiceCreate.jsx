import './invoiceCreate.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../adminApi';
import { toast } from 'react-toastify';

import OwnerDetails from './components/OwnerDetails';
import BikeDetails from './components/BikeDetails';
import ServiceCategories from './components/ServiceCategories';
import RecentInvoices from './RecentInvoices';
import QuickServicePicker from './components/QuickServicePicker';

const BIKE_MODELS = [
  'Old - G2 Lightening',
  'Old - G2 Tauras',
  'Old - G2',
  'Old Standard 350',
  'Old Standard 500',
  'Classic 500',
  'Classic 350',
  'Reborn 350',
  'Meteor 350',
  'Himalayan 411',
  'Himalayan 450',
  'Scram',
  'Hunter 350',
  'Guerrilla 450',
  'Meteor 650',
  'Interceptor 650',
  'Continental GT 650',
];

/* ---------- SAFE WHATSAPP PARSER (UPDATED FORMAT) ---------- */
const parseWhatsappMessage = (text = '') => {
  if (!text || typeof text !== 'string') return {};

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const getValue = (labelRegex) => {
    const index = lines.findIndex((line) =>
      new RegExp(`^${labelRegex}`, 'i').test(line),
    );

    if (index === -1) return '';

    // Case 1: "Label: value"
    const sameLineMatch = lines[index].match(/:(.*)$/);
    if (sameLineMatch && sameLineMatch[1]?.trim()) {
      return sameLineMatch[1].trim();
    }

    // Case 2: value on next line
    return lines[index + 1] || '';
  };

  return {
    ownerName: getValue('Name'),

    bikeModel: getValue('Bike model'),

    bikeKms: getValue('KMs').replace(/[^0-9]/g, ''),

    bikeNumber: getValue('Bike No')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase(),

    address: getValue('Address'),

    mobile: getValue('WhatsApp No|Mobile|Phone').replace(/[^0-9]/g, ''),

    email: getValue('Email'),
  };
};

/* ---------- BIKE MODEL MATCHER (FINAL & STABLE) ---------- */

const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/([a-z])([0-9])/gi, '$1 $2')
    .replace(/([0-9])([a-z])/gi, '$1 $2')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isNumeric = (str) => /^\d+$/.test(str);

/* Levenshtein Distance */
const levenshtein = (a = '', b = '') => {
  const dp = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  return dp[a.length][b.length];
};

const isFuzzyWordMatch = (a, b) => {
  if (isNumeric(a) || isNumeric(b)) return false;

  const dist = levenshtein(a, b);

  if (a.length <= 5) return dist <= 1;
  return dist <= 2;
};

const resolveBikeModel = (inputModel = '') => {
  if (!inputModel) {
    return { bikeModel: '', customBikeModel: '' };
  }

  const input = normalize(inputModel);
  const inputTokens = input.split(' ');

  let bestMatch = '';
  let bestScore = 0;
  let hasWordMatch = false;

  BIKE_MODELS.forEach((model) => {
    const normalizedModel = normalize(model);
    const modelTokens = normalizedModel.split(' ');

    let score = 0;
    let wordMatched = false;

    inputTokens.forEach((token) => {
      modelTokens.forEach((mToken) => {
        // exact word
        if (token === mToken) {
          score += isNumeric(token) ? 1 : 4;
          if (!isNumeric(token)) wordMatched = true;
        }
        // prefix match
        else if (!isNumeric(token) && mToken.startsWith(token)) {
          score += 3;
          wordMatched = true;
        }
        // fuzzy typo match
        else if (isFuzzyWordMatch(token, mToken)) {
          score += 2;
          wordMatched = true;
        }
      });
    });

    if (score > bestScore) {
      bestScore = score;
      bestMatch = model;
      hasWordMatch = wordMatched;
    }
  });

  // ✅ FINAL DECISION RULE
  if (hasWordMatch && bestScore >= 3) {
    return {
      bikeModel: bestMatch,
      customBikeModel: '',
    };
  }

  return {
    bikeModel: 'OTHER',
    customBikeModel: inputModel,
  };
};

export default function InvoiceCreate({ editId }) {
  const isEditMode = Boolean(editId);

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes(),
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

  const [whatsappText, setWhatsappText] = useState('');

  const [availableCategories, setAvailableCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;

    const loadInvoice = async () => {
      try {
        const res = await API.get(`/api/invoices/id/${editId}`);
        const inv = res.data;

        setForm({
          bikeNumber: inv.bikeNumber,
          ownerName: inv.owner?.name || '',
          address: inv.owner?.address || '',
          mobile: inv.owner?.mobile || '',
          email: inv.owner?.email || '',
          bikeModel: BIKE_MODELS.includes(inv.bike?.model)
            ? inv.bike.model
            : 'OTHER',
          customBikeModel: BIKE_MODELS.includes(inv.bike?.model)
            ? ''
            : inv.bike?.model || '',
          bikeKms: inv.bike?.kms || '',
          inTime: inv.timings?.inTime || '',
          outTime: inv.timings?.outTime || '',
          date: inv.invoiceDate?.slice(0, 10),
        });

        setCategories(
          inv.categories.map((cat) => ({
            categoryId: cat.categoryId,
            categoryName: cat.categoryName,
            pricingMode: cat.pricingMode,
            services: cat.services.map((s) => ({
              name: s.serviceName,
              price: s.price,
            })),
            categoryPrice: cat.categoryPrice,
          })),
        );
      } catch {
        toast.error('Failed to load invoice');
      }
    };

    loadInvoice();
  }, [editId, isEditMode]);

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

  /* ---------- APPLY WHATSAPP DATA ---------- */
  const applyWhatsappData = () => {
    if (!whatsappText.trim()) {
      toast.error('Paste WhatsApp message first');
      return;
    }

    const parsed = parseWhatsappMessage(whatsappText);

    if (!parsed.ownerName && !parsed.bikeNumber) {
      toast.error('Could not detect valid data from message');
      return;
    }

    // 🔥 Resolve bike model smartly
    const resolvedModel = resolveBikeModel(parsed.bikeModel);

    setForm((prev) => ({
      ...prev,
      ...parsed,
      bikeModel: resolvedModel.bikeModel,
      customBikeModel: resolvedModel.customBikeModel,
    }));

    if (resolvedModel.bikeModel === 'OTHER') {
      toast.info('Bike model added as manual entry');
    } else if (resolvedModel.bikeModel) {
      toast.success(`Bike model auto-detected: ${resolvedModel.bikeModel}`);
    } else {
      toast.success('Details auto-filled from WhatsApp message');
    }
  };

  const addServiceToCategory = async (categoryId, serviceName) => {
    try {
      await API.patch(`/api/services/${categoryId}/add`, {
        service: serviceName,
      });

      toast.success('Service added');

      // 🔄 Update availableCategories locally
      setAvailableCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? { ...cat, services: [...cat.services, serviceName] }
            : cat,
        ),
      );
    } catch {
      toast.error('Failed to add service');
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

      if (isEditMode) {
        // 🟡 UPDATE EXISTING INVOICE
        await API.put(`/api/invoices/${editId}`, payload);
        toast.success('Invoice updated successfully');
      } else {
        // 🟢 CREATE NEW INVOICE
        await API.post('api/invoices', payload);
        toast.success('Invoice created successfully');

        // Clear form only on create
        setCategories([]);
      }

      loadRecentInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 🔄 Switched from EDIT → CREATE
    if (isEditMode) return;

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
      date: '',
    });

    setCategories([]);
    setWhatsappText('');
  }, [isEditMode]);

  return (
    <div className='invoice-create'>
      <div className='ic-header'>
        <h2>{isEditMode ? 'Edit Invoice' : 'Create Invoice'}</h2>
        {/* WHATSAPP PARSER */}
        <div className='whatsapp-box'>
          <textarea
            placeholder='Paste customer WhatsApp message here...'
            value={whatsappText}
            onChange={(e) => setWhatsappText(e.target.value)}
          />
          <button onClick={applyWhatsappData}>Auto Fill</button>
        </div>
      </div>

      <OwnerDetails form={form} onChange={handleChange} />
      <BikeDetails form={form} onChange={handleChange} />
      <QuickServicePicker
        availableCategories={availableCategories}
        categories={categories}
        setCategories={setCategories}
      />

      <ServiceCategories
        availableCategories={availableCategories}
        categories={categories}
        setCategories={setCategories}
        onAddService={addServiceToCategory}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading
          ? isEditMode
            ? 'Updating...'
            : 'Creating...'
          : isEditMode
            ? 'Update Invoice'
            : 'Create Invoice'}
      </button>

      <RecentInvoices invoices={recentInvoices} />
    </div>
  );
}
