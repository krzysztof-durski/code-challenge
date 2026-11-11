import { useNow } from '../hooks/useNow';
import { roundTemperature } from '../lib/temperature';
import { formatClock, formatDate, formatSunTime } from '../lib/time';
import type { Snapshot } from '../types';

interface Props {
  snapshot: Snapshot;
}

export function SnapshotCard({ snapshot }: Props) {
  const now = useNow();
  const { city, region, country, temperatureC, condition, timezone, sunrise, sunset } = snapshot;
  const temperature = roundTemperature(temperatureC);
  const where = [region, country].filter(Boolean).join(', ');

  return (
    <article className="sign" aria-label={`Weather in ${city}`}>
      <header className="sign-head">
        <h2 className="sign-city">{city}</h2>
        {where && <p className="sign-where">{where}</p>}
      </header>

      <div className="sign-body">
        <div className="plate">
          <p className="temp figure">
            {temperature}
            <span className="unit">°C</span>
          </p>
          <p className="condition">{condition}</p>
        </div>
        <div className="clock">
          <p className="label">Local time</p>
          <p className="time figure">{formatClock(now, timezone)}</p>
          <p className="date">{formatDate(now, timezone)}</p>
        </div>
      </div>

      <dl className="sun">
        <div className="sun-cell">
          <dt className="label">Sunrise</dt>
          <dd className="figure">{formatSunTime(sunrise) ?? 'No sunrise today'}</dd>
        </div>
        <div className="sun-cell">
          <dt className="label">Sunset</dt>
          <dd className="figure">{formatSunTime(sunset) ?? 'No sunset today'}</dd>
        </div>
      </dl>
    </article>
  );
}
