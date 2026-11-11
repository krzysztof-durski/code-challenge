// Reads the city from the url, like ?city=Tokyo
export function readCityParam() {
  const searchParameters = new URLSearchParams(window.location.search);
  return searchParameters.get("city") || "";
}

// Puts the city in the url so the link can be shared
export function writeCityParam(city: string) {
  const url = new URL(window.location.href);
  if (city) {
    url.searchParams.set("city", city);
  } else {
    url.searchParams.delete("city");
  }
  window.history.replaceState(null, "", url);
}
