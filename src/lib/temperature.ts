// Whole degrees for display. A mild -0.3 rounds to -0 in JS, which would print as "-0", so it becomes 0.
export function roundTemperature(celsius: number): number {
  const rounded = Math.round(celsius);
  return rounded === 0 ? 0 : rounded;
}
