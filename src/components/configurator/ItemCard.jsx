export default function ItemCard({
  item,
  index = 0,
  locale = "fr",
  selected = false,
  onToggle,
  formatPrice,
  selectedLabel = "Selected",
  addLabel = "Add",
  removeLabel = "Remove",
}) {
  const previewVariant = getPreviewVariant(item);
  const categoryLabel = item.type || item.category;

  return (
    <button
      type="button"
      className={`configurator-card ${selected ? "is-selected" : ""}`}
      onClick={() => onToggle(item.id)}
      aria-pressed={selected}
      style={{ "--card-delay": `${index * 45}ms` }}
    >
      <div className="configurator-card-top">
        <span className="configurator-card-category">{categoryLabel}</span>
        <span className={`configurator-card-check ${selected ? "is-visible" : ""}`}>
          <span className="configurator-card-check-icon" aria-hidden="true">
            +
          </span>
          <span>{selected ? selectedLabel : ""}</span>
        </span>
      </div>

      <div className={`configurator-card-preview is-${previewVariant}`}>
        <div className="configurator-card-preview-frame">
          <div className="configurator-card-preview-surface">
            <div className="configurator-card-preview-screen">
              <div className="configurator-card-preview-ui is-top" />
              <div className="configurator-card-preview-ui is-main" />
              <div className="configurator-card-preview-ui is-side" />
              <div className="configurator-card-preview-glow" />
            </div>
          </div>
          <div className="configurator-card-preview-shelf" />
        </div>
      </div>

      <div className="configurator-card-body">
        <h3 className="configurator-card-title">{item.name}</h3>
        <p className="configurator-card-description">{item.description}</p>
      </div>

      <div className="configurator-card-footer">
        <div className="configurator-card-price-stack">
          <span className="configurator-card-price-label">Estimate</span>
          <span className="configurator-card-price">
            {formatPrice(item.price, locale)}
          </span>
        </div>
        <span className="configurator-card-action">
          {selected ? removeLabel : addLabel}
        </span>
      </div>
    </button>
  );
}

function getPreviewVariant(item) {
  if (item.id.includes("3d")) return "orbital";
  if (item.id.includes("payment")) return "checkout";
  if (item.id.includes("booking")) return "calendar";
  if (item.id.includes("user-accounts")) return "account";
  if (item.id.includes("multilanguage")) return "translation";
  if (item.id.includes("cms")) return "dashboard";
  if (item.id.includes("portfolio")) return "gallery";
  if (item.id.includes("contact")) return "contact";
  if (item.id.includes("about")) return "story";
  if (item.id.includes("philosophy")) return "manifesto";
  if (item.id.includes("animation")) return "motion";
  if (item.id.includes("micro")) return "micro";
  return item.type === "page" ? "page" : "feature";
}
