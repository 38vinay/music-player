import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MusicProvider } from "./context/MusicContext";
import { AuthProvider } from "./context/AuthContext";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Home from "./pages/Home";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import PlaylistPage from "./pages/PlaylistPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AuthProvider>
      <MusicProvider>
        <Router>
          <Routes>
            {/* Auth Routes - Full Screen */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Main App Routes */}
            <Route
              path="/*"
              element={
                <div className="app-container">
                  {/* Desktop Sidebar */}
                  <div className="sidebar-desktop">
                    <Sidebar />
                  </div>

                  {/* Mobile Sidebar with overlay */}
                  <div
                    className={`sidebar-mobile ${sidebarOpen ? "open" : ""}`}
                  >
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                  </div>

                  {/* Overlay for mobile */}
                  {sidebarOpen && (
                    <div
                      className="sidebar-overlay"
                      onClick={toggleSidebar}
                    />
                  )}

                  {/* Main Content Area */}
                  <div className="main-content">
                    {/* Navbar */}
                    <AppNavbar onToggleSidebar={toggleSidebar} />

                    {/* Page Content */}
                    <div className="page-content">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/liked" element={<LikedSongs />} />
                        <Route path="/playlist/:name" element={<PlaylistPage />} />
                      </Routes>
                    </div>
                  </div>

                  {/* Bottom Player */}
                  <Player />
                </div>
              }
            />
          </Routes>
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;