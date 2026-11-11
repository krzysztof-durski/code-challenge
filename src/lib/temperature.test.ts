import { roundTemperature } from './temperature';

describe('roundTemperature', () => {
  it.each([
    [16.6, 17],
    [-3.4, -3],
    [0.4, 0],
  ])('rounds %s to %s', (input, expected) => {
    expect(roundTemperature(input)).toBe(expected);
  });

  it('never returns -0 for a mild negative temperature', () => {
    expect(Object.is(roundTemperature(-0.3), 0)).toBe(true);
  });
});
