import { useEffect, useMemo, useState } from "react";
import { items } from "../../data/configuratorItems";
import { formatCopy, getCopy } from "../../i18n/copy";
import ItemGrid from "./ItemGrid";
import SearchBar from "./SearchBar";
import SummaryPanel from "./SummaryPanel";
import Tabs from "./Tabs";
import "./configurator.css";

function formatPrice(value, locale) {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function Configurator({ locale = "fr", embedded = false }) {
  const copy = getCopy(locale);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const categories = useMemo(
    () => ["all", ...new Set(items.map((item) => item.category))],
    [],
  );

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        `${item.name} ${item.description}`
          .toLowerCase()
          .includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const selectedCatalogItems = useMemo(
    () => items.filter((item) => selectedItems.includes(item.id)),
    [selectedItems],
  );

  const totalPrice = useMemo(
    () =>
      selectedCatalogItems.reduce((total, item) => total + item.price, 0),
    [selectedCatalogItems],
  );

  const formattedTotalPrice = useMemo(
    () => formatPrice(totalPrice, locale),
    [locale, totalPrice],
  );

  useEffect(() => {
    setIsSummaryOpen(false);
  }, [activeCategory, searchTerm]);

  const handleToggleItem = (itemId) => {
    setSelectedItems((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  const categoryTabs = categories.map((category) => ({
    value: category,
    label:
      category === "all"
        ? copy.configurator.allCategories
        : copy.configurator.categories?.[category] ?? category,
  }));

  const mobileBarLabel = embedded
    ? copy.configurator.totalLabel
    : copy.configurator.mobileSummaryButton;

  const mobileBar = (
    <button
      type="button"
      className={`configurator-mobile-bar ${embedded ? "is-readonly" : ""}`}
      onClick={() => {
        if (!embedded) {
          setIsSummaryOpen(true);
        }
      }}
      aria-label={mobileBarLabel}
      disabled={embedded}
      aria-disabled={embedded}
    >
      <span className="configurator-mobile-bar-label">{mobileBarLabel}</span>
      <span className="configurator-mobile-bar-total">{formattedTotalPrice}</span>
    </button>
  );

  return (
    <section className={`configurator-shell ${embedded ? "is-embedded" : ""}`}>
      {embedded ? mobileBar : null}

      <div className="configurator-surface">
        <header className="configurator-header configurator-reveal configurator-reveal-1">
          <p className="configurator-eyebrow">{copy.configurator.eyebrow}</p>
          <h1 className="configurator-title">{copy.configurator.title}</h1>
          <p className="configurator-subtitle">{copy.configurator.subtitle}</p>
        </header>

        <div className="configurator-toolbar configurator-reveal configurator-reveal-2">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={copy.configurator.searchPlaceholder}
          />
          <Tabs
            tabs={categoryTabs}
            value={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <div className="configurator-layout configurator-reveal configurator-reveal-3">
          <div className="configurator-catalog">
            <div className="configurator-meta-row">
              <span className="configurator-meta-pill">
                {formatCopy(copy.configurator.resultsLabel, {
                  count: filteredItems.length,
                })}
              </span>
              <span className="configurator-meta-pill">
                {formatCopy(copy.configurator.selectedCount, {
                  count: selectedCatalogItems.length,
                })}
              </span>
            </div>

            <ItemGrid
              items={filteredItems}
              locale={locale}
              selectedItems={selectedItems}
              onToggleItem={handleToggleItem}
              emptyMessage={copy.configurator.emptyResults}
              formatPrice={formatPrice}
            />
          </div>

          <SummaryPanel
            locale={locale}
            selectedItems={selectedCatalogItems}
            totalPrice={formattedTotalPrice}
            totalRaw={totalPrice}
            title={copy.configurator.summaryTitle}
            subtitle={copy.configurator.summarySubtitle}
            totalLabel={copy.configurator.totalLabel}
            emptyMessage={copy.configurator.summaryEmpty}
            includedLabel={copy.configurator.includedLabel}
          />
        </div>
      </div>

      {!embedded ? mobileBar : null}

      <SummaryPanel
        locale={locale}
        selectedItems={selectedCatalogItems}
        totalPrice={formattedTotalPrice}
        totalRaw={totalPrice}
        title={copy.configurator.summaryTitle}
        subtitle={copy.configurator.summarySubtitle}
        totalLabel={copy.configurator.totalLabel}
        emptyMessage={copy.configurator.summaryEmpty}
        includedLabel={copy.configurator.includedLabel}
        mobile
        open={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />
    </section>
  );
}
