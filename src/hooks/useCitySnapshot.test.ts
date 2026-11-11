import { act, renderHook } from '@testing-library/react';
import { geocodeBody, json, stubApi } from '../test/fixtures';
import { useCitySnapshot } from './useCitySnapshot';

describe('useCitySnapshot', () => {
  it('goes to an error with the API error kind', async () => {
    stubApi({ geocode: json({}) });
    const { result } = renderHook(() => useCitySnapshot());
    await act(() => result.current.search('zzzz'));
    expect(result.current.state).toEqual({ status: 'error', kind: 'not-found', query: 'zzzz' });
  });

  it('ignores a stale response once a newer search has started', async () => {
    // First search resolves late; second resolves at once.
    let releaseFirst!: () => void;
    let calls = 0;
    stubApi({
      geocode: () => {
        calls += 1;
        if (calls === 1) {
          return new Promise((r) => (releaseFirst = () => r(json(geocodeBody({ name: 'Old' })))));
        }
        return json(geocodeBody({ name: 'New' }));
      },
    });
    const { result } = renderHook(() => useCitySnapshot());

    act(() => void result.current.search('first'));
    await act(() => result.current.search('second'));
    await act(async () => releaseFirst());
    expect(result.current.state).toMatchObject({ status: 'success', snapshot: { city: 'New' } });
  });
});
