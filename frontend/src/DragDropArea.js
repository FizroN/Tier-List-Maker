// src/DragDropArea.js
import React, { useState, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TierList from "./TierList";
import ImageTray from "./ImageTray";
import html2canvas from 'html2canvas';
import "./DragDropArea.css";

export default function DragDropArea() {
  // Ref do kontenera całej listy, żeby html2canvas mógł zapisać obraz całości
  const tierListRef = useRef(null); 

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
    const [isSubmitting, setIsSubmitting] = useState(false); //

   const handleLockAndSubmit = async () => { // Zmieniono na async
    if (isSubmitting) return; // Zapobieganie wielokrotnemu wysyłaniu
    setIsSubmitting(true);

    if (!window.confirm("Are you sure you want to lock and submit? You won’t be able to edit anymore.")) {
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Wygeneruj obraz z TierList
      if (!tierListRef.current) {
        throw new Error("Could not find tier list element to capture.");
      }

      tierListRef.current.classList.add('locked-snapshot');


      const canvas = await html2canvas(tierListRef.current, {
        useCORS: true, // Ważne, jeśli masz obrazy z różnych domen
        allowTaint: true, // Pozwala na "zanieczyszczone" obrazy z innych domen (może wymagać useCORS)
        scale: 2, // Zwiększ skalę dla lepszej jakości obrazu
        logging: false, // Wyłącz logowanie html2canvas do konsoli
        backgroundColor: '#2a2a2a',
      });

      // Konwertuj canvas na Blob (obiekt pliku)
      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const imageFile = new File([imageBlob], "tierlist_snapshot.png", { type: "image/png" });

      // 2. Przygotuj FormData do wysłania
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('author', author);
      formData.append('snapshotImage', imageFile); // Dodaj wygenerowany obraz

      // 3. Wyślij do backendu
      // Dostosuj URL do swojego serwera API (np. http://localhost:5000/api/tierlists)
      const response = await fetch("http://localhost:2137/api/tierlists", {
        method: "POST",
        // Nagłówki Content-Type nie są potrzebne dla FormData, przeglądarka ustawi go automatycznie z boundary
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit tier list.");
      }

      await response.json(); // Pobierz odpowiedź JSON (może zawierać ID nowej listy)
      
      setIsLocked(true); // Zablokuj edycję po sukcesie
      alert("Tier list submitted successfully!");

    } catch (err) {
      console.error("Submit failed:", err);
      alert(`Failed to submit tier list: ${err.message || 'Unknown error'}. Try again.`);
    } finally {
      setIsSubmitting(false); // Zawsze zresetuj stan wysyłania
    }
  };

  return (
    // DndProvider musi otaczać wszystko, co używa react-dnd
    <DndProvider backend={HTML5Backend}>
      <div className="flex-grow-1 container">
        <div style={{ marginBottom: "1rem" }}>
          <div className="tier-metadata">
            <input
              type="text"
              placeholder="Tier list title"
              className="tier-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLocked || isSubmitting} // Wyłącz podczas wysyłania
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLocked || isSubmitting}
            />
            <input
              type="text"
              placeholder="Author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={isLocked || isSubmitting}
            />
          </div>

          {/* Konieczne jest przekazanie refa do TierList,
              lub otoczenie TierList w div z tym refem,
              aby html2canvas mógł go "sfotografować" */}
          <div ref={tierListRef} className="tierlist-snapshot-area">
            <TierList
              tiers={tiers}
              setTiers={setTiers}
              setTrayImages={setTrayImages}
              disabled={isLocked || isSubmitting} // Przekaż disabled do TierList
            />
          </div>

          <div className="bottom-buttons">
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
              onClick={handleAddTier}
              disabled={isLocked || isSubmitting}
            >
              + Add Tier
            </button>
            {!isLocked && (
              <button
                onClick={handleLockAndSubmit}
                className="mt-4 px-4 py-2 bg-black text-white rounded submit-btn"
                disabled={isSubmitting} // Wyłącz podczas wysyłania
              >
                {isSubmitting ? 'Submitting...' : 'Lock & Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
      <ImageTray images={trayImages} setImages={setTrayImages} disabled={isLocked || isSubmitting} />
    </DndProvider>
  );
}