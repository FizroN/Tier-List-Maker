// src/App.js
import React, { useState } from 'react';
import './style.css';
import DragDropArea from './DragDropArea';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAutoScrollWhileDragging } from './useAutoScrollWhileDragging';


function App() {

  const [images, setImages] = useState([]);

  const handleAddImage = () => {
    console.log("Clicked + button!");
  };
  useAutoScrollWhileDragging(true);

  return (
    <DndProvider backend={HTML5Backend}>
    <body>
      <div className="body d-flex flex-column min-vh-100">
        <header className="header header_main py-3">
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center">
          {/* Logo */}
          <img src="/logo-tier-list_v1.png" className="logo img-fluid" alt="Logo" />

          {/* Button */}
          <div>
            <button type="button" className="btn btn-outline-light">Go Back</button>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <p style={{ color: 'white' }}>Hello world! (intencjonalnie zostawiłem to tutaj XD)</p>
      <div className="flex-grow-1 container"></div>

        <DragDropArea />

      <footer className="footer footer_main py-3">
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-around align-items-center">
          <p>Bartłomiej Gaweł</p>
          <p>Karol Gawełek</p>
          <p>Sebastian Bochenek</p>
        </div>
      </footer>
      </div>
      </body>
    </DndProvider>
  );
}

export default App;
