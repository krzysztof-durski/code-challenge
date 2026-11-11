import { useEffect, useState } from "react";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { SearchForm } from "./components/SearchForm";
import { SnapshotCard } from "./components/SnapshotCard";
import { useCitySnapshot } from "./hooks/useCitySnapshot";
import { readCityParam, writeCityParam } from "./lib/url";

export default function App() {
  const [value, setValue] = useState(readCityParam);
  const { state, search } = useCitySnapshot();

  const run = (city: string) => {
    setValue(city);
    writeCityParam(city.trim());
    void search(city);
  };

  // if the url has ?city=Tokyo, search it when the page loads
  useEffect(() => {
    const city = readCityParam();
    if (city.trim()) void search(city);
  }, [search]);

  return (
    <div className="shell">
      <header className="bar">
        <h1 className="wordmark">City snapshot</h1>
      </header>
      <main>
        <SearchForm
          value={value}
          busy={state.status === "loading"}
          onChange={setValue}
          onSubmit={run}
        />
        <div className="result" aria-live="polite">
          {state.status === "idle" && <EmptyState onPick={run} />}
          {state.status === "loading" && <LoadingState query={state.query} />}
          {state.status === "success" && (
            <SnapshotCard snapshot={state.snapshot} />
          )}
          {state.status === "error" && (
            <ErrorState
              kind={state.kind}
              query={state.query}
              onRetry={() => run(state.query)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
