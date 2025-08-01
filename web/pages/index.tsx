import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Vendor {
  vendorName: string;
  language: string;
  topics: string[];
  slug: string;
  lastUpdated: string;
}

export default function Home() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Vendor | null>(null);
  const [snippet, setSnippet] = useState('');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/neilthomass/Inte/main/snippets/metadata.json')
      .then(res => res.json())
      .then(setVendors);
  }, []);

  const filtered = vendors.filter(v => {
    const q = query.toLowerCase();
    return (
      v.vendorName.toLowerCase().includes(q) ||
      v.topics.some(t => t.toLowerCase().includes(q))
    );
  });

  const loadSnippet = async (slug: string) => {
    setSnippet('Loading...');
    const url = `https://raw.githubusercontent.com/neilthomass/Inte/main/snippets/${slug}/snippet.md`;
    const res = await fetch(url);
    setSnippet(await res.text());
  };

  const copyToClipboard = async () => {
    if (selected && snippet && snippet !== 'Loading...') {
      try {
        await navigator.clipboard.writeText(snippet);
        // You could add a toast notification here if desired
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h1>Integration Snippets</h1>
      </header>

      {/* Main content area */}
      <main className="main-content">
        {/* Left side - Search and Menu */}
        <aside className="menu-panel">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search vendors and topics..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <h3>Available Integrations</h3>
          <div className="vendors-list">
            {filtered.map(v => (
              <div
                key={v.slug}
                className={`vendor-item ${selected?.slug === v.slug ? 'active' : ''}`}
                onClick={() => {
                  setSelected(v);
                  loadSnippet(v.slug);
                }}
              >
                <div className="vendor-name">{v.vendorName}</div>
                <div className="vendor-meta">
                  <span className="language">{v.language}</span>
                </div>
                <div className="vendor-topics">
                  {v.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="mini-topic">{topic}</span>
                  ))}
                  {v.topics.length > 3 && <span className="more-topics">+{v.topics.length - 3}</span>}
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && query && (
            <div className="no-results">
              <p>No integrations found for "{query}"</p>
            </div>
          )}
        </aside>

        {/* Right side - Snippets display */}
        <section className="snippets-panel">
          {selected ? (
            <div className="snippet-content">
              <div className="snippet-header">
                <div className="snippet-title-section">
                  <h2>{selected.vendorName} Integration</h2>
                  <div className="last-updated">Last updated: {selected.lastUpdated}</div>
                </div>
                <button 
                  onClick={copyToClipboard} 
                  className="copy-button"
                  title="Copy markdown to clipboard"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                    <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
                  </svg>
                  Copy
                </button>
              </div>
              <div className="snippet-metadata">
                <span className="language-tag">{selected.language}</span>
                <div className="topics">
                  {selected.topics.map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
                              <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      code({node, className, children, ...props}: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const isInline = !className;
                        
                        if (isInline) {
                          return <code className="inline-code" {...props}>{children}</code>;
                        }
                        
                        return (
                          <pre className="code-block">
                            <code className={`language-${language}`} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      }
                    }}
                  >
                    {snippet}
                  </ReactMarkdown>
                </div>
            </div>
          ) : (
            <div className="no-selection">
              <h2>Select a vendor from the menu to view integration snippets</h2>
              <p>Browse available integrations in the menu on the left.</p>
            </div>
          )}
        </section>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html, body {
          margin: 0;
          padding: 0;
          background-color: #0d1117;
          color: #f0f6fc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
        }

        #__next {
          background-color: #0d1117;
          min-height: 100vh;
        }
      `}</style>
      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
          background-color: #0d1117;
          color: #f0f6fc;
        }

        .header {
          background: #161b22;
          padding: 2rem;
          border-bottom: 1px solid #30363d;
        }

        .header h1 {
          margin: 0;
          margin-left: 6.5rem;
          color: #f0f6fc;
          font-size: 2rem;
          font-weight: 600;
        }

        .main-content {
          flex: 1;
          display: grid;
          grid-template-columns: 350px 1fr;
          grid-template-rows: min-content;
          align-items: start;
          gap: 2rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .snippets-panel {
          background: #161b22;
          border-radius: 6px;
          padding: 2rem;
          border: 1px solid #30363d;
        }

        .snippet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .snippet-title-section h2 {
          margin: 0 0 0.5rem 0;
          color: #f0f6fc;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .last-updated {
          color: #8b949e;
          font-size: 0.875rem;
          margin-bottom: 0;
        }

        .copy-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #21262d;
          color: #f0f6fc;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-button:hover {
          background: #30363d;
          border-color: #8b949e;
        }

        .copy-button:active {
          background: #282e33;
        }

        .snippet-metadata {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .language-tag {
          background: #1f6feb;
          color: #ffffff;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .topics {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .topic-tag {
          background: #21262d;
          color: #f0f6fc;
          border: 1px solid #30363d;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
        }

        .markdown-content {
          color: #f0f6fc;
          line-height: 1.6;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          color: #f0f6fc;
          border-bottom: 1px solid #30363d;
          padding-bottom: 0.3rem;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .markdown-content p {
          margin-bottom: 1rem;
        }

        .markdown-content .inline-code {
          background: #21262d;
          color: #f85149;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 85%;
          border: 1px solid #30363d;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .markdown-content .code-block {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
          margin: 16px 0;
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }

        .markdown-content .code-block code {
          background: transparent;
          color: #f0f6fc;
          padding: 0;
          border: none;
          border-radius: 0;
          font-size: 14px;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          line-height: 1.45;
          display: block;
          word-wrap: break-word;
          white-space: pre;
          box-sizing: border-box;
        }

        /* Fallback for any remaining generic code/pre elements */
        .markdown-content code {
          background: #21262d;
          color: #f85149;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 85%;
          border: 1px solid #30363d;
          box-sizing: border-box;
        }

        .markdown-content pre {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
          margin: 16px 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        }

        .markdown-content pre code {
          background: transparent;
          color: #f0f6fc;
          padding: 0;
          border: none;
          border-radius: 0;
          font-size: 14px;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          line-height: 1.45;
          display: block;
          word-wrap: break-word;
          white-space: pre;
          box-sizing: border-box;
        }

        .markdown-content blockquote {
          border-left: 4px solid #30363d;
          padding-left: 1rem;
          color: #8b949e;
          margin: 1rem 0;
        }

        .markdown-content a {
          color: #58a6ff;
          text-decoration: none;
        }

        .markdown-content a:hover {
          text-decoration: underline;
        }

        .no-selection {
          text-align: center;
          color: #8b949e;
          padding: 4rem 2rem;
        }

        .no-selection h2 {
          color: #f0f6fc;
          margin-bottom: 1rem;
        }

        .menu-panel {
          background: #161b22;
          border-radius: 6px;
          padding: 1.5rem;
          border: 1px solid #30363d;
          height: fit-content;
          min-height: 200px;
        }

        .search-container {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 8px 12px;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          color: #f0f6fc;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #1f6feb;
          box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.3);
        }

        .search-input::placeholder {
          color: #8b949e;
        }

        .menu-panel h3 {
          margin: 0 0 1rem 0;
          color: #f0f6fc;
          font-size: 16px;
          font-weight: 600;
        }

        .vendors-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .vendor-item {
          padding: 12px;
          border: 1px solid #30363d;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
          background: #0d1117;
        }

        .vendor-item:hover {
          border-color: #8b949e;
          background: #21262d;
        }

        .vendor-item.active {
          border-color: #1f6feb;
          background: #0c2d6b;
        }

        .vendor-name {
          font-weight: 600;
          color: #f0f6fc;
          margin-bottom: 0.5rem;
          font-size: 14px;
        }

        .vendor-meta {
          display: flex;
          font-size: 12px;
          color: #8b949e;
          margin-bottom: 0.5rem;
        }

        .vendor-topics {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .mini-topic {
          background: #21262d;
          color: #8b949e;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }

        .more-topics {
          color: #8b949e;
          font-size: 11px;
          font-style: italic;
        }

        .no-results {
          text-align: center;
          color: #8b949e;
          padding: 2rem 1rem;
        }

        /* Scrollbar styling for dark theme */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #161b22;
        }

        ::-webkit-scrollbar-thumb {
          background: #30363d;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }

          .menu-panel {
            min-height: 150px;
            max-height: 70vh;
            overflow-y: auto;
          }

          .header {
            padding: 1rem;
          }

          .header h1 {
            margin-left: 2.5rem;
          }

          .snippets-panel {
            padding: 1rem;
          }

          .snippet-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .copy-button {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
