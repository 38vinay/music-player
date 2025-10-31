import React, { useContext } from "react";
import { Nav } from "react-bootstrap";
import logo from "../assets/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBookmark, FaHeart, FaTimes } from "react-icons/fa";
import { MusicContext } from "../context/MusicContext";

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { playlists } = useContext(MusicContext);

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    // Close sidebar on mobile when clicking a nav item
    if (onClose && window.innerWidth < 992) {
      onClose();
    }
  };

  return (
    <div className="sidebar-container">
      {/* Mobile Close Button */}
      {onClose && (
        <div className="d-lg-none d-flex justify-content-end p-3">
          <button
            onClick={onClose}
            className="btn btn-link text-white"
            style={{ fontSize: "1.5rem" }}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Logo Section */}
      <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" width={160} className="me-2" />
          </div>


      {/* Main Navigation */}
      <Nav className="flex-column px-3 mt-3">
        <Nav.Link
          as={Link}
          to="/"
          onClick={handleNavClick}
          className={`sidebar-nav-link ${isActive("/") ? "active" : ""}`}
        >
          <FaHome className="me-3" size={20} />
          <span>Home</span>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/liked"
          onClick={handleNavClick}
          className={`sidebar-nav-link ${isActive("/liked") ? "active" : ""}`}
        >
          <FaHeart className="me-3" size={20} />
          <span>Liked Songs</span>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/library"
          onClick={handleNavClick}
          className={`sidebar-nav-link ${isActive("/library") ? "active" : ""}`}
        >
          <FaBookmark className="me-3" size={20} />
          <span>Your Library</span>
        </Nav.Link>
      </Nav>

      {/* Divider */}
      <hr className="mx-3 my-3" style={{ borderColor: "#282828" }} />

      {/* Playlists Section */}
      <div className="px-3">
        <h6 className="text-muted text-uppercase px-3 mb-3" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
          Playlists
        </h6>
        
        {playlists.length === 0 ? (
          <p className="text-muted px-3" style={{ fontSize: "0.85rem" }}>
            No playlists yet
          </p>
        ) : (
          <Nav className="flex-column playlist-nav">
            {playlists.map((playlist, idx) => (
              <Nav.Link
                key={idx}
                as={Link}
                to={`/playlist/${playlist.name}`}
                onClick={handleNavClick}
                className={`playlist-link ${
                  location.pathname === `/playlist/${playlist.name}` ? "active" : ""
                }`}
              >
                <span className="playlist-icon">🎵</span>
                <span className="playlist-name">{playlist.name}</span>
                <span className="playlist-count">({playlist.tracks.length})</span>
              </Nav.Link>
            ))}
          </Nav>
        )}
      </div>

      <style jsx>{`
        .sidebar-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: #000;
          overflow-y: auto;
        }

        .sidebar-nav-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 8px;
          border-radius: 8px;
          color: #b3b3b3;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .sidebar-nav-link:hover {
          color: #fff;
          background-color: #282828;
        }

        .sidebar-nav-link.active {
          color: #fff;
          background-color: #282828;
        }

        .playlist-link {
          display: flex;
          align-items: center;
          padding: 10px 16px;
          margin-bottom: 4px;
          border-radius: 6px;
          color: #b3b3b3;
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .playlist-link:hover {
          color: #fff;
          background-color: #1a1a1a;
        }

        .playlist-link.active {
          color: #1DB954;
          background-color: #1a1a1a;
        }

        .playlist-icon {
          margin-right: 10px;
          font-size: 1rem;
        }

        .playlist-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .playlist-count {
          margin-left: 8px;
          font-size: 0.75rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .sidebar-nav-link {
            padding: 14px 16px;
            font-size: 1rem;
          }

          .playlist-link {
            padding: 12px 16px;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}