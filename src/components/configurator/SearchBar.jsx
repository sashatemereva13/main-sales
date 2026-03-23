export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <label className="configurator-search">
      <span className="configurator-search-icon" aria-hidden="true">
        Find
      </span>
      <input
        type="search"
        className="configurator-search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}
