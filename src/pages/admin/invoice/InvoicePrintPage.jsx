import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import API from '../adminApi';
import InvoicePrint from './InvoicePrint';

export default function InvoicePrintPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    API.get(`/api/invoices/id/${id}`)
      .then((res) => setInvoice(res.data))
      .catch(() => alert('Failed to load invoice'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading invoice...</p>;
  if (!invoice) return <p>Invoice not found</p>;

  return <InvoicePrint invoice={invoice} />;
}
