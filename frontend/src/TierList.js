// src/TierList.js
import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { SketchPicker } from "react-color";
import "./TierList.css";

const ItemTypes = { IMAGE: "image" };

// A draggable, sortable image within a tier
function TierItem({ image, index, tierId, moveItem, disabled }) {
  const ref = React.useRef(null);

  // Allow reordering within the same tier only if not disabled
  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(item) {
      if (disabled) return;
      if (item.fromTray) return;
      if (item.tierId !== tierId) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Make it draggable only if not disabled
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { image, index, tierId, fromTray: false },
    canDrag: !disabled,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));
  return (
    <img
      ref={ref}
      src={image.src}
      alt=""
      className="tier-item"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: disabled ? 'default' : 'move' }}
    />
  );
}

// The list of all tiers
export default function TierList({ tiers, setTiers, setTrayImages, disabled }) {
  return (
    <div className="tierlist-container">
      {tiers.map((tier) => (
        <TierRow
          key={tier.id}
          tier={tier}
          setTiers={setTiers}
          setTrayImages={setTrayImages}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// A single row (tier)
function TierRow({ tier, setTiers, setTrayImages, disabled }) {
  const { id: tierId, name, color, images } = tier;
  const [showColorPicker, setShowColorPicker] = useState(false);

  const toggleColorPicker = () => {
    if (disabled) return;
    setShowColorPicker((prev) => !prev);
  };

  const changeColor = (newColor) => {
    if (disabled) return;
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId ? { ...t, color: newColor.hex } : t
      )
    );
  };

  const changeName = (e) => {
    if (disabled) return;
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId ? { ...t, name: e.target.value } : t
      )
    );
  };

  const deleteTier = () => {
    if (disabled) return;
    setTiers((prev) => prev.filter((t) => t.id !== tierId));
  };

  // Reorder within this tier
  const moveItem = (fromIndex, toIndex) => {
    setTiers((prev) =>
      prev.map((t) =>
        t.id === tierId
          ? {
              ...t,
              images: (() => {
                const copy = [...t.images];
                const [moved] = copy.splice(fromIndex, 1);
                copy.splice(toIndex, 0, moved);
                return copy;
              })(),
            }
          : t
      )
    );
  };

  // Handle drops from tray or other tiers
  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.IMAGE,
    drop: (dragged) => {
      if (disabled) return;
      const { image, fromTray, tierId: fromTier, index: fromIndex } = dragged;
      const { id, src } = image;

      // From tray → this tier
      if (fromTray) {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === tierId ? { ...t, images: [...t.images, image] } : t
          )
        );
        setTrayImages((prev) => prev.filter((img) => img.id !== id));
        return;
      }

      // From another tier → this tier
      if (!fromTray && fromTier !== tierId) {
        setTiers((prev) =>
          prev.map((t) => {
            if (t.id === fromTier) {
              const copy = [...t.images];
              copy.splice(fromIndex, 1);
              return { ...t, images: copy };
            }
            if (t.id === tierId) {
              return { ...t, images: [...t.images, image] };
            }
            return t;
          })
        );
        return;
      }
      // Same-tier reorder handled in hover
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  return (
    <div className="tier-row">
      <div className="tier-left-controls">
        <button
          className="delete-tier-button"
          onClick={deleteTier}
          title="Delete tier"
          disabled={disabled}
        >
          ❌
        </button>
      </div>

      <div
        className="tier-label"
        style={{ backgroundColor: color, color: "#fff", position: "relative", cursor: disabled ? 'default' : 'pointer' }}
        onClick={toggleColorPicker}
      >
        <input
          type="text"
          value={name}
          onChange={changeName}
          readOnly={disabled}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.2em",
            width: "100%",
            outline: "none",
            textAlign: "center",
            cursor: disabled ? 'default' : 'text'
          }}
        />
        {showColorPicker && (
          <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 5 }}>
            <SketchPicker color={color} onChange={changeColor} />
          </div>
        )}
      </div>

      <div
        ref={dropRef}
        className="tier-content"
        style={{
          backgroundColor: isOver ? "#444" : "#333",
        }}
      >
        {images.map((img, idx) => (
          <TierItem
            key={img.id}
            image={img}
            index={idx}
            tierId={tierId}
            moveItem={moveItem}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
