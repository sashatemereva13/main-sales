import ItemCard from "./ItemCard";

export default function ItemGrid({
  items,
  locale,
  selectedItems,
  onToggleItem,
  emptyMessage,
  formatPrice,
}) {
  const labels =
    locale === "fr"
      ? { selected: "Sélectionné", add: "Ajouter", remove: "Retirer" }
      : { selected: "Selected", add: "Add", remove: "Remove" };

  if (items.length === 0) {
    return (
      <div className="configurator-empty-state">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="configurator-grid">
      {items.map((item, index) => (
        <ItemCard
          key={item.id}
          item={item}
          index={index}
          locale={locale}
          selected={selectedItems.includes(item.id)}
          onToggle={onToggleItem}
          formatPrice={formatPrice}
          selectedLabel={labels.selected}
          addLabel={labels.add}
          removeLabel={labels.remove}
        />
      ))}
    </div>
  );
}
