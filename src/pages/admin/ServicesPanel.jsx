import { useEffect, useState } from "react";
import "./ServicesPanel.scss";
import API from "./adminApi";
import { toast } from "react-toastify";

export default function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await API.get("/api/services");
      setServices(res.data);
    } catch (err) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return <div className="services-loading">Loading services...</div>;
  }

  return (
    <div className="services-panel">
      {services.map((category) => (
        <div className="category-card" key={category._id}>
          <div className="category-header">
            <h3>{category.categoryName}</h3>
          </div>

          <ul className="service-list">
            {category.services.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
