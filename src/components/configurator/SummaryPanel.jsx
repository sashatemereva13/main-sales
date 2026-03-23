function SummaryContent({
  locale,
  selectedItems,
  totalPrice,
  totalRaw,
  title,
  subtitle,
  totalLabel,
  emptyMessage,
  includedLabel,
}) {
  const itemCount = selectedItems.length;
  const countLabel =
    locale === "fr"
      ? `${itemCount} ${itemCount > 1 ? "modules" : "module"}`
      : `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

  return (
    <>
      <div className="configurator-summary-head">
        <div className="configurator-summary-head-row">
          <p className="configurator-summary-kicker">{includedLabel}</p>
          <span className="configurator-summary-count">{countLabel}</span>
        </div>
        <h2 className="configurator-summary-title">{title}</h2>
        <p className="configurator-summary-subtitle">{subtitle}</p>
      </div>

      <div className="configurator-summary-total">
        <span className="configurator-summary-total-label">{totalLabel}</span>
        <strong
          key={totalRaw}
          className="configurator-summary-total-value"
        >
          {totalPrice}
        </strong>
      </div>

      {selectedItems.length > 0 ? (
        <div className="configurator-summary-list">
          {selectedItems.map((item) => (
            <article key={item.id} className="configurator-summary-item">
              <div>
                <h3 className="configurator-summary-item-title">{item.name}</h3>
                <p className="configurator-summary-item-description">
                  {item.description}
                </p>
              </div>
              <span className="configurator-summary-item-price">
                {new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(item.price)}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="configurator-summary-empty">
          <p>{emptyMessage}</p>
        </div>
      )}
    </>
  );
}

export default function SummaryPanel({
  locale = "fr",
  selectedItems,
  totalPrice,
  totalRaw,
  title,
  subtitle,
  totalLabel,
  emptyMessage,
  includedLabel,
  mobile = false,
  open = false,
  onClose,
}) {
  const panelClassName = [
    "configurator-summary",
    mobile ? "is-mobile" : "is-desktop",
    open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (mobile) {
    return (
      <div
        className={`configurator-summary-overlay ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className="configurator-summary-backdrop"
          onClick={onClose}
          aria-label={locale === "fr" ? "Fermer le résumé" : "Close summary"}
        />
        <aside className={panelClassName}>
          <div className="configurator-summary-mobile-top">
            <span className="configurator-summary-mobile-handle" />
            <button
              type="button"
              className="configurator-summary-close"
              onClick={onClose}
            >
              {locale === "fr" ? "Fermer" : "Close"}
            </button>
          </div>
          <SummaryContent
            locale={locale}
            selectedItems={selectedItems}
            totalPrice={totalPrice}
            totalRaw={totalRaw}
            title={title}
            subtitle={subtitle}
            totalLabel={totalLabel}
            emptyMessage={emptyMessage}
            includedLabel={includedLabel}
          />
        </aside>
      </div>
    );
  }

  return (
    <aside className={panelClassName}>
      <SummaryContent
        locale={locale}
        selectedItems={selectedItems}
        totalPrice={totalPrice}
        totalRaw={totalRaw}
        title={title}
        subtitle={subtitle}
        totalLabel={totalLabel}
        emptyMessage={emptyMessage}
        includedLabel={includedLabel}
      />
    </aside>
  );
}
