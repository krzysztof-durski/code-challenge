import { useEffect, useState } from "react";

// Returns the current time and updates it every second
export function useNow() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return now;
}
