// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../style.css";

export default function Layout({ children }) {
  return (
    <body>
    <div className="body d-flex flex-column min-vh-100">
      {/* exactly as before: */}
      <Header />
      
      {/* don’t introduce a `.container` here if your old App didn’t */}
      {/* just render the page’s own wrapper */}
      <main className="flex-grow-1">
        {children}
      </main>
      
      <Footer />
    </div>
    </body>
  );
}
