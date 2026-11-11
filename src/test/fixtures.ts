import { vi } from 'vitest';

/** Shapes copied from real Open-Meteo responses (Lisbon, 2026-11-11). */
export const geocodeBody = (overrides: Record<string, unknown> = {}) => ({
  results: [
    {
      id: 2267057,
      name: 'Lisbon',
      latitude: 38.72509,
      longitude: -9.1498,
      country: 'Portugal',
      country_code: 'PT',
      admin1: 'Lisbon District',
      timezone: 'Europe/Lisbon',
      ...overrides,
    },
  ],
});

export const forecastBody = (overrides: Record<string, unknown> = {}) => ({
  latitude: 38.746044,
  longitude: -9.175565,
  utc_offset_seconds: 0,
  timezone: 'Europe/Lisbon',
  current: { time: '2026-11-11T11:15', temperature_2m: 16.6, weather_code: 63, is_day: 1 },
  daily: { time: ['2026-11-11'], sunrise: ['2026-11-11T07:14'], sunset: ['2026-11-11T17:26'] },
  ...overrides,
});

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

type Answer = Response | Promise<Response> | (() => Response | Promise<Response>);

const resolve = (answer: Answer) => (typeof answer === 'function' ? answer() : answer);

/** Stub `fetch`, answering the geocoding and forecast endpoints separately. */
export function stubApi(answers: { geocode?: Answer; forecast?: Answer } = {}) {
  const fetchMock = vi.fn((input: string | URL | Request, _init?: RequestInit) => {
    const url = String(input);
    if (url.includes('geocoding-api')) return resolve(answers.geocode ?? json(geocodeBody()));
    return resolve(answers.forecast ?? json(forecastBody()));
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
