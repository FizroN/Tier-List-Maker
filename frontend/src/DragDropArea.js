// src/DragDropArea.js
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TierList from "./TierList";
import ImageTray from "./ImageTray";
import "./DragDropArea.css";

export default function DragDropArea() {
  // Tray holds the base64 strings of your cropped images
  const [trayImages, setTrayImages] = useState([]);

  // Tiers holds an order of images per tier name
  const [tiers, setTiers] = useState([
  { id: 'S', name: 'S', color: '#ff0000', images: [] },
  { id: 'A', name: 'A', color: '#ff7f00', images: [] },
  { id: 'B', name: 'B', color: '#ffff00', images: [] },
  { id: 'C', name: 'C', color: '#00ff00', images: [] },
  { id: 'D', name: 'D', color: '#00bfff', images: [] },
  { id: 'F', name: 'F', color: '#8a2be2', images: [] },
]);
  const handleAddTier = () => {
  const newId = `custom-${Date.now()}`; // unique ID
  const newTier = {
    id: newId,
    name: 'New Tier',
    color: '#cccccc',
    images: [],
  };
  setTiers((prev) => [...prev, newTier]);
};

    const [title, setTitle] = useState("My Tier List");
    const [description, setDescription] = useState("A description of my tier list.");
    const [author, setAuthor] = useState("");
    const [isLocked, setIsLocked] = useState(false);

    const handleLockAndSubmit = () => {
  const payload = {
    title,
    description,
    author,
    tiers,
  };

  // Optional: show confirmation
  if (!window.confirm("Are you sure you want to lock and submit? You won’t be able to edit anymore.")) return;

  // POST to backend (adjust URL to match your server route)
  fetch("/api/submit-tierlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    })
    .then(() => {
      setIsLocked(true);
    })
    .catch((err) => {
      console.error("Submit failed:", err);
      alert("Failed to submit tier list. Try again.");
    });
};
  return (
    <>
      <div className="flex-grow-1 container">
      {/* Pass the tier data + setter so your TierRow drop handlers can update both tiers and tray */}
        <div style={{ marginBottom: "1rem" }}>
  <div className="tier-metadata">
  <input
    type="text"
    placeholder="Tier list title"
    className="tier-title-input"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    disabled={isLocked}
  />
  <textarea
    placeholder="Description (optional)"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    disabled={isLocked}
  />
  <input
    type="text"
    placeholder="Author name"
    value={author}
    onChange={(e) => setAuthor(e.target.value)}
    disabled={isLocked}
  />
</div>
        <TierList 
            tiers={tiers} 
            setTiers={setTiers} 
            setTrayImages={setTrayImages}
            disabled={isLocked}
        />
        <div className="bottom-buttons">
          <button
          className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
          onClick={handleAddTier}
          disabled={isLocked}
        >
          + Add Tier
        </button>
        {!isLocked && (
        <button onClick={handleLockAndSubmit} className="mt-4 px-4 py-2 bg-black text-white rounded submit-btn">
          Lock & Submit
        </button>
        )}
        </div>
      </div>
      </div>
      {/* Pass trayImages + setter so ImageTray can render + remove images */}
      <ImageTray images={trayImages} setImages={setTrayImages} disabled={isLocked}/>
    </>
  );
}
