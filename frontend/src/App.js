import React from 'react';
import './style.css';

function App() {
  return (
    <div className="body d-flex flex-column min-vh-100">
      <header className="header header_main py-3">
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center">
          {/* Logo */}
          <img src="/logo-tier-list_v1.png" className="logo img-fluid" alt="Logo" />

          {/* Buttons */}
          <div>
            <button type="button" className="btn btn-outline-light me-2">Log In</button>
            <button type="button" className="btn btn-outline-light">Go Back</button>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <p style={{ color: 'white' }}>Hello world!</p>
      <div className="flex-grow-1 container"></div>

      <footer className="footer footer_main py-3">
        <div className="container-fluid d-flex flex-column flex-md-row justify-content-around align-items-center">
          <p>Bartłomiej Gaweł</p>
          <p>Karol Gawełek</p>
          <p>Sebastian Bochenek</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
