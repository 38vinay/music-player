import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

export default function PlaylistPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { playlists, playTrack, deletePlaylist } = useContext(MusicContext);
  const playlist = playlists.find((p) => p.name === name);

  const handlePlay = (song) => {
    if (playlist) {
      playTrack(song, playlist.tracks);
    }
  };

  const handleDelete = () => {
    deletePlaylist(name);
    navigate("/library");
  };

  if (!playlist) {
    return (
      <Container className="text-white mt-4">
        <h3>Playlist not found</h3>
        <Button variant="outline-light" onClick={() => navigate("/library")}>
          Back to Library
        </Button>
      </Container>
    );
  }

  return (
    <Container className="text-white mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🎵 {playlist.name}</h3>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => navigate("/library")}
          >
            Back
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Playlist
          </Button>
        </div>
      </div>

      {playlist.tracks.length === 0 ? (
        <p className="text-muted">No songs added yet. Add songs from search or home page.</p>
      ) : (
        <Row className="mt-3">
          {playlist.tracks.map((song) => (
            <Col xs={6} md={3} key={song.trackId} className="mb-3">
              <Card
                className="bg-dark text-white h-100"
                onClick={() => handlePlay(song)}
                style={{ 
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <Card.Img 
                  src={song.artworkUrl100.replace("100x100bb", "600x600bb")} 
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="text-truncate" style={{ fontSize: "0.9rem" }}>
                    {song.trackName}
                  </Card.Title>
                  <Card.Text className="text-muted text-truncate" style={{ fontSize: "0.8rem" }}>
                    {song.artistName}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}