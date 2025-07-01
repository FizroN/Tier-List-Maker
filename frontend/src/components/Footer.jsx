// src/components/Footer.jsx
import React from "react";
import '../style.css';
export default function Footer() {
  return (
    <footer className="footer footer_main py-3">
      <div className="container-fluid d-flex flex-column flex-md-row justify-content-around align-items-center">
        <p>Bartłomiej Gaweł</p>
        <p>Karol Gawełek</p>
        <p>Sebastian Bochenek</p>
      </div>
    </footer>
  );
}
