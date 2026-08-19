import { useState } from 'react';
import './App.css';

function App() {
  const [subreddit, setSubreddit] = useState('');
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!subreddit) return;
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${subreddit}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getVibeIcon = (score) => {
    if (score > 0) return '😊 Positive';
    if (score < 0) return '😢 Negative';
    return '😐 Neutral';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#ff4500' }}>Subreddit Vibe Check</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Enter subreddit (e.g., javascript)" 
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button onClick={handleSearch} style={{ padding: '12px 24px', backgroundColor: '#ff4500', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Check Vibe
        </button>
      </div>

      {results && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Results for r/{results.subreddit}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {results.posts?.map((post, index) => (
              <div key={index} style={{ padding: '16px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: '#fafafa', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '500' }}>{post.title}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>Vibe: <strong>{getVibeIcon(post.score)}</strong></span>
                  <span>Score: {post.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;