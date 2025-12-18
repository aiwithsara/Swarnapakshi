
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const SearchCenter: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{ text: string; sources: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      setResult({ text, sources });
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Ask anything (e.g., 'What are the current stock prices of leading AI companies?')"
          className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-6 px-8 text-lg text-white shadow-2xl focus:ring-2 focus:ring-blue-500 outline-none pr-32"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="absolute right-4 top-4 bottom-4 px-8 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all disabled:opacity-50"
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </div>

      {result && (
        <div className="bg-gray-800/40 rounded-3xl border border-gray-700 p-8 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{result.text}</p>
          </div>

          {result.sources.length > 0 && (
            <div className="pt-6 border-t border-gray-700">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Verified Sources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((chunk, i) => {
                  const web = chunk.web;
                  if (!web) return null;
                  return (
                    <a
                      key={i}
                      href={web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-900/80 hover:bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col gap-1 transition-all group"
                    >
                      <span className="text-blue-400 font-medium group-hover:underline truncate">{web.title || 'Source'}</span>
                      <span className="text-xs text-gray-500 truncate">{new URL(web.uri).hostname}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchCenter;
