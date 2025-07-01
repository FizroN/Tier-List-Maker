// src/components/Header.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../style.css';

export default function Header() {
    const location = useLocation();
  const navigate = useNavigate();

  const onHome = location.pathname === "/";

    return (
    <header className="header header_main py-3">
      <div className="container-fluid d-flex flex-column flex-md-row justify-content-between align-items-center">
        <Link to="/">
          <img src="/logo-tier-list_v1.png" className="logo img-fluid" alt="Logo" />
        </Link>
        {onHome ? (
          <Link to="/create" className="btn btn-outline-light">
            Create New List
          </Link>
        ) : (
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        )}
      </div>
    </header>
  );
}
