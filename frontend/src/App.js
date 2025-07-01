// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import CreatorPage from "./pages/CreatorPage";
import ViewerPage from "./pages/ViewerPage";
import './style.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/create" element={<CreatorPage />} />
          <Route path="/view/:id" element={<ViewerPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
