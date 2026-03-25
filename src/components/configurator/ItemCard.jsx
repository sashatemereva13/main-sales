import {
  getItemPreviewArtwork,
  getPreviewVariant,
} from "./itemPreviewArtwork";

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
  const previewArtwork = getItemPreviewArtwork(item, previewVariant);
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
              <img
                className="configurator-card-preview-image"
                src={previewArtwork.src}
                alt={previewArtwork.alt}
                loading="lazy"
                decoding="async"
              />
              <div
                className="configurator-card-preview-image-sheen"
                aria-hidden="true"
              />
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
