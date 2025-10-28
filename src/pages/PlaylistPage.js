import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

export default function PlaylistPage() {
  const { name } = useParams();
  const { playlists, playTrack, deletePlaylist } = useContext(MusicContext);
  const playlist = playlists.find((p) => p.name === name);

  if (!playlist) return <Container className="text-white mt-4">Playlist not found</Container>;

  return (
    <Container className="text-white mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3>{playlist.name}</h3>
        <Button variant="danger" onClick={() => deletePlaylist(name)}>
          Delete Playlist
        </Button>
      </div>

      {playlist.tracks.length === 0 ? (
        <p>No songs added yet.</p>
      ) : (
        <Row className="mt-3">
          {playlist.tracks.map((song) => (
            <Col xs={6} md={3} key={song.trackId}>
              <Card
                className="bg-dark text-white mb-3"
                onClick={() => playTrack(song)}
              >
                <Card.Img src={song.artworkUrl100} />
                <Card.Body>
                  <Card.Title>{song.trackName}</Card.Title>
                  <Card.Text>{song.artistName}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
