export default function ServiceList({ cat, services, updateCategory }) {
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
        s.name === serviceName ? { ...s, price } : s
      ),
    });
  };

  return (
    <div className="services-box">
      {services.map((service) => {
        const selected = cat.services.find((s) => s.name === service);

        return (
          <div key={service} className="service-row">
            <label>
              <input
                type="checkbox"
                checked={!!selected}
                onChange={() => toggleService(service)}
              />
              <span>{service}</span>
            </label>

            {cat.pricingMode === 'SERVICE' && selected && (
              <input
                type="number"
                placeholder="₹ Price"
                value={selected.price}
                onChange={(e) =>
                  updatePrice(service, Number(e.target.value))
                }
              />
            )}
          </div>
        );
      })}

      {cat.pricingMode === 'CATEGORY' && (
        <input
          type="number"
          className="category-price"
          placeholder="Category Total ₹"
          value={cat.categoryPrice}
          onChange={(e) =>
            updateCategory({ categoryPrice: Number(e.target.value) })
          }
        />
      )}
    </div>
  );
}
