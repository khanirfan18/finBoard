import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { error } = this.state;

    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-fin-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1 style={styles.heading}>Something went wrong</h1>
          <p style={styles.body}>
            An unexpected error occurred. You can try to recover below, or
            reload the page if the problem persists.
          </p>

          {error?.message && (
            <pre style={styles.errorBlock}>
              <span style={styles.errorLabel}>Error</span>
              {error.message}
            </pre>
          )}

          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={this.handleReset}>
              Try again
            </button>
            <button
              style={styles.btnOutline}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-fin-bg)",
    padding: "2rem",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    backgroundColor: "var(--color-fin-surface)",
    border: "1px solid var(--color-fin-border)",
    borderRadius: "16px",
    padding: "2.5rem",
    maxWidth: "480px",
    width: "100%",
    boxShadow: "0 8px 32px var(--color-fin-shadow)",
  },
  iconWrap: {
    marginBottom: "1.25rem",
  },
  heading: {
    color: "var(--color-fin-text)",
    fontSize: "1.375rem",
    fontWeight: 600,
    margin: "0 0 0.625rem 0",
    letterSpacing: "-0.01em",
  },
  body: {
    color: "var(--color-fin-muted)",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    margin: "0 0 1.25rem 0",
  },
  errorBlock: {
    backgroundColor: "var(--color-fin-bg)",
    border: "1px solid var(--color-fin-border)",
    borderRadius: "8px",
    padding: "1rem",
    fontSize: "0.8rem",
    color: "var(--color-fin-text)",
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    margin: "0 0 1.5rem 0",
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  errorLabel: {
    color: "var(--color-fin-accent)",
    fontWeight: 600,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  actions: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  btnPrimary: {
    backgroundColor: "var(--color-fin-accent)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0.6rem 1.25rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "opacity 0.15s",
  },
  btnOutline: {
    backgroundColor: "transparent",
    color: "var(--color-fin-accent)",
    border: "1px solid var(--color-fin-accent)",
    borderRadius: "8px",
    padding: "0.6rem 1.25rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background-color 0.15s",
  },
};
