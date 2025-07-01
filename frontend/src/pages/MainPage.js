// src/pages/MainPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

export default function MainPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:2137/api/tierlists')
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        setLists(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="main-loading">Loading your tier lists…</p>;
  if (error)   return <p className="main-error">Error: {error}</p>;

  return (
    <div className="main-page">
      <h1>Tier Lists: </h1>
      {lists.length === 0 && (
        <p>No tier lists yet. <Link to="/create">Create one!</Link></p>
      )}
      <ul className="tierlist-bars">
        {lists.map(list => (
          <li key={list.id} className="tierlist-bar">
            <Link to={`/view/${list.id}`} className="bar-link">
              <span className="bar-title">{list.title}</span>
              <span className="bar-author"> by {list.author}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
