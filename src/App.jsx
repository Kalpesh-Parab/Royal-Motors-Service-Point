import './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Header from './components/header/Header';
import About from './pages/about/About';
import Home from './pages/home/Home';
import Services from './pages/services/Services';
import Contact from './pages/contact/Contact';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/footer/Footer';
import ScrollToTop from './components/scrolltoTop/ScrollToTop';
import InvoiceGenerator from './pages/invoice/Invoice';
import Admin from './pages/admin/Admin';
import InvoicePrintPage from './pages/admin/invoice/InvoicePrintPage';

function AppLayout() {
  const location = useLocation();

  // Check if current route is /invoice
  const isPrintPage = location.pathname.includes('/print');

  const hideLayout =
    location.pathname === '/invoice' || location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!hideLayout && <Header />}

      <div className={`app-content ${isPrintPage ? 'print-mode' : ''}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/invoice' element={<InvoiceGenerator />} />
          <Route path='/admin' element={<Admin />} />
          <Route
            path='/admin/invoices/:id/print'
            element={<InvoicePrintPage />}
          />
        </Routes>
        <ToastContainer position='top-right' />
      </div>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
