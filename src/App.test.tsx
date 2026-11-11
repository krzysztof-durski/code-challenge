import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { forecastBody, geocodeBody, json, stubApi } from './test/fixtures';

const searchBox = () => screen.getByRole('textbox', { name: 'City' });

describe('empty state', () => {
  it('shows guidance and example cities before any search', () => {
    stubApi();
    render(<App />);
    expect(screen.getByRole('heading', { name: 'No city yet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Berlin' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tokyo' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Poznan' })).toBeInTheDocument();
  });
});

describe('loading state', () => {
  it('shows a skeleton and disables the button while fetching', async () => {
    let release!: () => void;
    stubApi({ forecast: new Promise((r) => (release = () => r(json(forecastBody())))) });
    render(<App />);

    await userEvent.type(searchBox(), 'Lisbon{Enter}');
    const status = await screen.findByRole('status');
    expect(within(status).getByText('Loading weather for Lisbon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Searching' })).toBeDisabled();

    release();
    expect(await screen.findByRole('article')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('success state', () => {
  it('shows city, temperature, condition, local time and sun times', async () => {
    stubApi();
    render(<App />);
    await userEvent.type(searchBox(), 'Lisbon{Enter}');

    const card = await screen.findByRole('article', { name: 'Weather in Lisbon' });
    expect(within(card).getByText('Lisbon District, Portugal')).toBeInTheDocument();
    expect(within(card).getByText('17')).toBeInTheDocument(); // 16.6 rounded
    expect(within(card).getByText('Rain')).toBeInTheDocument();
    expect(within(card).getByText('07:14')).toBeInTheDocument();
    expect(within(card).getByText('17:26')).toBeInTheDocument();
  });

  it('shows the local time of the searched city, not the browser', async () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] });
    vi.setSystemTime(new Date('2026-11-11T11:15:00Z'));
    stubApi({
      geocode: json(geocodeBody({ name: 'Tokyo', country: 'Japan', admin1: 'Tokyo' })),
      forecast: json(forecastBody({ timezone: 'Asia/Tokyo' })),
    });
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: 'Tokyo' }), { delay: null });

    const card = await screen.findByRole('article', { name: 'Weather in Tokyo' });
    expect(within(card).getByText('20:15')).toBeInTheDocument();
  });
});

describe('error state', () => {
  it('explains an unknown city and keeps the text in the box', async () => {
    stubApi({ geocode: json({ generationtime_ms: 0.1 }) });
    render(<App />);
    await userEvent.type(searchBox(), 'zzzzqqq{Enter}');

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('No city found for "zzzzqqq"')).toBeInTheDocument();
    expect(searchBox()).toHaveValue('zzzzqqq');
  });

  it('shows a network failure and retries the same query', async () => {
    stubApi({ geocode: () => Promise.reject(new TypeError('offline')) });
    render(<App />);
    await userEvent.type(searchBox(), 'Lisbon{Enter}');

    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText('Could not reach the weather service')).toBeInTheDocument();

    stubApi(); // service recovers
    await userEvent.click(within(alert).getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Lisbon' })).toBeInTheDocument();
  });
});

describe('shared link', () => {
  it('searches on load when the URL has ?city=', async () => {
    window.history.replaceState(null, '', '/?city=Lisbon');
    stubApi();
    render(<App />);

    expect(searchBox()).toHaveValue('Lisbon');
    expect(await screen.findByRole('heading', { name: 'Lisbon' })).toBeInTheDocument();
  });
});
