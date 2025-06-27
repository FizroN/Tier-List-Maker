import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import getCroppedImg from "./CropImage"; // We'll define this below

Modal.setAppElement("#root");

const CropModal = ({ imageSrc, isOpen, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteInternal = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedImage);
    onClose();
  };

  

  return (
    <Modal isOpen={isOpen}
  onRequestClose={onClose}
  overlayClassName="react-modal-overlay"
  className="react-modal-content"
  contentLabel="Crop Image">
      <div style={{ position: "relative", width: "100%", height: "400px" }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteInternal}
        />
      </div>
      <div style={{ marginTop: "1rem", textAlign: "right" }}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleConfirm} style={{ marginLeft: "1rem" }}>
          Crop & Save
        </button>
      </div>
    </Modal>
  );
};

export default CropModal;
