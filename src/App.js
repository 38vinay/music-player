import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { MusicProvider } from "./context/MusicContext";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Liked from "./pages/LikedSongs";

function App() {
  return (
    <MusicProvider>
      <Router>
        <div
          className="app-container"
          style={{
            backgroundColor: "#121212",
            minHeight: "100vh",
            color: "white",
            overflowX: "hidden",
          }}
        >
          {/* Top Navbar */}
          <AppNavbar />

          <div className="d-flex">
            {/* Sidebar */}
            <div className="d-none d-md-block">
              <Sidebar />
            </div>

            {/* Main Content Area */}
            <div
              className="flex-grow-1 p-4"
              style={{
                marginLeft: "220px",
                paddingBottom: "100px", // space for bottom player
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/liked" element={<Liked />} />
              </Routes>
            </div>
          </div>

          {/* Bottom Music Player */}
          <Player />
        </div>
      </Router>
    </MusicProvider>
  );
}

export default App;
