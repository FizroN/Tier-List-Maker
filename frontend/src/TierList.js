import React, { useState } from "react";
import "./TierList.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Initial tier structure
const initialTiers = {
  S: [],
  A: [],
  B: [],
  C: [],
};

// Sample images (placeholder URLs for now)
const initialItems = [
  { id: "1", url: "https://via.placeholder.com/80?text=1" },
  { id: "2", url: "https://via.placeholder.com/80?text=2" },
  { id: "3", url: "https://via.placeholder.com/80?text=3" },
];

// Initially place all images in S tier
initialTiers["S"] = initialItems;

export default function TierList() {
  const [tiers, setTiers] = useState(initialTiers);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceTier = source.droppableId;
    const destTier = destination.droppableId;

    const sourceItems = Array.from(tiers[sourceTier]);
    const [movedItem] = sourceItems.splice(source.index, 1);

    const destItems = Array.from(tiers[destTier]);
    destItems.splice(destination.index, 0, movedItem);

    setTiers({
      ...tiers,
      [sourceTier]: sourceItems,
      [destTier]: destItems,
    });
  };

  return (
    <div className="tierlist-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(tiers).map(([tierName, items]) => (
          <div key={tierName} className="tier-row">
            <div className="tier-label">{tierName}</div>
            <Droppable droppableId={tierName} direction="horizontal">
              {(provided) => (
                <div
                  className="tier-content"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <img
                          src={item.url}
                          alt={`Item ${item.id}`}
                          className="tier-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}