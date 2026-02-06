# Tier List Maker 🏆📊

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-5.0-black?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

A full-stack web application designed for creating, customizing, and sharing tier lists. The project features a drag-and-drop interface, image manipulation tools, and a persistent backend for saving user creations.

## 🚀 Features

* **Interactive Tier Creator:**
    * **Drag & Drop:** Smooth item placement using `react-dnd`.
    * **Customization:** Add new rows, change colors, and rename tiers dynamically.
    * **Image Upload & Crop:** Built-in tool (`react-easy-crop`) to upload and precisely crop images for tier items.
* **Snapshot Generation:** Automatically generates and saves a screenshot of the finished tier list using `html2canvas`.
* **Gallery Mode:** Browse a list of all created tier lists with their generated snapshots.
* **Robust Backend:**
    * **SQLite Database:** Lightweight and serverless storage for tier list metadata.
    * **File Storage:** Efficient handling of uploaded assets and generated snapshots via `multer`.

## 📸 Screenshots

| Create Tier List | Crop Images |
| :---: | :---: |
| ![Create](Screenshots/tworzenie_nowej_tier_listy1.png) | ![Crop](Screenshots/tworzenie_nowej_tier_listy3.png) |

| Main Dashboard | Completed List |
| :---: | :---: |
| ![Dashboard](Screenshots/widok_strony_głównej.png) | ![Result](Screenshots/fragment_strony_z_widokiem_na_gotową_tier_listę.png) |

## 🛠️ Tech Stack

### Frontend
* **Framework:** React (Create React App)
* **State & Routing:** React Router DOM
* **Drag & Drop:** React DnD
* **Utilities:** Html2Canvas, React Easy Crop, Lucide React (Icons)

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** SQLite3
* **Middleware:** CORS, Multer (for file uploads)

## 📥 Getting Started

The project is divided into two parts: `frontend` and `backend`. Both need to be running simultaneously.

### Prerequisites
* Node.js (v16 or higher)
* npm

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
