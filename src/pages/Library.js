import React, { useContext, useState } from "react";
import { MusicContext } from "../context/MusicContext";
import PlaylistModal from "../components/PlaylistModal";
import { Button } from "react-bootstrap";

export default function Library() {
  const { playlists, playTrack, deletePlaylist } = useContext(MusicContext);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="text-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🎶 Your Library</h3>
        <Button variant="success" onClick={() => setShowModal(true)}>+ Create Playlist</Button>
      </div>

      {playlists.length === 0 ? (
        <p className="text-muted">No playlists yet. Create one!</p>
      ) : (
        playlists.map((p, idx) => (
          <div key={idx} className="mb-4 p-3 bg-dark rounded">
            <div className="d-flex justify-content-between align-items-center">
              <h5>{p.name}</h5>
              <Button variant="outline-danger" size="sm" onClick={() => deletePlaylist(p.name)}>
                Delete
              </Button>
            </div>
            {p.tracks.length === 0 ? (
              <p className="text-muted mt-2">No songs added yet.</p>
            ) : (
              <div className="row mt-2">
                {p.tracks.map((song) => (
                  <div key={song.trackId} className="col-md-3 mb-3">
                    <div
                      className="card bg-secondary text-light h-100"
                      onClick={() => playTrack(song)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={song.artworkUrl100} className="card-img-top" alt={song.trackName} />
                      <div className="card-body">
                        <h6 className="text-truncate">{song.trackName}</h6>
                        <small>{song.artistName}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <PlaylistModal show={showModal} handleClose={() => setShowModal(false)} />
    </div>
  );
}
