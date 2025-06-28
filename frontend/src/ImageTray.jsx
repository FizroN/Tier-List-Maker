// src/ImageTray.js
import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Plus } from "lucide-react";
import "./ImageTray.css";
import CropModal from "./CropModal";
import CropOverlay from "./CropOverlay";

const ItemTypes = { IMAGE: "image" };

function DraggableImage({ src, index }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.IMAGE,
    item: { src, fromTray: true },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <div
      ref={dragRef}
      className="image-square"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={src} alt={`img-${index}`} />
    </div>
  );
}

export default function ImageTray({ images, setImages }) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleAddImageClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setSelectedImage(reader.result);
    setIsCropping(true);
  };
  reader.readAsDataURL(file);
};
  const handleCropComplete = (cropped) => {
    setImages((prev) => [...prev, cropped]);
    setIsCropping(false);
  };

  return (
    <>
      <div className="image-tray">
        {images.map((src, i) => (
          <DraggableImage key={src} src={src} index={i} />
        ))}

        <div className="image-square add-image" onClick={handleAddImageClick}>
          <Plus size={32} strokeWidth={2.5} />
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
      />

      <CropModal
        imageSrc={selectedImage}
        isOpen={isCropping}
        onClose={() => setIsCropping(false)}
        onCropComplete={handleCropComplete}
      />
      {isCropping && (
        <CropOverlay
          imageSrc={selectedImage}
          onClose={() => setIsCropping(false)}
          onCrop={handleCropComplete}
        />
      )}
    </>
  );
}
