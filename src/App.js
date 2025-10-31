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
                <div className="d-flex">
                  {/* Sidebar - Always visible on desktop, toggle on mobile */}
                  <div
                    className="d-none d-lg-block"
                    style={{
                      position: "fixed",
                      left: 0,
                      marginTop:"70px",
                      top: 0,
                      bottom: 0,
                      width: "100px",
                      zIndex: 1040,
                    }}
                  >
                    <Sidebar />
                  </div>

                  {/* Mobile Sidebar (toggled) */}
                  <div
                    className={`d-lg-none`}
                    style={{
                      position: "fixed",
                      left: sidebarOpen ? 0 : "-250px",
                      top: 0,
                      bottom: 0,
                      width: "250px",
                      transition: "left 0.3s ease",
                      zIndex: 1040,
                    }}
                  >
                    <Sidebar />
                  </div>

                  {/* Overlay for mobile when sidebar is open */}
                  {sidebarOpen && (
                    <div
                      className="sidebar-overlay d-lg-none"
                      onClick={toggleSidebar}
                      style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 1030,
                      }}
                    />
                  )}

                  {/* Main Content */}
                  <div
                    style={{
                      marginLeft: "250px",
                      paddingTop:"20px",
                      paddingBottom: "120px",
                      width:"100%",
                      height:"100vh",
                      background:"black",
                    }}
                  >
                    {/* Navbar */}
                    <AppNavbar onToggleSidebar={toggleSidebar} />

                    {/* Page Content */}
                    <div className="container-fluid bg-black px-4" style={{ paddingTop: "80px" }}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/liked" element={<LikedSongs />} />
                        <Route path="/playlist/:name" element={<PlaylistPage />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>

          {/* Bottom Player */}
          <Player />
        </Router>
      </MusicProvider>
    </AuthProvider>
  );
}

export default App;