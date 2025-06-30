// src/ImageTray.js
import React, { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Plus } from "lucide-react";
import "./ImageTray.css";
import CropModal from "./CropModal";
import CropOverlay from "./CropOverlay";

const ItemTypes = { IMAGE: "image" };

function DraggableImage({ image, index, disabled }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.IMAGE,
    item: { image, fromTray: true },
    canDrag: !disabled,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={dragRef}
      className="image-square"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: disabled ? 'default' : 'grab' }}
    >
      <img src={image.src} alt={`img-${index}`} />
    </div>
  );
}

export default function ImageTray({ images, setImages, disabled }) {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleAddImageClick = () => {
    if (disabled) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleCropComplete = (croppedImage) => {
    const newImage = { id: `${Date.now()}-${Math.random()}`, src: croppedImage };
    setImages((prev) => [...prev, newImage]);
    setIsCropping(false);
  };

  return (
    <>
      <div
        className="image-tray"
        style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'default' : 'auto' }}
      >
        {images.map((img, i) => (
          <DraggableImage key={img.id} image={img} index={i} disabled={disabled} />
        ))}

        {!disabled && (
          <div className="image-square add-image" onClick={handleAddImageClick}>
            <Plus size={32} strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {/* Crop modal and overlay for selected image */}
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
