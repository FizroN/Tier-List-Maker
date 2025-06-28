import React from "react";
import { useDrag, useDrop } from "react-dnd";
import "./TierList.css";

const ItemTypes = { IMAGE: "image" };

function TierItem({ src, index, tierName, moveItem }) {
  const ref = React.useRef(null);

  // Drop target
  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(item, monitor) {
      if (item.fromTray) return;              // only reorder existing items
      if (item.tierName !== tierName) return; // only reorder within same tier

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Move the item
      moveItem(dragIndex, hoverIndex);
      item.index = hoverIndex; // update the dragged item's index
    },
  });

  // Drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { src, index, tierName, fromTray: false },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <img
      ref={ref}
      src={src}
      alt=""
      className="tier-item"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    />
  );
}

export default function TierList({ tiers, setTiers, setTrayImages }) {
  return (
    <div className="tierlist-container">
      {Object.entries(tiers).map(([tierName, items]) => (
        <TierRow
          key={tierName}
          tierName={tierName}
          items={items}
          setTiers={setTiers}
          setTrayImages={setTrayImages}
        />
      ))}
    </div>
  );
}

function TierRow({ tierName, items, setTiers, setTrayImages }) {
  // moveItem for reordering within this tier
  const moveItem = (fromIndex, toIndex) => {
    setTiers((prev) => {
      const copy = Array.from(prev[tierName]);
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return { ...prev, [tierName]: copy };
    });
  };

  const [{ isOver }, dropRef] = useDrop({
    accept: ItemTypes.IMAGE,
    drop: (dragged) => {
     const { src, fromTray, tierName: fromTier, index: fromIndex } = dragged;

     // 1) From tray → this tier
     if (fromTray) {
       setTiers((prev) => ({
         ...prev,
         [tierName]: [...prev[tierName], src],
       }));
       setTrayImages((prev) => prev.filter((s) => s !== src));
       return;
     }

     // 2) From another tier → this tier
     if (!fromTray && fromTier !== tierName) {
       // remove from source tier
       setTiers((prev) => {
         const srcList = [...prev[fromTier]];
         srcList.splice(fromIndex, 1);

         // add to destination tier
         const destList = [...prev[tierName], src];
         return {
           ...prev,
           [fromTier]: srcList,
           [tierName]: destList,
         };
       });
       return;
     }
     // else (fromTier === tierName) we handle reorder in hover, so ignore here
   },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="tier-row">
      <div className="tier-label">{tierName}</div>
      <div
        ref={dropRef}
        className="tier-content"
        style={{ backgroundColor: isOver ? "#444" : undefined }}
      >
        {items.map((src, idx) => (
          <TierItem
            key={src}
            src={src}
            index={idx}
            tierName={tierName}
            moveItem={moveItem}
          />
        ))}
      </div>
    </div>
  );
}

