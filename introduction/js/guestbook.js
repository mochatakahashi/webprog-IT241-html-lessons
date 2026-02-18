// ============================================================
// Guestbook React Component
// Tech Stack: React (Frontend) + Nest.js (Backend) + Supabase (Database)
// Backend API deployed on Vercel
// ============================================================

const { useState, useEffect } = React;

// Nest.js Backend URL (deployed on Vercel, connects to Supabase)
const BACKEND_URL = 'https://react-nest-js-supabase-app.vercel.app';

function Guestbook() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState('');
  const [msgInput, setMsgInput] = useState('');

  // Fetch messages from Nest.js backend (which queries Supabase)
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/guestbook`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("API Error:", err));
  }, []);

  // Handle Submit - POST to Nest.js backend (which inserts into Supabase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !msgInput) return;

    const res = await fetch(`${BACKEND_URL}/api/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message: msgInput }),
    });

    if (res.ok) {
      const newMsg = await res.json();
      // NestJS/Supabase usually returns an array for inserts
      setMessages([Array.isArray(newMsg) ? newMsg[0] : newMsg, ...messages]);
      setName('');
      setMsgInput('');
    }
  };

  return (
    <div className="education-grid">
      {/* Left Card: Form */}
      <div className="education-card guestbook-form-card">
        <div className="guestbook-profile">
          <img src="images/my-photo-guestbook.jpg" alt="Rodmina Ibe" className="guestbook-pic" />
        </div>
        <div className="guestbook-form-wrapper">
          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            <input
              type="text"
              className="guestbook-input"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <textarea
              className="guestbook-textarea"
              placeholder="Message"
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              required
            />
            <button type="submit" className="guestbook-btn">Post Message</button>
          </form>
        </div>
      </div>

      {/* Right Card: Messages (Scrollable) */}
      <div className="education-card guestbook-messages-card">
        <h2 className="education-title">Messages</h2>
        <div className="guestbook-messages-list">
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet. Be the first!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="gb-message-card">
                <strong>{msg.name}:</strong> {msg.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Mount the React component to the guestbook section
const guestbookRoot = document.getElementById('guestbook-root');
if (guestbookRoot) {
  const root = ReactDOM.createRoot(guestbookRoot);
  root.render(<Guestbook />);
}
