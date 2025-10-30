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
        bg="black"
        variant="dark"
        fixed="top"
        className="px-3 py-2 shadow-sm"
        style={{
          borderBottom: "1px solid #222",
          zIndex: 1050,
        }}
      >
        <Container fluid className="d-flex align-items-center justify-content-between">
          {/* Sidebar Toggle Button (mobile view) */}
          <Button
            variant="link"
            className="text-light d-lg-none me-2"
            onClick={onToggleSidebar}
            style={{ fontSize: "1.4rem" }}
          >
            <FaBars />
          </Button>

          {/* Logo */}
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" width={160} className="me-2" />
          </div>

          {/* Search Bar */}
          <Form className="d-flex mx-auto" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search songs, artists..."
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="me-2 bg-dark text-light border-0"
              style={{
                width: "280px",
                borderRadius: "20px",
                boxShadow: "inset 0 0 5px rgba(255,255,255,0.1)",
              }}
            />
            <Button
              variant="success"
              type="submit"
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ backgroundColor: "#1DB954", border: "none" }}
            >
              <FaSearch />
            </Button>
          </Form>

          {/* Profile / Right side */}
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="dark"
                  id="user-dropdown"
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #333",
                    borderRadius: "25px",
                    padding: "8px 15px",
                  }}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      marginRight: 8,
                    }}
                  />
                  <span className="d-none d-md-inline">{user.name}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="bg-dark border-secondary"
                  style={{ minWidth: "200px" }}
                >
                  <Dropdown.Item
                    className="text-light"
                    onClick={() => navigate("/liked")}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <FaHeart className="me-2 text-danger" />
                    Liked Songs
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-light"
                    onClick={() => navigate("/library")}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <FaMusic className="me-2 text-success" />
                    Your Library
                  </Dropdown.Item>
                  <Dropdown.Divider className="bg-secondary" />
                  <Dropdown.Item
                    className="text-danger"
                    onClick={logout}
                    style={{ backgroundColor: "transparent" }}
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
                style={{
                  borderRadius: "25px",
                  padding: "8px 20px",
                  fontWeight: "600",
                }}
              >
                <FaUser className="me-2" />
                Login
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
        <Modal.Header
          closeButton
          className="bg-dark text-light border-0"
          style={{ borderBottom: "1px solid #333" }}
        >
          <Modal.Title>
            <FaSearch className="me-2" />
            Search Results for "{searchQuery}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="bg-dark text-light"
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
            paddingBottom: "20px",
          }}
        >
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
        <Modal.Footer className="bg-dark border-0" style={{ borderTop: "1px solid #333" }}>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}