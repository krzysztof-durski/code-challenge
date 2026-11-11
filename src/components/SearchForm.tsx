import type { FormEvent } from "react";

interface Props {
  value: string;
  busy: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export function SearchForm({ value, busy, onChange, onSubmit }: Props) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label htmlFor="city" className="search-label">
        City
      </label>
      <div className="search-row">
        <input
          id="city"
          name="city"
          type="text"
          className="search-input"
          value={value}
          placeholder="Try Berlin or Tokyo"
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />
        <button type="submit" className="button" disabled={busy}>
          {busy ? "Searching" : "Search"}
        </button>
      </div>
    </form>
  );
}
