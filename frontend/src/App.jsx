import { useState } from 'react';
import './App.css';

// Simple client-side sentiment analyzer function (No backend needed!)
const analyzeSentiment = (title) => {
  const positiveWords = ['good', 'great', 'awesome', 'best', 'love', 'amazing', 'helpful', 'tutorial', 'easy', 'fix', 'solved', 'wow', 'excellent', 'cool', 'nice', 'smooth'];
  const negativeWords = ['bad', 'worst', 'hate', 'error', 'issue', 'bug', 'fail', 'broken', 'slow', 'crash', 'difficult', 'hard', 'annoying', 'wrong', 'problem', 'stuck', 'help'];
  
  const words = title.toLowerCase().split(/\W+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  return score;
};

function App() {
  const [subreddit, setSubreddit] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!subreddit) return;
    setLoading(true);
    try {
      const proxyUrl = "https://allorigins.win";
      const targetUrl = `https://reddit.com{subreddit}/hot.json?limit=50`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const redditJson = await response.json();
      
      // Map raw reddit children to a cleaner array structure with client-side sentiment score
      const posts = redditJson.data.children.map(child => {
        const title = child.data.title;
        return {
          id: child.data.id,
          title: title,
          score: analyzeSentiment(title), // Calculate score on the client side
          url: `https://reddit.com${child.data.permalink}`
        };
      });
      
      setResults(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVibeIcon = (score) => {
    if (score > 0) return 'Positive';
    if (score < 0) return 'Negative';
    return 'Neutral';
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#ff4500' }}>Subreddit Vibe Check</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          value={subreddit}
          onChange={(e) => setSubreddit(e.target.value)}
          placeholder="e.g. Javascript, ReactJS"
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
        />
        <button 
          onClick={handleSearch}
          style={{ padding: '12px 24px', backgroundColor: '#ff4500', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Checking...' : 'Check Vibe'}
        </button>
      </div>

      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {results.map(post => (
            <div key={post.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa' }}>
              <a href={post.url} target="_blank" rel="noreferrer" style={{ color: '#333', textDecoration: 'none', fontWeight: '500', marginRight: '15px', flex: 1 }}>
                {post.title}
              </a>
              <span style={{ 
                padding: '6px 12px', 
                borderRadius: '20px', 
                fontSize: '14px', 
                fontWeight: 'bold',
                backgroundColor: post.score > 0 ? '#e6f4ea' : post.score < 0 ? '#fce8e6' : '#f1f3f4',
                color: post.score > 0 ? '#137333' : post.score < 0 ? '#c5221f' : '#3c4043'
              }}>
                {getVibeIcon(post.score)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
