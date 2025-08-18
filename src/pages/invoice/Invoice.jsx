import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../../assets/logo.png';
import './invoice.scss';

const Invoice = () => {
  // State
  const [rows, setRows] = useState([{ service: '', cost: '' }]);
  const [customerName, setCustomerName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleInDate, setVehicleInDate] = useState('');
  const [vehicleInHour, setVehicleInHour] = useState('10');
  const [vehicleInMinute, setVehicleInMinute] = useState('00');
  const [vehicleInAmPm, setVehicleInAmPm] = useState('AM');
  const [vehicleOutDate, setVehicleOutDate] = useState('');
  const [vehicleOutHour, setVehicleOutHour] = useState('05');
  const [vehicleOutMinute, setVehicleOutMinute] = useState('00');
  const [vehicleOutAmPm, setVehicleOutAmPm] = useState('PM');

  const invoiceRef = useRef();

  // Add new service row
  const handleAddRow = () => {
    setRows([...rows, { service: '', cost: '' }]);
  };

  // Update service details
  const handleChange = (index, key, value) => {
    const updated = [...rows];
    updated[index][key] = value;
    setRows(updated);
  };

  // Calculate total
  const totalAmount = rows.reduce((acc, row) => acc + Number(row.cost || 0), 0);

  // Generate PDF from template
  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('RoyalMotors_Invoice.pdf');
  };

  return (
    <section className='invoice-wrapper'>
      {/* --- Control Buttons --- */}
      <div className='download-btn'>
        <button onClick={handleAddRow}>+ Add Service</button>
        <button onClick={downloadPDF}>📥 Download Invoice</button>
      </div>

      {/* --- Input Form --- */}
      <div className='form-section'>
        <h2>Invoice Form</h2>

        <div className='form-group'>
          <label>Customer Name:</label>
          <input
            type='text'
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label>Vehicle Number:</label>
          <input
            type='text'
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label>Vehicle Model:</label>
          <select
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
          >
            <option value=''>Select model</option>
            <option>Hunter 360</option>
            <option>Classic 650</option>
            <option>Goan Classic 350</option>
            <option>Scram 440</option>
            <option>Bear 650</option>
            <option>Classic 350</option>
            <option>Guerrilla 450</option>
            <option>Shotgun 650</option>
            <option>Himalayan 450</option>
            <option>Bullet 350</option>
            <option>Super Meteor 650</option>
            <option>Meteor 350</option>
            <option>Interceptor 650</option>
            <option>Continental GT 650</option>
          </select>
        </div>

        {/* Vehicle In */}
        <div className='form-group'>
          <label>Vehicle In:</label>
          <input
            type='date'
            value={vehicleInDate}
            onChange={(e) => setVehicleInDate(e.target.value)}
          />
          <select
            value={vehicleInHour}
            onChange={(e) => setVehicleInHour(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
          :
          <select
            value={vehicleInMinute}
            onChange={(e) => setVehicleInMinute(e.target.value)}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i}>{String(i).padStart(2, '0')}</option>
            ))}
          </select>
          <select
            value={vehicleInAmPm}
            onChange={(e) => setVehicleInAmPm(e.target.value)}
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>

        {/* Vehicle Out */}
        <div className='form-group'>
          <label>Vehicle Out:</label>
          <input
            type='date'
            value={vehicleOutDate}
            onChange={(e) => setVehicleOutDate(e.target.value)}
          />
          <select
            value={vehicleOutHour}
            onChange={(e) => setVehicleOutHour(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1}>{String(i + 1).padStart(2, '0')}</option>
            ))}
          </select>
          :
          <select
            value={vehicleOutMinute}
            onChange={(e) => setVehicleOutMinute(e.target.value)}
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i}>{String(i).padStart(2, '0')}</option>
            ))}
          </select>
          <select
            value={vehicleOutAmPm}
            onChange={(e) => setVehicleOutAmPm(e.target.value)}
          >
            <option>AM</option>
            <option>PM</option>
          </select>
        </div>

        {/* Services Input */}
        <h3>Services</h3>
        {rows.map((row, index) => (
          <div key={index} className='form-group'>
            <input
              type='text'
              placeholder='Service Name'
              value={row.service}
              onChange={(e) => handleChange(index, 'service', e.target.value)}
            />
            <input
              type='number'
              placeholder='Cost ₹'
              value={row.cost}
              onChange={(e) => handleChange(index, 'cost', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* --- Hidden Invoice Template --- */}
      <div className='invoice-preview' ref={invoiceRef}>
        <div className='header'>
          <img src={logo} alt='Royal Motors Logo' />
          <div className='company-details'>
            <h2>Royal Motors Service Point</h2>
            <p>Porwal Road, Dhanori, Pune, Maharashtra</p>
            <p>Next to Revel Orchid, Opp. Park Spring Society</p>
            <p>Phone / WhatsApp: +91 97678 52720 / +91 9422024560</p>
          </div>
        </div>
        <div className='bottom'>
          <div className='left'>
            <h3>Customer Details</h3>
            <p>
              <b>Name:</b> {customerName}
            </p>
            <p>
              <b>Vehicle Number:</b> {vehicleNumber}
            </p>
          </div>
          <div className='right'>
            <h3>Vehicle Details</h3>
            <p>
              <b>Model:</b> {vehicleModel}
            </p>
            <p>
              <b>In:</b> {vehicleInDate} {vehicleInHour}:{vehicleInMinute}{' '}
              {vehicleInAmPm}
            </p>
            <p>
              <b>Out:</b> {vehicleOutDate} {vehicleOutHour}:{vehicleOutMinute}{' '}
              {vehicleOutAmPm}
            </p>
          </div>
        </div>

        <h3>Services</h3>
        <table>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Service</th>
              <th>Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{row.service}</td>
                <td>₹ {row.cost}</td>
              </tr>
            ))}
            <tr>
              <td colSpan='2'>
                <b>Total</b>
              </td>
              <td>
                <b>₹ {totalAmount.toFixed(2)}</b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Invoice;
