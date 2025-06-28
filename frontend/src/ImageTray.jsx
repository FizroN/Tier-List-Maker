import React, { useRef, useState } from "react";
import { Plus } from "lucide-react";
import "./ImageTray.css";
import CropModal from "./CropModal";
import CropOverlay from "./CropOverlay";

const ImageTray = ({ initialImages = [] }) => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState(initialImages);
  const [selectedImage, setSelectedImage] = useState(null); // for cropping
  const [isCropping, setIsCropping] = useState(false);       // modal toggle
  

  const handleAddImageClick = () => {
    fileInputRef.current.click();
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
  // Replace with actual cropped data later
  setImages((prev) => [...prev, croppedImage]);
  setSelectedImage(null);
  setIsCropping(false);
};

  return (
    <div className="image-tray">
      {images.map((imgSrc, index) => (
        <div className="image-square" key={index}>
          <img src={imgSrc} alt={`img-${index}`} />
        </div>
      ))}

      <div className="image-square add-image" onClick={handleAddImageClick}>
        <Plus size={32} strokeWidth={2.5} />
      </div>

      {/* Hidden input for file selection */}
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
    </div>
  );
};

export default ImageTray;
