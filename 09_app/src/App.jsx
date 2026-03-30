import { useEffect, useState } from "react";

const DATA_URL = "/data/live/app-runtime.json";

export default function App() {
  const [state, setState] = useState({
    status: "loading",
    payload: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
          throw new Error(`Failed to load runtime bundle: ${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled) {
          setState({ status: "ready", payload, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            payload: null,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">MM3</p>
        <h1>Vocabulary Mindmap 3</h1>
        <p className="lede">
          Runtime bundle is restored from Cloudflare R2 during the build pipeline.
        </p>
      </section>

      {state.status === "loading" && <p className="card">runtime bundle loading...</p>}
      {state.status === "error" && <p className="card error">{state.error}</p>}
      {state.status === "ready" && (
        <section className="card">
          <h2>{state.payload.title}</h2>
          <p>{state.payload.description}</p>
          <dl className="meta">
            <div>
              <dt>Generated At</dt>
              <dd>{state.payload.generatedAt}</dd>
            </div>
            <div>
              <dt>Entry Count</dt>
              <dd>{state.payload.entryCount}</dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{state.payload.source}</dd>
            </div>
          </dl>
        </section>
      )}
    </main>
  );
}
