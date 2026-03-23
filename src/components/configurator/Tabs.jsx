export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="configurator-tabs" role="tablist" aria-label="Categories">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          className={`configurator-tab ${tab.value === value ? "is-active" : ""}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
