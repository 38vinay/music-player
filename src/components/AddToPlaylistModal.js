import React, { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { MusicContext } from "../context/MusicContext";

export default function AddToPlaylistModal({ show, handleClose, song, onAdded }) {
  const { playlists, addToPlaylist } = useContext(MusicContext);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const handleAdd = () => {
    if (selectedPlaylist) {
      addToPlaylist(selectedPlaylist, song);
      if (onAdded) onAdded(selectedPlaylist);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add to Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {playlists.length === 0 ? (
          <p className="text-muted">No playlists yet. Create one first.</p>
        ) : (
          <Form.Select
            value={selectedPlaylist}
            onChange={(e) => setSelectedPlaylist(e.target.value)}
          >
            <option value="">Select a playlist</option>
            {playlists.map((p, idx) => (
              <option key={idx} value={p.name}>
                {p.name}
              </option>
            ))}
          </Form.Select>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleAdd} disabled={!selectedPlaylist}>
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
