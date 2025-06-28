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
  const [tiers, setTiers] = useState({
    S: [],
    A: [],
    B: [],
    C: [],
  });

  return (
    <>
      <div className="flex-grow-1 container">
      {/* Pass the tier data + setter so your TierRow drop handlers can update both tiers and tray */}

        <TierList 
            tiers={tiers} 
            setTiers={setTiers} 
            setTrayImages={setTrayImages}
        />
      </div>
      {/* Pass trayImages + setter so ImageTray can render + remove images */}
      <ImageTray images={trayImages} setImages={setTrayImages} />
    </>
  );
}
