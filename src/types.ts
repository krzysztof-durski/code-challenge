export type ErrorKind =
  | 'empty-input'
  | 'not-found'
  | 'network'
  | 'http'
  | 'malformed'
  | 'unknown';

export interface Place {
  name: string;
  region: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
}

export interface Snapshot {
  city: string;
  region: string | null;
  country: string | null;
  temperatureC: number;
  condition: string;
  // timezone name like "Europe/Lisbon"
  timezone: string;
  // local time like "2026-11-11T07:14", or null if the sun does not rise/set
  sunrise: string | null;
  sunset: string | null;
}

export type SnapshotState =
  | { status: 'idle' }
  | { status: 'loading'; query: string }
  | { status: 'success'; snapshot: Snapshot }
  | { status: 'error'; kind: ErrorKind; query: string };
