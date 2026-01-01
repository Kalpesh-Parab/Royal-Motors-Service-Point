import CategoryRow from "./CategoryRow";

export default function ServiceCategories({
  availableCategories,
  categories,
  setCategories,
}) {
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        categoryId: "",
        categoryName: "",
        pricingMode: "SERVICE",
        services: [],
        categoryPrice: 0,
      },
    ]);
  };

  const removeCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      {categories.map((cat) => (
        <CategoryRow
          key={cat.id}
          cat={cat}
          categories={categories}
          availableCategories={availableCategories}
          setCategories={setCategories}
          removeCategory={removeCategory} // 👈 NEW
        />
      ))}

      <button onClick={addCategory}>+ Add Category</button>
    </div>
  );
}
