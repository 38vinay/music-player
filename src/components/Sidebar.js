import React, { useContext } from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBookmark, FaHeart } from "react-icons/fa";
import { MusicContext } from "../context/MusicContext";

export default function Sidebar() {
  const location = useLocation();
  const { playlists } = useContext(MusicContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className="sidebar bg-black text-white vh-100 p-4 position-fixed"
      style={{
        width: "250px",
        overflowY: "auto",
        borderRight: "1px solid #222",
      }}
    >
      {/* Main Navigation */}
      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/"
          className={`text-white d-flex align-items-center mb-2 ${
            isActive("/") ? "bg-secondary bg-opacity-25" : ""
          }`}
          style={{
            borderRadius: "8px",
            padding: "12px 16px",
            transition: "background 0.2s",
          }}
        >
          <FaHome className="me-3" />
          Home
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/liked"
          className={`text-white d-flex align-items-center mb-2 ${
            isActive("/liked") ? "bg-secondary bg-opacity-25" : ""
          }`}
          style={{
            borderRadius: "8px",
            padding: "12px 16px",
            transition: "background 0.2s",
          }}
        >
          <FaHeart className="me-3" />
          Liked Songs
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/library"
          className={`text-white d-flex align-items-center mb-4 ${
            isActive("/library") ? "bg-secondary bg-opacity-25" : ""
          }`}
          style={{
            borderRadius: "8px",
            padding: "12px 16px",
            transition: "background 0.2s",
          }}
        >
          <FaBookmark className="me-3" />
          Your Library
        </Nav.Link>
      </Nav>

      {/* Playlists Section */}
      <div className="mt-4">
        <h6 className="text-light text-uppercase px-3 mb-3" style={{ fontSize: "0.75rem" }}>
          Playlists
        </h6>
        {playlists.length === 0 ? (
          <p className="text-light px-3" style={{ fontSize: "0.85rem" }}>
            No playlists yet
          </p>
        ) : (
          <Nav className="flex-column">
            {playlists.map((playlist, idx) => (
              <Nav.Link
                key={idx}
                as={Link}
                to={`/playlist/${playlist.name}`}
                className={`text-white d-flex align-items-center mb-1 ${
                  location.pathname === `/playlist/${playlist.name}`
                    ? "bg-secondary bg-opacity-25"
                    : ""
                }`}
                style={{
                  borderRadius: "8px",
                  padding: "10px 16px",
                  transition: "background 0.2s",
                  fontSize: "0.9rem",
                }}
              >
                🎵 {playlist.name}
              </Nav.Link>
            ))}
          </Nav>
        )}
      </div>
    </div>
  );
}