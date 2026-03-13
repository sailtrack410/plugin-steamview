import { css } from 'lit'

export const steamGamesStyles = css`
  :host {
    --font-body: 'Avenir Next', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Noto Sans SC', sans-serif;

    --bg-page: #f4f5f7;
    --bg-page-alt: #eceef1;
    --surface: #ffffff;
    --surface-strong: #ffffff;
    --surface-muted: #f3f4f6;

    --border: #d2d6dd;
    --text: #121417;
    --text-subtle: #5e646d;
    --accent: #16181b;
    --accent-strong: #000000;
    --success: #1c2026;
    --danger: #c3484b;

    --shadow-soft: 0 2px 10px rgba(0, 0, 0, 0.06);
    --shadow-card: 0 4px 16px rgba(0, 0, 0, 0.08);

    --radius-xl: 16px;
    --radius-lg: 12px;
    --radius-md: 10px;
    --radius-sm: 8px;

    color: var(--text);
    color-scheme: light;
    display: block;
    font-family: var(--font-body);
    -webkit-tap-highlight-color: rgba(22, 24, 27, 0.22);
  }

  :host([data-color-scheme='dark']) {
    --bg-page: #07080a;
    --bg-page-alt: #0d0f12;
    --surface: #121417;
    --surface-strong: #101215;
    --surface-muted: #181b20;

    --border: #2b3037;
    --text: #f1f3f6;
    --text-subtle: #a1a7b0;
    --accent: #dde2e9;
    --accent-strong: #ffffff;
    --success: #d6dce4;
    --danger: #ff9ca0;

    --shadow-soft: 0 3px 12px rgba(0, 0, 0, 0.28);
    --shadow-card: 0 6px 20px rgba(0, 0, 0, 0.34);
    color-scheme: dark;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  .shell {
    min-height: 100vh;
    background: var(--bg-page);
    padding: max(18px, env(safe-area-inset-top)) 14px max(30px, env(safe-area-inset-bottom));
  }

  :host([embedded]) .shell {
    min-height: auto;
    padding: 8px;
  }

  .container {
    margin: 0 auto;
    max-width: 1360px;
    position: relative;
  }

  :host([embedded]) .container {
    max-width: none;
  }

  .overview {
    margin-top: 2px;
  }

  .profile-panel {
    background: var(--surface-strong);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-soft);
    min-width: 0;
    padding: 12px 14px;
  }

  .profile-head {
    align-items: center;
    display: flex;
    gap: 12px;
    min-width: 0;
  }

  .profile-avatar {
    border: 1px solid var(--border);
    border-radius: 50%;
    flex-shrink: 0;
    height: 62px;
    object-fit: cover;
    width: 62px;
  }

  .profile-avatar-fallback {
    align-items: center;
    background: color-mix(in srgb, var(--accent) 18%, var(--surface-strong));
    display: inline-flex;
    font-size: 1.2rem;
    font-weight: 760;
    justify-content: center;
    text-transform: uppercase;
  }

  .profile-main {
    min-width: 0;
  }

  .profile-name {
    font-size: 1.26rem;
    font-weight: 720;
    margin: 0;
    overflow-wrap: anywhere;
  }

  .profile-link {
    color: var(--accent-strong);
    display: inline-block;
    font-size: 0.92rem;
    margin-top: 4px;
    text-decoration: none;
  }

  .profile-link:hover {
    text-decoration: underline;
  }

  .profile-metrics {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 12px 0 0;
  }

  .metric-chip {
    background: var(--surface-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    min-width: 0;
    padding: 7px 9px;
  }

  .metric-chip dt {
    align-items: center;
    color: var(--text-subtle);
    display: flex;
    font-size: 0.74rem;
    gap: 6px;
    margin: 0;
  }

  .metric-icon {
    align-items: center;
    background: color-mix(in srgb, var(--text) 9%, transparent);
    border-radius: 6px;
    color: var(--text);
    display: inline-flex;
    font-size: 0.68rem;
    height: 16px;
    justify-content: center;
    width: 16px;
  }

  .metric-chip dd {
    font-size: 1rem;
    font-weight: 680;
    line-height: 1.25;
    margin: 4px 0 0;
    overflow-wrap: anywhere;
  }

  .metric-chip:nth-child(5),
  .metric-chip:nth-child(6),
  .metric-chip:nth-child(7) {
    grid-column: span 1;
  }

  .metric-chip:nth-child(7) {
    grid-column: 3 / span 1;
  }

  .metric-chip:nth-child(4) dd,
  .metric-chip:nth-child(7) dd {
    font-variant-numeric: tabular-nums;
  }

  .metric-chip:nth-child(5) dd,
  .metric-chip:nth-child(6) dd {
    font-size: 0.94rem;
  }

  .toolbar {
    align-items: center;
    display: grid;
    gap: 8px;
    grid-template-columns: 1fr auto;
    margin-top: 10px;
  }

  .field {
    min-width: 0;
  }

  .toolbar-actions {
    align-items: center;
    display: flex;
    gap: 8px;
  }

  .field-sort select {
    min-width: 190px;
  }

  .list-meta {
    color: var(--text-subtle);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.82rem;
    gap: 6px 10px;
    justify-content: space-between;
    margin-top: 2px;
  }

  input,
  select,
  button {
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 0.92rem;
    min-height: 42px;
  }

  input,
  select {
    background: var(--surface-strong);
    padding: 0 12px;
    width: 100%;
  }

  button {
    background: var(--surface-strong);
    cursor: pointer;
    font-weight: 650;
    padding: 0 14px;
    transition: border-color 150ms ease, background-color 150ms ease, transform 150ms ease;
  }

  .refresh-btn {
    background: var(--text);
    border-color: var(--text);
    color: #fff;
  }

  :host([data-color-scheme='dark']) .refresh-btn {
    background: #f1f3f6;
    border-color: #f1f3f6;
    color: #0f1216;
  }

  button:hover {
    background: var(--surface-muted);
    border-color: color-mix(in srgb, var(--text) 22%, var(--border));
  }

  .refresh-btn:hover {
    background: color-mix(in srgb, var(--text) 84%, #fff);
    border-color: color-mix(in srgb, var(--text) 84%, #fff);
    color: #fff;
  }

  :host([data-color-scheme='dark']) .refresh-btn:hover {
    background: #ffffff;
    border-color: #ffffff;
    color: #07080a;
  }

  input:focus-visible,
  select:focus-visible,
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-strong) 86%, transparent);
    outline-offset: 2px;
  }

  .game-waterfall {
    column-count: 4;
    column-gap: 14px;
    margin-top: 12px;
  }

  .game-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    break-inside: avoid;
    box-shadow: var(--shadow-card);
    display: inline-block;
    margin: 0 0 14px;
    overflow: hidden;
    transition: border-color 150ms ease, box-shadow 150ms ease;
    width: 100%;
  }

  .game-card:hover {
    border-color: color-mix(in srgb, var(--text) 22%, var(--border));
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  .cover-link {
    display: block;
  }

  .game-cover {
    aspect-ratio: 460 / 215;
    background: var(--surface-muted);
    display: block;
    height: auto;
    object-fit: cover;
    width: 100%;
  }

  .game-body {
    min-width: 0;
    padding: 12px;
  }

  .game-head {
    align-items: start;
    display: flex;
    gap: 10px;
    justify-content: space-between;
  }

  .game-name {
    display: -webkit-box;
    font-size: 0.98rem;
    line-height: 1.35;
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .game-meta {
    color: var(--text-subtle);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.75rem;
    gap: 4px 10px;
    justify-content: space-between;
    margin: 8px 0 0;
  }

  .metric-block {
    margin-top: 10px;
  }

  .metric-row {
    display: flex;
    font-size: 0.8rem;
    justify-content: space-between;
  }

  .metric-row span:first-child {
    color: var(--text-subtle);
  }

  .progress {
    background: color-mix(in srgb, var(--text) 10%, transparent);
    border-radius: 999px;
    height: 6px;
    margin-top: 7px;
    overflow: hidden;
  }

  .progress > i {
    background: var(--accent);
    display: block;
    height: 100%;
  }

  .progress-two-week > i {
    background: var(--accent-strong);
  }

  .active-tag {
    background: color-mix(in srgb, var(--text) 7%, transparent);
    border: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
    border-radius: 999px;
    display: inline-block;
    font-size: 0.7rem;
    padding: 2px 8px;
    white-space: nowrap;
  }

  .load-zone {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .load-sentinel {
    height: 1px;
    width: 100%;
  }

  .loading-hint {
    color: var(--text-subtle);
    font-size: 0.78rem;
    margin: 0;
    text-align: center;
  }

  .loading-hint.done {
    margin-top: 10px;
  }

  .state {
    background: var(--surface-strong);
    border: 1px dashed color-mix(in srgb, var(--border) 88%, var(--text) 12%);
    border-radius: var(--radius-md);
    margin-top: 14px;
    padding: 22px 16px;
    text-align: center;
  }

  .state h3 {
    margin: 0;
  }

  .state p {
    color: var(--text-subtle);
    margin: 8px auto 0;
    max-width: 60ch;
    overflow-wrap: anywhere;
  }

  .state.error {
    border-color: color-mix(in srgb, var(--danger) 56%, var(--border));
    color: var(--danger);
  }

  .spinner {
    animation: spin 900ms linear infinite;
    border: 3px solid color-mix(in srgb, var(--text) 14%, transparent);
    border-top-color: var(--text);
    border-radius: 50%;
    height: 30px;
    margin: 0 auto 10px;
    width: 30px;
  }

  .sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1320px) {
    .game-waterfall {
      column-count: 3;
    }
  }

  @media (max-width: 1100px) {
    .profile-metrics {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .game-waterfall {
      column-count: 2;
    }
  }

  @media (max-width: 760px) {
    .toolbar {
      grid-template-columns: 1fr;
    }

    .toolbar-actions {
      width: 100%;
    }

    .toolbar-actions > .field,
    .toolbar-actions > .refresh-btn {
      flex: 1 1 auto;
    }

    .field-sort select {
      min-width: 0;
      width: 100%;
    }

    .profile-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 520px) {
    .shell {
      padding-left: 10px;
      padding-right: 10px;
    }

    .profile-metrics {
      grid-template-columns: 1fr;
    }

    .game-waterfall {
      column-count: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0ms !important;
      scroll-behavior: auto !important;
      transition-duration: 0ms !important;
    }
  }
`
