import React, { useState } from 'react';

const AiPosts = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/posts/getAi?prompt=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok || !data.urls) {
        throw new Error('Failed to fetch post');
      }
      setResults(data.urls);
    } catch (err) {
      console.error('Error searching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">AI Posts</h2>
        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-200 rounded-full p-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="What's on your mind?"
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:bg-gray-400 transition"
          >
            {loading ? 'Loading...' : 'Post'}
          </button>
        </form>
        <div className="mt-6 space-y-4">
          {results.length > 0 ? (
            results.map((result, index) => (
              <div key={index} className="bg-white border rounded-lg shadow-md p-4">
                <img src={result} alt={`Post ${index}`} className="w-full rounded-lg" />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No posts yet. Start by searching!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPosts;