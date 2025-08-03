import { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo.png";
import "./invoice.scss";

const InvoiceGenerator = () => {
  const [rows, setRows] = useState([{ service: "", cost: "" }]);
  const [customerName, setCustomerName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const invoiceRef = useRef();

  const handleAddRow = () => {
    setRows([...rows, { service: "", cost: "" }]);
  };

  const handleChange = (index, key, value) => {
    const updated = [...rows];
    updated[index][key] = value;
    setRows(updated);
  };

  const totalAmount = rows.reduce((acc, row) => acc + Number(row.cost || 0), 0);

  const downloadPDF = async () => {
    const canvas = await html2canvas(invoiceRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("RoyalMotors_Invoice.pdf");
  };

  return (
    <section className="invoice-wrapper">
      <div className="download-btn">
        <button onClick={handleAddRow}>+ Add Service</button>
        <button onClick={downloadPDF}>📥 Download Invoice</button>
      </div>

      <div className="invoice" ref={invoiceRef}>
        <div className="header">
          <img src={logo} alt="Royal Motors Logo" />
          <div className="company-details">
            <h2>Royal Motors Service Point</h2>
            <p>Porwal Road, Dhanori, Pune, Maharashtra</p>
            <p>Next to Revel Orchid, Opp. Park Spring Society</p>
            <p>Phone / WhatsApp: +91 97678 52720 / +91 9422024560</p>
          </div>
        </div>

        {/* 👇 Customer Details */}
        <div className="customer-details">
          <div>
            <label>Customer Name:</label>
            <input
              type="text"
              placeholder="Enter customer's name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <label>Vehicle Number:</label>
            <input
              type="text"
              placeholder="MH12AB1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
          </div>
          <div>
            <label>Vehicle Model:</label>
            <select value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)}>
              <option value="">Select model</option>
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
        </div>

        {/* 👇 Invoice Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Service Name</th>
              <th>Cost (₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={row.service}
                    onChange={(e) => handleChange(index, "service", e.target.value)}
                    placeholder="Enter service"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.cost}
                    onChange={(e) => handleChange(index, "cost", e.target.value)}
                    placeholder="Enter cost"
                  />
                </td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="2">Total Amount</td>
              <td>₹ {totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InvoiceGenerator;
