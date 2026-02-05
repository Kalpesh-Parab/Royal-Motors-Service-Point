import { useState } from 'react';

export default function ServiceList({
  cat,
  services,
  updateCategory,
  onAddService,
}) {
  const [newService, setNewService] = useState('');

  const toggleService = (serviceName) => {
    const exists = cat.services.find((s) => s.name === serviceName);

    const updatedServices = exists
      ? cat.services.filter((s) => s.name !== serviceName)
      : [...cat.services, { name: serviceName, price: 0 }];

    updateCategory({ services: updatedServices });
  };

  const updatePrice = (serviceName, price) => {
    updateCategory({
      services: cat.services.map((s) =>
        s.name === serviceName ? { ...s, price } : s,
      ),
    });
  };

  const handleAddService = async (e) => {
    if (e.key !== 'Enter') return;
    if (!newService.trim()) return;

    await onAddService(cat.categoryId, newService.trim());

    // auto-select after adding
    updateCategory({
      services: [...cat.services, { name: newService.trim(), price: 0 }],
    });

    setNewService('');
  };

  return (
    <div className='services-box'>
      {services.map((service) => {
        const selected = cat.services.find((s) => s.name === service);

        return (
          <div key={service} className='service-row'>
            <label>
              <input
                type='checkbox'
                checked={!!selected}
                onChange={() => toggleService(service)}
              />
              <span>{service}</span>
            </label>

            {cat.pricingMode === 'SERVICE' && selected && (
              <input
                type='number'
                placeholder='₹ Price'
                value={selected.price}
                onChange={(e) => updatePrice(service, Number(e.target.value))}
              />
            )}
          </div>
        );
      })}

      {/* ➕ ADD SERVICE INLINE */}
      <input
        type='text'
        className='add-service-input'
        placeholder='Add service & press Enter'
        value={newService}
        onChange={(e) => setNewService(e.target.value)}
        onKeyDown={handleAddService}
      />

      {cat.pricingMode === 'CATEGORY' && (
        <input
          type='number'
          className='category-price'
          placeholder='Category Total ₹'
          value={cat.categoryPrice}
          onChange={(e) =>
            updateCategory({ categoryPrice: Number(e.target.value) })
          }
        />
      )}
    </div>
  );
}
