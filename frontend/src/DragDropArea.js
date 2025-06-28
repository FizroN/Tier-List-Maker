// src/DragDropArea.js
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TierList from "./TierList";
import ImageTray from "./ImageTray";

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

  return (
    <>
      <div className="flex-grow-1 container">
      {/* Pass the tier data + setter so your TierRow drop handlers can update both tiers and tray */}
        <div style={{ marginBottom: "1rem" }}>
  <input
    type="text"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Enter tier list title"
    style={{
      width: "100%",
      fontSize: "1.5rem",
      padding: "0.5rem",
      marginBottom: "0.5rem",
      fontWeight: "bold"
    }}
  />
  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Enter tier list description"
    rows={3}
    style={{
      width: "100%",
      padding: "0.5rem",
      fontSize: "1rem",
      resize: "vertical"
    }}
  />
</div>
        <TierList 
            tiers={tiers} 
            setTiers={setTiers} 
            setTrayImages={setTrayImages}
        />

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
          onClick={handleAddTier}
        >
          + Add Tier
        </button>
      </div>
      {/* Pass trayImages + setter so ImageTray can render + remove images */}
      <ImageTray images={trayImages} setImages={setTrayImages} />
    </>
  );
}
