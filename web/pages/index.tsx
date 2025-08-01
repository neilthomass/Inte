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
    fetch('/metadata.json').then(res => res.json()).then(setVendors);
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
    const url = `https://raw.githubusercontent.com/neiltthomas/inte/main/snippets/${slug}/snippet.md`;
    const res = await fetch(url);
    setSnippet(await res.text());
  };

  return (
    <div>
      <h1>Integration Snippets</h1>
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <ul>
        {filtered.map(v => (
          <li key={v.slug}>
            <button
              onClick={() => {
                setSelected(v);
                loadSnippet(v.slug);
              }}
            >
              {v.vendorName}
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div>
          <h2>{selected.vendorName}</h2>
          <ReactMarkdown>{snippet}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
