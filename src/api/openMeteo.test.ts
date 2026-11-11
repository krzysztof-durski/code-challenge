import { forecastBody, json, stubApi } from '../test/fixtures';
import { ApiError, fetchForecast, geocodeCity, getSnapshot } from './openMeteo';

const place = { name: 'Lisbon', region: null, country: null, latitude: 38.7, longitude: -9.1 };

async function kindOf(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (err) {
    expect(err).toBeInstanceOf(ApiError);
    return (err as ApiError).kind;
  }
  throw new Error('expected a rejection');
}

describe('geocodeCity', () => {
  it('requests the top match, encodes the query and returns a place', async () => {
    const fetchMock = stubApi();
    const result = await geocodeCity('São Paulo & co');

    expect(result).toMatchObject({ name: 'Lisbon', region: 'Lisbon District', country: 'Portugal' });
    const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(url.searchParams.get('name')).toBe('São Paulo & co');
    expect(url.searchParams.get('count')).toBe('1');
  });

  it('reports not-found when there is no `results` key', async () => {
    stubApi({ geocode: json({ generationtime_ms: 0.1 }) });
    expect(await kindOf(geocodeCity('zzzz'))).toBe('not-found');
  });
});

describe('request failures', () => {
  it('reports network when fetch rejects', async () => {
    stubApi({ geocode: () => Promise.reject(new TypeError('Failed to fetch')) });
    expect(await kindOf(geocodeCity('Lisbon'))).toBe('network');
  });

  it('reports http for a non-2xx status', async () => {
    stubApi({ geocode: json({}, 503) });
    expect(await kindOf(geocodeCity('Lisbon'))).toBe('http');
  });

  it('reports malformed when the body is not JSON', async () => {
    stubApi({ geocode: new Response('<html>', { status: 200 }) });
    expect(await kindOf(geocodeCity('Lisbon'))).toBe('malformed');
  });
});

describe('fetchForecast', () => {
  it('maps the response', async () => {
    stubApi();
    await expect(fetchForecast(place)).resolves.toEqual({
      temperatureC: 16.6,
      condition: 'Rain',
      timezone: 'Europe/Lisbon',
      sunrise: '2026-11-11T07:14',
      sunset: '2026-11-11T17:26',
    });
  });

  it('returns null sun times when the sun does not rise or set (polar day or night)', async () => {
    stubApi({
      forecast: json(forecastBody({ daily: { time: ['2026-06-21'], sunrise: [null], sunset: [] } })),
    });
    await expect(fetchForecast(place)).resolves.toMatchObject({ sunrise: null, sunset: null });
  });
});

describe('getSnapshot', () => {
  it('chains geocoding and forecast into one snapshot', async () => {
    const fetchMock = stubApi();
    await expect(getSnapshot('Lisbon')).resolves.toMatchObject({ city: 'Lisbon', temperatureC: 16.6 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not call the forecast when the city is not found', async () => {
    const fetchMock = stubApi({ geocode: json({}) });
    expect(await kindOf(getSnapshot('zzzz'))).toBe('not-found');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
