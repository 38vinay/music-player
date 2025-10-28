import React from "react";
import {
  Navbar,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { FaSearch, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo .svg";

export default function AppNavbar({ onSearch, onToggleSidebar }) {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      onSearch(query);
      navigate("/search");
    }
  };

  return (
    <Navbar
      expand="lg"
      bg="black"
      variant="dark"
      className="px-3 py-2 shadow-sm sticky-top"
      style={{
        borderBottom: "1px solid #222",
        zIndex: 1000,
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

        {/* Profile Button (optional) */}
        <div className="d-none d-lg-block text-light fw-semibold">
          <span>👤 User</span>
        </div>
      </Container>
    </Navbar>
  );
}
