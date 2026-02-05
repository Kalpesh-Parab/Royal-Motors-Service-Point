import { useMemo, useState } from 'react';

export default function QuickServicePicker({
  availableCategories,
  categories,
  setCategories,
}) {
  const [query, setQuery] = useState('');

  // 🔍 Build searchable list
  const allServices = useMemo(() => {
    return availableCategories.flatMap((cat) =>
      cat.services.map((service) => ({
        service,
        categoryId: cat._id,
        categoryName: cat.categoryName,
      })),
    );
  }, [availableCategories]);

  const results = query
    ? allServices.filter((s) =>
        s.service.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const toggleService = (item) => {
    setCategories((prev) => {
      const existingCategory = prev.find(
        (c) => c.categoryId === item.categoryId,
      );

      if (existingCategory) {
        const exists = existingCategory.services.find(
          (s) => s.name === item.service,
        );

        return prev.map((c) =>
          c.categoryId === item.categoryId
            ? {
                ...c,
                services: exists
                  ? c.services.filter((s) => s.name !== item.service)
                  : [...c.services, { name: item.service, price: 0 }],
              }
            : c,
        );
      }

      // ➕ New category
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          pricingMode: 'SERVICE',
          services: [{ name: item.service, price: 0 }],
          categoryPrice: 0,
        },
      ];
    });
  };

  const isChecked = (item) =>
    categories.some(
      (c) =>
        c.categoryId === item.categoryId &&
        c.services.some((s) => s.name === item.service),
    );

  return (
    <div className='quick-service-picker'>
      <input
        type='text'
        placeholder='Quick add service (e.g. Oil)'
        value={query}
        style={{
          backgroundColor: '#000',
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #ccc',
        }}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query && (
        <div
          className='quick-results'
          style={{
            backgroundColor: '#000',
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          {results.length === 0 && (
            <div className='no-results'>No services found</div>
          )}

          {results.map((item) => (
            <label key={`${item.categoryId}-${item.service}`}>
              <input
                style={{ margin: '5px 8px', width: '18px', height: '18px' }}
                type='checkbox'
                checked={isChecked(item)}
                onChange={() => toggleService(item)}
              />
              <span>
                {item.service}
                <small> ({item.categoryName})</small>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
