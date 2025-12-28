import { useEffect, useState } from 'react';
import './servicesPanel.scss';
import API from './adminApi';
import { toast } from 'react-toastify';

export default function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newService, setNewService] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const [newCategory, setNewCategory] = useState('');

  const fetchServices = async () => {
    try {
      const res = await API.get('/api/services');
      setServices(res.data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await API.post('/api/services', {
        categoryName: newCategory,
        services: [],
      });

      toast.success('Category added');
      setNewCategory('');
      fetchServices();
    } catch {
      toast.error('Failed to add category');
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category and all services?')) return;

    try {
      await API.delete(`/api/services/${categoryId}`);
      toast.success('Category deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const addService = async (categoryId) => {
    if (!newService.trim()) return;

    try {
      await API.patch(`/api/services/${categoryId}/add`, {
        service: newService,
      });

      toast.success('Service added');
      setNewService('');
      setActiveCategory(null);
      fetchServices();
    } catch {
      toast.error('Failed to add service');
    }
  };

  const deleteService = async (categoryId, service) => {
    try {
      await API.patch(`/api/services/${categoryId}/delete`, {
        service,
      });

      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete service');
    }
  };

  if (loading)
    return <div className='services-loading'>Loading services...</div>;

  return (
    <div className='services-panel'>
      {/* ADD CATEGORY */}
      <div className='add-category'>
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder='New category name'
        />
        <button onClick={addCategory}>+ Add Category</button>
      </div>
      <div className='categories'>
        {services.map((category) => (
          <div className='category-card' key={category._id}>
            <div className='category-header'>
              <h3>{category.categoryName}</h3>

              <div className='category-actions'>
                <button onClick={() => setActiveCategory(category._id)}>
                  + Service
                </button>

                <span
                  className='delete-category'
                  onClick={() => deleteCategory(category._id)}
                >
                  ✕
                </span>
              </div>
            </div>

            <ul className='service-list'>
              {category.services.map((service, index) => (
                <li key={index}>
                  {service}
                  <span
                    className='delete'
                    onClick={() => deleteService(category._id, service)}
                  >
                    ✕
                  </span>
                </li>
              ))}
            </ul>

            {activeCategory === category._id && (
              <div className='add-service'>
                <input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  placeholder='New service name'
                />
                <button onClick={() => addService(category._id)}>Add</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
