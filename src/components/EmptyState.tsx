const EXAMPLES = ["Berlin", "Tokyo", "Poznan"];

interface Props {
  onPick: (city: string) => void;
}

export function EmptyState({ onPick }: Props) {
  return (
    <section className="panel empty" aria-labelledby="empty-title">
      <h2 id="empty-title" className="panel-title">
        No city yet
      </h2>
      <p>
        Type a city above to see its weather, its local time and when the sun
        rises and sets.
      </p>
      <ul className="examples" aria-label="Example cities">
        {EXAMPLES.map((city) => (
          <li key={city}>
            <button
              type="button"
              className="button button-quiet"
              onClick={() => onPick(city)}
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
