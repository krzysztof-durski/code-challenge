import { describeWeather } from "../lib/weatherCodes";
import type { ErrorKind, Place, Snapshot } from "../types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export class ApiError extends Error {
  constructor(
    readonly kind: Exclude<ErrorKind, "empty-input" | "unknown">,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Fetches a url and returns the parsed JSON, or throws an ApiError
async function getJson(url: string, signal?: AbortSignal) {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    // if the request was cancelled on purpose, just pass the error on
    if (signal?.aborted) throw error;
    throw new ApiError("network", "Request failed");
  }

  if (!response.ok) {
    throw new ApiError("http", "HTTP " + response.status);
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError("malformed", "Response is not JSON");
  }

  if (typeof body !== "object" || body === null) {
    throw new ApiError("malformed", "Response is not an object");
  }
  // Open-Meteo sometimes answers with { error: true, reason: "..." }
  if (body.error === true) {
    throw new ApiError("http", body.reason || "API error");
  }
  return body;
}

/** Resolve a typed city name to coordinates. Takes the top-ranked match. */
export async function geocodeCity(
  name: string,
  signal?: AbortSignal,
): Promise<Place> {
  const searchParameters = new URLSearchParams({
    name,
    count: "1",
    language: "en",
    format: "json",
  });
  const body = await getJson(`${GEOCODING_URL}?${searchParameters}`, signal);

  // when nothing matches, the API returns 200 without a "results" key
  if (!body.results) {
    throw new ApiError("not-found", `No city named "${name}"`);
  }

  const first = body.results[0];
  if (
    !first ||
    typeof first.name !== "string" ||
    typeof first.latitude !== "number" ||
    typeof first.longitude !== "number"
  ) {
    throw new ApiError("malformed", "Bad geocoding result");
  }

  return {
    name: first.name,
    region: first.admin1 || null,
    country: first.country || null,
    latitude: first.latitude,
    longitude: first.longitude,
  };
}

export interface Forecast {
  temperatureC: number;
  condition: string;
  timezone: string;
  sunrise: string | null;
  sunset: string | null;
}

/** Current conditions plus today's sunrise and sunset, in the place's own timezone. */
export async function fetchForecast(
  place: Place,
  signal?: AbortSignal,
): Promise<Forecast> {
  const searchParameters = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    current: "temperature_2m,weather_code,is_day",
    daily: "sunrise,sunset",
    timezone: "auto",
    forecast_days: "1",
  });
  const body = await getJson(`${FORECAST_URL}?${searchParameters}`, signal);

  const current = body.current;
  if (
    typeof body.timezone !== "string" ||
    !current ||
    typeof current.temperature_2m !== "number" ||
    typeof current.weather_code !== "number" ||
    typeof current.is_day !== "number"
  ) {
    throw new ApiError("malformed", "Bad forecast response");
  }

  return {
    temperatureC: current.temperature_2m,
    condition: describeWeather(current.weather_code, current.is_day === 1),
    timezone: body.timezone,
    sunrise: body.daily?.sunrise?.[0] || null,
    sunset: body.daily?.sunset?.[0] || null,
  };
}

export async function getSnapshot(
  city: string,
  signal?: AbortSignal,
): Promise<Snapshot> {
  const place = await geocodeCity(city, signal);
  const forecast = await fetchForecast(place, signal);
  return {
    city: place.name,
    region: place.region,
    country: place.country,
    ...forecast,
  };
}
