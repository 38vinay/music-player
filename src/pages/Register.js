import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { FaMusic, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container style={{ maxWidth: "450px" }}>
        <Card
          className="shadow-lg"
          style={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #333",
            borderRadius: "20px",
          }}
        >
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <FaMusic size={50} className="text-success mb-3" />
              <h2 className="text-white fw-bold mb-2">Create Account</h2>
              <p className="text-light">Join us and start your music journey</p>
            </div>

            {error && (
              <Alert variant="danger" onClose={() => setError("")} dismissible>
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="text-light">
                  <FaUser className="me-2" />
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-dark text-light border-secondary"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">
                  <FaEnvelope className="me-2" />
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-dark text-light border-secondary"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="text-light">
                  <FaLock className="me-2" />
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-dark text-light border-secondary"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                />
                <Form.Text className="text-light">
                  Must be at least 6 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="text-light">
                  <FaLock className="me-2" />
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-dark text-light border-secondary"
                  style={{
                    borderRadius: "10px",
                    padding: "12px",
                  }}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100 fw-bold"
                disabled={loading}
                style={{
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "1rem",
                  backgroundColor: "#1DB954",
                  border: "none",
                }}
              >
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <p className="text-light mb-0">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-success fw-bold"
                  style={{ textDecoration: "none" }}
                >
                  Login here
                </Link>
              </p>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/"
                className="text-light"
                style={{ textDecoration: "none", fontSize: "0.9rem" }}
              >
                Continue as Guest →
              </Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}