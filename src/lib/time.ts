// gets one piece (like "weekday") out of the formatted parts
function getPart(parts: Intl.DateTimeFormatPart[], type: string) {
  const found = parts.find((part) => part.type === type);
  return found ? found.value : "";
}

// Time in the city's timezone, like "11:15"
export function formatClock(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
}

// Date in the city's timezone, like "Wed 11 Nov"
export function formatDate(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(now);

  const weekday = getPart(parts, "weekday");
  const day = getPart(parts, "day");
  const month = getPart(parts, "month");
  return weekday + " " + day + " " + month;
}

// Sunrise/sunset already come in the city's local time (e.g. "2026-11-11T07:14"),
// so we only cut out the "07:14" part. Using new Date() here would shift the time
// to the browser's timezone.
export function formatSunTime(isoString: string | null) {
  if (!isoString) return null;
  const match = isoString.match(/^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/);
  if (!match) return null;
  return match[1];
}
