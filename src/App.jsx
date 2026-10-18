import { useEffect, useState } from "react";

const REPOSITORY = "https://github.com/corlovich-boop/dorkcoin";
const RELEASES_API = "https://api.github.com/repos/corlovich-boop/dorkcoin/releases?per_page=30";

const platforms = [
  { id: "windows", label: "Windows" },
  { id: "linux", label: "Linux" },
  { id: "macos", label: "macOS" },
];

function matchesPlatform(asset, platform) {
  const name = asset.name.toLowerCase();
  if (platform === "windows") return /windows|win64|win32/.test(name);
  if (platform === "linux") return /linux/.test(name);
  return /macos|mac os|\.dmg$/.test(name);
}

function formatSize(bytes) {
  if (!bytes) return "Size unavailable";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" /></svg>;
}

function IconBadge({ children }) {
  return <div className="icon-badge" aria-hidden="true">{children}</div>;
}

function DownloadCenter() {
  const [releases, setReleases] = useState([]);
  const [platform, setPlatform] = useState("windows");
  const [status, setStatus] = useState("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    fetch(RELEASES_API, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setReleases(data
          .filter((release) => !release.draft && !release.prerelease)
          .sort((first, second) => Date.parse(second.published_at) - Date.parse(first.published_at)));
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, [retry]);

  const latest = releases[0];
  const latestAssets = (latest?.assets ?? []).filter((asset) => matchesPlatform(asset, platform));

  return (
    <section className="downloads" id="downloads">
      <div className="wrap">
        <div className="downloads-heading">
          <div>
            <span className="section-kicker">DORK CORE · OFFICIAL RELEASES</span>
            <h2>DOWNLOAD DORK CORE.</h2>
            <p>Get the latest Dork Core release for Windows, Linux, or macOS.</p>
          </div>
          {latest && <a className="release-current" href={latest.html_url} target="_blank" rel="noreferrer">
            <span className="status-dot" /> LATEST RELEASE <strong>{latest.tag_name}</strong>
          </a>}
        </div>

        <div className="download-layout">
          <div className="download-main">
            <div className="platform-tabs" role="tablist" aria-label="Choose your operating system">
              {platforms.map((item) => (
                <button
                  className={`platform-tab${platform === item.id ? " selected" : ""}`}
                  key={item.id}
                  onClick={() => setPlatform(item.id)}
                  role="tab"
                  aria-selected={platform === item.id}
                >
                  <span className={`platform-mark ${item.id}`} aria-hidden="true">
                    {item.id === "windows" && <svg viewBox="0 0 16 16" fill="currentColor"><path d="M6.555 1.375 0 2.237v5.45h6.555zM0 13.795l6.555.933V8.313H0zm7.278-5.4.026 6.378L16 16V8.395zM16 0 7.33 1.244v6.414H16z" /></svg>}
                    {item.id === "linux" && <svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.273 9.53a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.547Zm9.467-4.984a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546M7.4 13.108a5.54 5.54 0 0 1-3.775-2.88 3.27 3.27 0 0 1-1.944.24 7.4 7.4 0 0 0 5.328 4.465c.53.113 1.072.169 1.614.166a3.25 3.25 0 0 1-.666-1.9 6 6 0 0 1-.557-.091m3.828 2.285a2.273 2.273 0 1 0 0-4.546 2.273 2.273 0 0 0 0 4.546m3.163-3.108a7.44 7.44 0 0 0 .373-8.726 3.3 3.3 0 0 1-1.278 1.498 5.57 5.57 0 0 1-.183 5.535 3.26 3.26 0 0 1 1.088 1.693M2.098 3.998a3.3 3.3 0 0 1 1.897.486 5.54 5.54 0 0 1 4.464-2.388c.037-.67.277-1.313.69-1.843a7.47 7.47 0 0 0-7.051 3.745" /></svg>}
                    {item.id === "macos" && <svg viewBox="0 0 16 16" fill="currentColor"><path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" /></svg>}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="release-list" aria-live="polite">
              {status === "loading" && <p className="download-message">Checking GitHub for available releases…</p>}
              {status === "error" && <div className="download-message error">
                <p>GitHub releases could not be loaded right now.</p>
                <button className="text-button" onClick={() => setRetry((value) => value + 1)}>Try again</button>
              </div>}
              {status === "ready" && !latest && <p className="download-message">No stable Dork Core release is currently available.</p>}
              {status === "ready" && latest && latestAssets.length === 0 && <p className="download-message">No {platform} downloads are attached to the latest release ({latest.tag_name}). <a href={latest.html_url} target="_blank" rel="noreferrer">View its files on GitHub.</a></p>}
              {status === "ready" && latest && latestAssets.length > 0 && (
                <article className="release-card" key={latest.id}>
                  <div className="release-card-heading">
                    <div>
                      <h3>{latest.name || `Dork Core ${latest.tag_name}`}</h3>
                      <p>{latest.tag_name} <span>·</span> {formatDate(latest.published_at)}</p>
                    </div>
                    <span className="latest-badge">LATEST RELEASE</span>
                  </div>
                  <div className="asset-list">
                    {latestAssets.map((asset) => (
                      <a className="asset-row" href={asset.browser_download_url} key={asset.id}>
                        <span className="asset-file"><strong>{asset.name}</strong><small>{formatSize(asset.size)}</small>
                          {asset.digest && <details className="asset-checksum"><summary>SHA-256 checksum</summary><code>{asset.digest.replace("sha256:", "")}</code></details>}
                        </span>
                        <span className="asset-download">Download <ArrowIcon /></span>
                      </a>
                    ))}
                  </div>
                  {latest.body && <details className="release-notes">
                    <summary>Release notes</summary>
                    <p>{latest.body}</p>
                  </details>}
                </article>
              )}
            </div>
          </div>

        </div>
        <p className="download-footnote">Always verify download checksums against the values published with each GitHub release.</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <header className="navbar">
        <div className="wrap">
          <div className="brand">
            <img src="/assets/dorkcoin-logo.webp" alt="" />
            <span className="brand-name"><span className="l1">DORK CORE</span></span>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <h1>DORK CORE.<br /><span id="frens">The core of DORKCOIN</span>.</h1>
              <div className="eyebrow-divider" />
              <p>Dork Core is the open-source core software for Dorkcoin. Run a node, manage your wallet, and take part in the Proof-of-Stake network.</p>
              <div className="hero-btns">
                <a href="https://dorkcoin.org" className="btn btn-solid">Learn about Dorkcoin</a>
              </div>
            </div>
            <div className="coin-stage" aria-label="Dork Core">
              <svg className="pedestal" viewBox="0 0 300 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs><radialGradient id="pedGrad" cx="50%" cy="0%" r="80%"><stop offset="0%" stopColor="#2a2a2a" /><stop offset="100%" stopColor="#070707" /></radialGradient></defs>
                <polygon points="20,30 70,8 150,2 230,10 280,32 250,58 60,58" fill="url(#pedGrad)" />
                <polygon points="60,58 250,58 235,46 75,46" fill="#020202" opacity="0.7" />
              </svg>
              <div className="coin-wrap"><div className="ring-inner"><img src="/assets/dorkcoin-logo.webp" alt="" /></div></div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="wrap"><div className="cta-card">
            <div className="cta-watermark" aria-hidden="true">D</div>
            <div className="cta-text"><h2>BUILD DORK CORE.</h2><p>Explore the source, report issues, and contribute to the core software for Dorkcoin.</p></div>
            <a href={REPOSITORY} target="_blank" rel="noreferrer" className="btn btn-accent" id="source-btn">EXPLORE THE CODE</a>
          </div></div>
        </section>

        <section className="stats" aria-label="Dork Core features">
          <div className="wrap"><div className="stats-card">
            <div className="stat-item"><IconBadge><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6" /><path d="M12 3.4c2.6 2.4 2.6 14.8 0 17.2M12 3.4c-2.6-2.4-2.6-14.8 0-17.2M3.6 12h16.8" /></svg></IconBadge><div className="stat-text"><div className="num">PROOF OF STAKE</div><div className="label">Consensus</div></div></div>
            <div className="stat-item"><IconBadge><span className="code-mark">&lt;/&gt;</span></IconBadge><div className="stat-text"><div className="num">OPEN SOURCE</div><div className="label">Public code</div></div></div>
            <div className="stat-item"><IconBadge><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg></IconBadge><div className="stat-text"><div className="num">ALL PLATFORMS</div><div className="label">Windows · Linux · macOS</div></div></div>
            <div className="stat-item"><IconBadge><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6" /><path d="M14.7 9.4c-.6-.7-1.5-1.1-2.7-1.1-1.6 0-2.7.8-2.7 2s1.1 1.7 2.7 2 2.7.8 2.7 2-1.1 2-2.7 2c-1.2 0-2.1-.4-2.7-1.1M12 6.5v11" /></svg></IconBadge><div className="stat-text"><div className="num">DORK WALLET</div><div className="label">Send, receive and stake.</div></div></div>
          </div></div>
        </section>

        <DownloadCenter />
      </main>

      <footer className="footer">
        <svg className="footer-rocks" viewBox="0 0 1200 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="120,90 180,40 230,55 280,30 330,90" fill="#0c0c0c" /><polygon points="700,90 760,50 820,62 880,38 930,90" fill="#0a0a0a" /><polygon points="950,90 1010,55 1070,68 1120,90" fill="#0c0c0c" /></svg>
        <div className="wrap"><div className="footer-meta"><p>© {new Date().getFullYear()} Dork Core.</p><p>The core software for Dorkcoin.</p></div></div>
      </footer>
    </>
  );
}

export default App;
