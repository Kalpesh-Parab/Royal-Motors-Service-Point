import ServiceList from './ServiceList';

export default function CategoryRow({
  cat,
  categories,
  setCategories,
  availableCategories,
}) {
  const updateCategory = (patch) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, ...patch } : c))
    );
  };

  const categoryData = availableCategories.find(
    (c) => c._id === cat.categoryId
  );

  return (
    <div className="category-row">
      <label className="field-label">Service Category</label>

      <select
        className="category-select"
        value={cat.categoryId}
        onChange={(e) => {
          const selected = availableCategories.find(
            (c) => c._id === e.target.value
          );
          updateCategory({
            categoryId: selected._id,
            categoryName: selected.categoryName,
            services: [],
          });
        }}
      >
        <option value="">Select Category</option>
        {availableCategories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.categoryName}
          </option>
        ))}
      </select>

      {categoryData && (
        <>
          <div className="pricing-toggle">
            <label>
              <input
                type="radio"
                checked={cat.pricingMode === 'SERVICE'}
                onChange={() => updateCategory({ pricingMode: 'SERVICE' })}
              />
              Service-wise Pricing
            </label>

            <label>
              <input
                type="radio"
                checked={cat.pricingMode === 'CATEGORY'}
                onChange={() => updateCategory({ pricingMode: 'CATEGORY' })}
              />
              Category-wise Pricing
            </label>
          </div>

          <ServiceList
            cat={cat}
            services={categoryData.services}
            updateCategory={updateCategory}
          />
        </>
      )}
    </div>
  );
}
