// src/pages/ViewerPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ViewerPage.css';

export default function ViewerPage() {
  const { id } = useParams();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:2137/api/tierlists/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        setList(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="viewer-loading">Loading tier list…</p>;
  if (error)   return <p className="viewer-error">Error: {error}</p>;
  if (!list)  return <p className="viewer-error">Tier list not found.</p>;
  console.log(list);
  return (
    <div className="viewer-page">
      <h1 className="viewer-title">{list.title}</h1>
      <p className="viewer-meta">
        <span>by {list.author}</span>
        <span> &middot; Created {new Date(list.createdAt).toLocaleDateString()}</span>
      </p>
      {list.description && (
        <p className="viewer-description">{list.description}</p>
      )}
      <div className="viewer-snapshot">
        {list.snapshotImageUrl ? (
          <img
            src={list.snapshotImageUrl}
            alt={`${list.title} snapshot`}
            className="img-fluid"
          />
        ) : (
          <p>No snapshot available.</p>
        )}
      </div>
      {/* future: render tiers dynamically here */}
    </div>
  );
}
