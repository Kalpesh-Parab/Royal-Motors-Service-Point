import { toast } from 'react-toastify';
import ServiceList from './ServiceList';

export default function CategoryRow({
  cat,
  categories,
  setCategories,
  availableCategories,
  removeCategory,
}) {
  const updateCategory = (patch) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, ...patch } : c))
    );
  };

  const selectedCategoryIds = categories
    .filter((c) => c.id !== cat.id)
    .map((c) => c.categoryId);

  const categoryData = availableCategories.find(
    (c) => c._id === cat.categoryId
  );

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;

    if (selectedCategoryIds.includes(selectedId)) {
      toast.warning('Category already selected. Please choose another.');
      return;
    }

    const selected = availableCategories.find((c) => c._id === selectedId);

    updateCategory({
      categoryId: selected._id,
      categoryName: selected.categoryName,
      services: [],
      pricingMode: 'SERVICE',
      categoryPrice: 0,
    });
  };

  return (
    <div className='category-row'>
      <div className='row-header'>
        <label className='field-label'>Service Category</label>

        {/* ❌ REMOVE CATEGORY */}
        <button
          type='button'
          className='remove-category'
          onClick={() => removeCategory(cat.id)}
        >
          ✕ Remove
        </button>
      </div>

      <select
        className='category-select'
        value={cat.categoryId}
        onChange={handleCategoryChange}
      >
        <option value=''>Select Category</option>

        {availableCategories.map((c) => {
          const disabled = selectedCategoryIds.includes(c._id);

          return (
            <option key={c._id} value={c._id} disabled={disabled}>
              {c.categoryName}
              {disabled ? ' (Already selected)' : ''}
            </option>
          );
        })}
      </select>

      {categoryData && (
        <>
          <div className='pricing-toggle'>
            <label>
              <input
                type='radio'
                checked={cat.pricingMode === 'SERVICE'}
                onChange={() => updateCategory({ pricingMode: 'SERVICE' })}
              />
              Service-wise Pricing
            </label>

            <label>
              <input
                type='radio'
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
