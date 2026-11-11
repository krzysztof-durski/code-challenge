import type { ErrorKind } from "../types";

interface Props {
  kind: ErrorKind;
  query: string;
  onRetry: () => void;
}

interface Message {
  title: string;
  hint: string;
  // retrying only helps when the problem was not the user's input
  canRetry: boolean;
}

// One entry per ErrorKind. TypeScript fails the build if a kind is missing,
// so adding a new kind to the type forces us to write its message here.
const MESSAGES: Record<ErrorKind, (query: string) => Message> = {
  "empty-input": () => ({
    title: "Enter a city name",
    hint: "Type a city above, for example Lisbon.",
    canRetry: false,
  }),
  "not-found": (query) => ({
    title: `No city found for "${query}"`,
    hint: "Check the spelling, or try a larger city nearby.",
    canRetry: false,
  }),
  network: () => ({
    title: "Could not reach the weather service",
    hint: "Check your connection and try again.",
    canRetry: true,
  }),
  http: () => ({
    title: "The weather service had a problem",
    hint: "It returned an error. Try again in a moment.",
    canRetry: true,
  }),
  malformed: () => ({
    title: "The weather service sent something unexpected",
    hint: "Try again in a moment.",
    canRetry: true,
  }),
  unknown: () => ({
    title: "Something went wrong",
    hint: "Try again in a moment.",
    canRetry: true,
  }),
};

export function ErrorState({ kind, query, onRetry }: Props) {
  const { title, hint, canRetry } = MESSAGES[kind](query);

  return (
    <section className="panel error" role="alert">
      <h2 className="panel-title">{title}</h2>
      <p>{hint}</p>
      {canRetry && (
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </section>
  );
}
