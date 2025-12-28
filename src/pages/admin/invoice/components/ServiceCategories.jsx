
import CategoryRow from './CategoryRow';

export default function ServiceCategories({
  availableCategories,
  categories,
  setCategories,
}) {
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // 🔑 identity
        categoryId: '',
        categoryName: '',
        pricingMode: 'SERVICE',
        services: [],
        categoryPrice: 0,
      },
    ]);
  };

  return (
    <div>
      {categories.map((cat) => (
        <CategoryRow
          key={cat.id}
          cat={cat}
          categories={categories}
          setCategories={setCategories}
          availableCategories={availableCategories}
        />
      ))}

      <button onClick={addCategory}>+ Add Category</button>
    </div>
  );
}
