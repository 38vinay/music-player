import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import "./ToastManager.css"; // add CSS for animations

export default function ToastManager({ message, show, onClose, type = "success" }) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 2500); // visible for 2.5 sec
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <ToastContainer
      className="p-3 toast-slide-in"
      style={{
        position: "fixed",
        bottom: "90px",
        right: "30px",
        zIndex: 2000,
        transition: "transform 0.3s ease, opacity 0.3s ease",
      }}
    >
      <Toast
        bg={type === "error" ? "danger" : "dark"}
        onClose={() => {
          setVisible(false);
          onClose();
        }}
        show={visible}
        autohide
        delay={2500}
        className="text-center shadow-lg border border-success toast-animate"
      >
        <Toast.Body className="text-white fw-semibold px-4 py-2">
          {type === "error" ? "❌ " : "✅ "}
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
