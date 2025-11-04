import React, { useState, useContext } from "react";
import {
  Navbar,
  Form,
  FormControl,
  Button,
  Container,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { FaSearch, FaBars, FaTimes, FaUser, FaSignOutAlt, FaHeart, FaMusic } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { AuthContext } from "../context/AuthContext";
import SongList from "../components/Loader";
import { searchMusic } from "../utils/api";
import logo from "../assets/logo.svg";

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
      <Navbar
        expand="lg"
        variant="dark"
        fixed="top"
        className="custom-navbar"
      >
        <Container fluid className="px-3">
          {/* Left Section - Menu & Logo */}
          <div className="d-flex align-items-center">
            {/* Mobile Menu Toggle */}
            <Button
              variant="link"
              className="text-light d-lg-none me-2 p-0"
              onClick={onToggleSidebar}
              style={{ fontSize: "1.5rem" }}
            >
              <FaBars />
            </Button>

            {/* Logo - Show on mobile, hide on desktop */}
            <div className="d-lg-none">
             <img src={logo} alt="Logo" width={160} className="me-2" />
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <Form 
            className="search-form" 
            onSubmit={handleSearch}
          >
            <div className="search-wrapper">
              <FormControl
                type="search"
                placeholder="Search songs, artists..."
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Button
                variant="success"
                type="submit"
                className="search-button"
              >
                <FaSearch />
              </Button>
            </div>
          </Form>

          {/* Right Section - Profile */}
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
                  <span className="user-name d-none d-md-inline">{user.name}</span>
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
        </Container>
      </Navbar>

      {/* Search Results Modal */}
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
              <p className="text-muted">
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

      <style jsx>{`
        .custom-navbar {
          background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.9) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #282828;
          padding: 0.75rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .search-form {
          flex: 1;
          max-width: 500px;
          margin: 0 auto;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .search-input {
          flex: 1;
          background-color: rgba(255,255,255,0.1);
          border: 1px solid #282828;
          border-radius: 20px;
          color: #fff;
          padding: 10px 20px;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          background-color: rgba(255,255,255,0.15);
          border-color: #1DB954;
          color: #fff;
          box-shadow: 0 0 0 3px rgba(29, 185, 84, 0.1);
        }

        .search-input::placeholder {
          color: #b3b3b3;
        }

        .search-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1DB954;
          border: none;
          padding: 0;
        }

        .search-button:hover {
          background-color: #1ed760;
          transform: scale(1.05);
        }

        .user-dropdown-toggle {
          background-color: transparent;
          border: 1px solid #282828;
          border-radius: 25px;
          padding: 6px 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }

        .user-dropdown-toggle:hover {
          background-color: #282828;
          border-color: #3e3e3e;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: 500;
          font-size: 0.9rem;
        }

        .user-dropdown-menu {
          background-color: #282828;
          border: 1px solid #3e3e3e;
          border-radius: 8px;
          min-width: 200px;
          margin-top: 8px;
        }

        .dropdown-item-custom {
          color: #fff;
          padding: 12px 16px;
          transition: all 0.2s ease;
        }

        .dropdown-item-custom:hover {
          background-color: #3e3e3e;
          color: #fff;
        }

        .login-button {
          border-radius: 25px;
          padding: 8px 20px;
          font-weight: 600;
          border: 2px solid #1DB954;
          transition: all 0.2s ease;
        }

        .login-button:hover {
          background-color: #1DB954;
          transform: translateY(-2px);
        }

        .modal-header-custom {
          background-color: #181818;
          border-bottom: 1px solid #282828;
          color: #fff;
        }

        .modal-body-custom {
          background-color: #121212;
          color: #fff;
          max-height: 70vh;
          overflow-y: auto;
        }

        .modal-footer-custom {
          background-color: #181818;
          border-top: 1px solid #282828;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .search-form {
            max-width: 300px;
          }

          .search-input {
            padding: 8px 15px;
            font-size: 0.9rem;
          }

          .search-button {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 576px) {
          .search-form {
            max-width: 200px;
          }

          .search-input {
            padding: 6px 12px;
            font-size: 0.85rem;
          }

          .search-button {
            width: 32px;
            height: 32px;
          }

          .user-avatar {
            width: 28px;
            height: 28px;
          }

          .login-button {
            padding: 6px 15px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}
