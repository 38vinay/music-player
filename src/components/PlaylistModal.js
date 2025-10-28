import React, { useState, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { MusicContext } from "../context/MusicContext";

export default function PlaylistModal({ show, handleClose }) {
  const [playlistName, setPlaylistName] = useState("");
  const { createPlaylist } = useContext(MusicContext);

  const handleCreate = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName);
      setPlaylistName("");
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="success" onClick={handleCreate}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
}
