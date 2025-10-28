import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar bg-black text-white vh-100 p-3 position-fixed">
      <h4 className="mb-4">NoSkip Music</h4>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
        <Nav.Link as={Link} to="/search" className="text-white">Search</Nav.Link>
        <Nav.Link as={Link} to="/library" className="text-white">Your Library</Nav.Link>
      </Nav>
    </div>
  );
}
