import { useEffect, useRef, useState } from "react";
import { ApiError, getSnapshot } from "../api/openMeteo";
import type { SnapshotState } from "../types";

// Handles searching: idle -> loading -> success or error
export function useCitySnapshot() {
  const [state, setState] = useState<SnapshotState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);

  async function search(rawQuery: string) {
    // cancel the previous request if there is one
    if (controllerRef.current) controllerRef.current.abort();

    const query = rawQuery.trim();
    if (query === "") {
      controllerRef.current = null;
      setState({ status: "error", kind: "empty-input", query });
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: "loading", query });

    try {
      const snapshot = await getSnapshot(query, controller.signal);
      if (controller.signal.aborted) return;
      setState({ status: "success", snapshot });
    } catch (error) {
      if (controller.signal.aborted) return;
      const kind = error instanceof ApiError ? error.kind : "unknown";
      setState({ status: "error", kind, query });
    }
  }

  // cancel the request when the component is removed
  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  return { state, search };
}
