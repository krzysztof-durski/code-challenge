import { formatClock, formatDate, formatSunTime } from './time';

// 2026-11-11 11:15 UTC
const NOW = new Date('2026-11-11T11:15:00Z');

describe('formatClock', () => {
  it.each([
    ['Europe/Lisbon', '11:15'],
    ['Asia/Tokyo', '20:15'],
    ['Asia/Kolkata', '16:45'], // half-hour offset
    ['America/New_York', '06:15'],
  ])('renders %s as %s', (zone, expected) => {
    expect(formatClock(NOW, zone)).toBe(expected);
  });

  it('uses 00:xx, not 24:xx, just after midnight', () => {
    expect(formatClock(new Date('2026-11-11T00:05:00Z'), 'UTC')).toBe('00:05');
  });
});

describe('formatDate', () => {
  it('formats weekday, day and month in the city zone', () => {
    expect(formatDate(NOW, 'Europe/Lisbon')).toBe('Wed 11 Nov');
  });

  it('rolls the date over for zones already past midnight', () => {
    expect(formatDate(new Date('2026-11-11T20:00:00Z'), 'Pacific/Auckland')).toBe('Thu 12 Nov');
  });
});

describe('formatSunTime', () => {
  it('slices the local wall-clock time without any timezone conversion', () => {
    expect(formatSunTime('2026-11-11T07:14')).toBe('07:14');
    expect(formatSunTime('2026-11-11T17:26')).toBe('17:26');
  });

  it('returns null when the value is missing', () => {
    expect(formatSunTime(null)).toBeNull();
  });

  it('returns null when the value is not a local ISO string', () => {
    expect(formatSunTime('sunrise')).toBeNull();
  });
});
