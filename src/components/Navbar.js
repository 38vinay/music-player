import React, { useState, useContext } from "react";
import {
  Navbar,
  Form,
  FormControl,
  Button,
  Modal,
  Dropdown,
} from "react-bootstrap";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHeart,
  FaMusic,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { AuthContext } from "../context/AuthContext";
import SongList from "../components/Loader";
import { searchMusic } from "../utils/api";

export default function AppNavbar({ onToggleSidebar }) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { playTrack } = useContext(MusicContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setShowSearchModal(true);
    setIsSearching(true);

    try {
      const data = await searchMusic(query);
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCloseModal = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handlePlayFromModal = (track) => {
    playTrack(track, searchResults);
  };

  return (
    <>
      <Navbar expand="lg" variant="dark" fixed="top" className="custom-navbar">
        <div className="navbar-container d-flex align-items-center justify-content-between px-3 w-100">
          {/* Left Section - Menu & Logo */}
          <div className="d-flex align-items-center">
            <Button
              variant="link"
              className="text-light d-lg-none me-2 p-0 menu-toggle"
              onClick={onToggleSidebar}
            >
              <FaBars />
            </Button>
          </div>

          {/* Center Section - Search Bar */}
          <Form className="search-form mx-auto" onSubmit={handleSearch}>
            <div className="search-wrapper">
              <FormControl
                type="search"
                placeholder="Search songs, artists..."
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Button variant="success" type="submit" className="search-button">
                <FaSearch />
              </Button>
            </div>
          </Form>

          {/* Right Section - User / Login */}
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  id="user-dropdown"
                  className="user-dropdown-toggle"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                  />
                  <span className="user-name d-none d-md-inline">
                    {user.name}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="user-dropdown-menu">
                  <Dropdown.Item
                    className="dropdown-item-custom"
                    onClick={() => navigate("/liked")}
                  >
                    <FaHeart className="me-2 text-danger" />
                    Liked Songs
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="dropdown-item-custom"
                    onClick={() => navigate("/library")}
                  >
                    <FaMusic className="me-2 text-success" />
                    Your Library
                  </Dropdown.Item>
                  <Dropdown.Divider className="bg-secondary" />
                  <Dropdown.Item
                    className="dropdown-item-custom text-danger"
                    onClick={logout}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                variant="outline-success"
                onClick={() => navigate("/login")}
                className="login-button"
              >
                <FaUser className="me-2 d-none d-sm-inline" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </Navbar>

      {/* Search Modal */}
      <Modal
        show={showSearchModal}
        onHide={handleCloseModal}
        size="xl"
        centered
        className="search-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>
            <FaSearch className="me-2" />
            Search Results for "{searchQuery}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          {isSearching ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Searching...</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-5">
              <FaTimes size={48} className="text-muted mb-3" />
              <p className="text-light">
                No results found. Try a different search term.
              </p>
            </div>
          ) : (
            <SongList songs={searchResults} onPlay={handlePlayFromModal} />
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Responsive CSS */}
      <style jsx>{`
        /* 🌟 NAVBAR STYLING - Matches Home.jsx look */
        .custom-navbar {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.9) 100%
          );
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #282828;
          padding: clamp(8px, 2vw, 16px) clamp(10px, 4vw, 30px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          z-index: 1030;
        }

        .navbar-container {
          padding-left: clamp(8px, 4vw, 30px);
          padding-right: clamp(8px, 4vw, 30px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          overflow-x: hidden;
          width: 100%;
        }

        .menu-toggle {
          font-size: 1.6rem;
          color: #fff;
          margin-right: clamp(6px, 1vw, 12px);
        }

        /* 🔍 SEARCH BAR CENTER */
        .search-form {
          flex: 1;
          max-width: clamp(260px, 45vw, 500px);
          margin: 0 auto;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: clamp(6px, 1vw, 10px);
          flex: 1;
        }

        .search-input {
          flex: 1;
          background-color: rgba(255, 255, 255, 0.08);
          border: 1px solid #333;
          border-radius: 25px;
          color: #fff !important;          /* force visible text */
          caret-color: #1db954 !important; /* green cursor */
          padding: clamp(6px, 1.5vw, 12px) clamp(14px, 3vw, 20px);
          font-size: clamp(0.85rem, 2vw, 1rem);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: #1db954;
          box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.25);
          color: #fff !important;
          caret-color: #1db954 !important;
        }

        .search-input::placeholder {
          color: #b3b3b3;
        }

        .search-button {
          width: clamp(32px, 6vw, 42px);
          height: clamp(32px, 6vw, 42px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1db954;
          border: none;
          color: white;
          font-size: clamp(0.85rem, 2vw, 1rem);
          transition: 0.3s ease;
          box-shadow: 0 2px 8px rgba(29, 185, 84, 0.4);
        }

        .search-button:hover {
          background-color: #1ed760;
          transform: scale(1.05);
        }

        /* 👤 USER / LOGIN SECTION */
        .user-dropdown-toggle {
          background-color: transparent;
          border: 1px solid #333;
          border-radius: 30px;
          padding: clamp(4px, 1vw, 8px) clamp(10px, 2vw, 15px);
          display: flex;
          align-items: center;
          gap: clamp(6px, 1vw, 10px);
          transition: all 0.3s ease;
        }

        .user-dropdown-toggle:hover {
          background-color: rgba(255, 255, 255, 0.05);
          border-color: #444;
        }

        .user-avatar {
          width: clamp(28px, 6vw, 34px);
          height: clamp(28px, 6vw, 34px);
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: 500;
          font-size: clamp(0.8rem, 2vw, 0.95rem);
          color: #fff;
        }

        .user-dropdown-menu {
          background-color: #181818;
          border: 1px solid #282828;
          border-radius: 10px;
          padding: 5px 0;
          min-width: 200px;
        }

        .dropdown-item-custom {
          color: #fff;
          padding: 12px 16px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .dropdown-item-custom:hover {
          background-color: #282828;
          color: #fff;
        }

        .login-button {
          border-radius: 25px;
          padding: clamp(6px, 1vw, 10px) clamp(15px, 3vw, 22px);
          font-weight: 600;
          border: 2px solid #1db954;
          background: transparent;
          color: #1db954;
          font-size: clamp(0.8rem, 2vw, 0.95rem);
          transition: all 0.3s ease;
        }

        .login-button:hover {
          background-color: #1db954;
          color: #fff;
          transform: translateY(-2px);
        }

        /* 🎵 SEARCH MODAL */
        .modal-header-custom {
          background-color: #181818;
          border-bottom: 1px solid #282828;
          color: #fff;
          padding: clamp(10px, 2vw, 20px);
        }

        .modal-body-custom {
          background-color: #121212;
          color: #fff;
          max-height: 70vh;
          overflow-y: auto;
          padding: clamp(10px, 3vw, 24px);
        }

        .modal-footer-custom {
          background-color: #181818;
          border-top: 1px solid #282828;
          padding: clamp(10px, 2vw, 20px);
        }

        /* 📱 RESPONSIVE LAYOUTS */
        @media (max-width: 768px) {
          .search-form {
            max-width: 60vw;
          }
        }

        @media (max-width: 576px) {
          .custom-navbar {
            padding: clamp(6px, 2vw, 10px) clamp(8px, 3vw, 16px);
          }

          .search-form {
            max-width: 55vw;
          }

          .search-wrapper {
            flex: 1;
          }

          .login-button {
            padding: 5px 10px;
            font-size: 0.75rem;
          }

          .user-name {
            display: none;
          }

          .user-avatar {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </>
  );
}
