interface Props {
  query: string;
}

// Grey placeholder that looks like the card while loading
export function LoadingState({ query }: Props) {
  return (
    <div className="sign sign-loading" role="status" aria-busy="true">
      <span className="visually-hidden">Loading weather for {query}</span>
      <div className="sign-head" aria-hidden="true">
        <span className="bone bone-title" />
        <span className="bone bone-line" />
      </div>
      <div className="sign-body" aria-hidden="true">
        <div className="plate">
          <span className="bone bone-temp" />
          <span className="bone bone-line" />
        </div>
        <div className="clock">
          <span className="bone bone-line" />
          <span className="bone bone-time" />
        </div>
      </div>
      <div className="sun" aria-hidden="true">
        <div className="sun-cell">
          <span className="bone bone-line" />
        </div>
        <div className="sun-cell">
          <span className="bone bone-line" />
        </div>
      </div>
    </div>
  );
}
