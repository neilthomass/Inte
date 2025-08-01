import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Vendor {
  vendorName: string;
  language: string;
  topics: string[];
  slug: string;
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
              <h2>{selected.vendorName} Integration</h2>
              <div className="snippet-metadata">
                <span className="language-tag">{selected.language}</span>
                <div className="topics">
                  {selected.topics.map(topic => (
                    <span key={topic} className="topic-tag">{topic}</span>
                  ))}
                </div>
              </div>
              <div className="markdown-content">
                <ReactMarkdown>{snippet}</ReactMarkdown>
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

      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8fafc;
        }

        .header {
          background: white;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid #e2e8f0;
        }

        .header h1 {
          margin: 0;
          color: #1a202c;
          font-size: 2rem;
          font-weight: 700;
        }

        .main-content {
          flex: 1;
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .snippets-panel {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .snippet-content h2 {
          margin: 0 0 1rem 0;
          color: #1a202c;
          font-size: 1.5rem;
        }

        .snippet-metadata {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .language-tag {
          background: #3182ce;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
        }

        .topics {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .topic-tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 13px;
        }

        .markdown-content {
          color: #2d3748;
          line-height: 1.6;
        }

        .no-selection {
          text-align: center;
          color: #718096;
          padding: 4rem 2rem;
        }

        .no-selection h2 {
          color: #4a5568;
          margin-bottom: 1rem;
        }

        .menu-panel {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          height: fit-content;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
        }

        .search-container {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .menu-panel h3 {
          margin: 0 0 1rem 0;
          color: #1a202c;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .vendors-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .vendor-item {
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          background: #fafafa;
        }

        .vendor-item:hover {
          border-color: #cbd5e0;
          background: white;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .vendor-item.active {
          border-color: #3182ce;
          background: #ebf8ff;
        }

        .vendor-name {
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 0.5rem;
        }

        .vendor-meta {
          display: flex;
          font-size: 12px;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .vendor-topics {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .mini-topic {
          background: #edf2f7;
          color: #4a5568;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }

        .more-topics {
          color: #718096;
          font-size: 11px;
          font-style: italic;
        }

        .no-results {
          text-align: center;
          color: #718096;
          padding: 2rem 1rem;
        }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }

          .menu-panel {
            max-height: 400px;
          }

          .header {
            padding: 1rem;
          }

          .snippets-panel {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
