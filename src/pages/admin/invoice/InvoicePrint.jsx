import logo from '../../../assets/logo.png';
import './invoicePrint.scss';

// 🔢 Number → Words (Indian format, simple & reliable)
const numberToWords = (num) => {
  if (!num) return '';

  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const inWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] + ' Hundred ' + (n % 100 ? inWords(n % 100) : '')
      );
    if (n < 100000)
      return (
        inWords(Math.floor(n / 1000)) +
        ' Thousand ' +
        (n % 1000 ? inWords(n % 1000) : '')
      );
    if (n < 10000000)
      return (
        inWords(Math.floor(n / 100000)) +
        ' Lakh ' +
        (n % 100000 ? inWords(n % 100000) : '')
      );
    return '';
  };

  return `Rupees ${inWords(num)} Only`;
};

export default function InvoicePrint({ invoice }) {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const handlePrint = () => {
    document.title = `${invoice.bikeNumber}_Invoice`;
    window.print();
  };

  return (
    <div className='invoice-wrapper'>
      {/* 🔘 PRINT BUTTON */}
      <div className='print-actions'>
        <button onClick={handlePrint}>🖨️ Print Invoice</button>
      </div>

      <div className='invoice-page'>
        {/* ---------- HEADER ---------- */}
        <header className='header'>
          <img src={logo} alt='Royal Motors' />
          <div className='company'>
            <h2>Royal Motors Service Point</h2>
            <p>Porwal Road, Dhanori, Pune</p>
            <p>Phone: +91 97678 52720</p>
          </div>
        </header>

        {/* ---------- DETAILS ---------- */}
        <section className='info'>
          <div className='block'>
            <h4>Owner Details</h4>
            <p>
              <b>Name:</b> {invoice.owner.name}
            </p>
            <p>
              <b>Mobile:</b> {invoice.owner.mobile}
            </p>
            <p>
              <b>Address:</b> {invoice.owner.address}
            </p>
          </div>

          <div className='block'>
            <h4>Bike Details</h4>
            <p>
              <b>Date:</b> {formatDate(invoice.createdAt)}
            </p>
            <p>
              <b>Model:</b> {invoice.bike.model}
            </p>
            <p>
              <b>Bike No:</b> {invoice.bikeNumber}
            </p>
            <p>
              <b>KMs:</b> {invoice.bike.kms}
            </p>
          </div>
        </section>

        {/* ---------- TABLE ---------- */}
        <table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Category</th>
              <th>Services</th>
              <th>Charges</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.categories.map((cat, i) => (
              <tr key={cat._id}>
                <td>{i + 1}</td>
                <td>{cat.categoryName}</td>

                <td className='services'>
                  <ul>
                    {cat.services.map((s) => (
                      <li key={s._id}>{s.serviceName}</li>
                    ))}
                  </ul>
                </td>

                <td className='charges'>
                  {cat.pricingMode === 'SERVICE' ? (
                    <ul>
                      {cat.services.map((s) => (
                        <li key={s._id}>₹ {s.price}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>Included</span>
                  )}
                </td>

                <td className='charges2'>₹ {cat.categoryTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---------- FOOTER ---------- */}
        <footer className='footer'>
          <div className='total'>
            <span>Grand Total</span>
            <span>₹ {invoice.grandTotal}</span>
          </div>

          {/* ✅ TOTAL IN WORDS */}
          <p className='amount-words'>{numberToWords(invoice.grandTotal)}</p>

          <div className='signature'>
              <p>Authorised Signatory – Royal Motors</p>
         
            <p>Bike Owner's Signature</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
