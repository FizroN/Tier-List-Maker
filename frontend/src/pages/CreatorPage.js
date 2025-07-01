// src/pages/CreatorPage.jsx
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDropArea from "../DragDropArea";
import { useAutoScrollWhileDragging } from "../useAutoScrollWhileDragging";

export default function CreatorPage() {
  const [images, setImages] = useState([]);
  useAutoScrollWhileDragging(true);

  const handleAddImage = () => {
    console.log("Clicked + button!");
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        {/* Optional: call handleAddImage from a toolbar button inside this page */}
        <p style={{ color: 'white' }}>Hello world! (intencjonalnie zostawiłem to tutaj XD)</p>
        <DragDropArea images={images} setImages={setImages} />
      </div>
    </DndProvider>
  );
}