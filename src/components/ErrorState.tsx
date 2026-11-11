import type { ErrorKind } from "../types";

interface Props {
  kind: ErrorKind;
  query: string;
  onRetry: () => void;
}

export function ErrorState({ kind, query, onRetry }: Props) {
  let title = "Something went wrong";
  let hint = "Try again in a moment.";

  if (kind === "empty-input") {
    title = "Enter a city name";
    hint = "Type a city above, for example Lisbon.";
  } else if (kind === "not-found") {
    title = `No city found for "${query}"`;
    hint = "Check the spelling, or try a larger city nearby.";
  } else if (kind === "network") {
    title = "Could not reach the weather service";
    hint = "Check your connection and try again.";
  } else if (kind === "http") {
    title = "The weather service had a problem";
    hint = "It returned an error. Try again in a moment.";
  } else if (kind === "malformed") {
    title = "The weather service sent something unexpected";
  }

  // retrying only helps when the problem was not the user's input
  const showRetry = kind !== "empty-input" && kind !== "not-found";

  return (
    <section className="panel error" role="alert">
      <h2 className="panel-title">{title}</h2>
      <p>{hint}</p>
      {showRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}
