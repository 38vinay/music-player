import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MusicContext } from "../context/MusicContext";
import { Container, Button } from "react-bootstrap";
import { FaArrowLeft, FaTrash, FaTimes, FaMusic } from "react-icons/fa";
import ToastManager from "../components/ToastManager";

export default function PlaylistPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { playlists, playTrack, deletePlaylist, removeFromPlaylist } = useContext(MusicContext);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  
  const playlist = playlists.find((p) => p.name === name);

  const handlePlay = (song) => {
    if (playlist) {
      playTrack(song, playlist.tracks);
    }
  };

  const handleDelete = () => {
    deletePlaylist(name);
    setToastMsg(`Deleted playlist "${name}" 🗑️`);
    setShowToast(true);
    setTimeout(() => {
      navigate("/library");
    }, 1000);
  };

  const handleRemoveSong = (songId, songName, e) => {
    e.stopPropagation();
    removeFromPlaylist(name, songId);
    setToastMsg(`Removed "${songName}" from playlist 🗑️`);
    setShowToast(true);
  };

  if (!playlist) {
    return (
      <Container className="text-white mt-4">
        <div className="not-found-container">
          <FaMusic size={80} className="text-muted mb-4" />
          <h3 className="mb-3">Playlist not found</h3>
          <Button variant="outline-light" onClick={() => navigate("/library")}>
            <FaArrowLeft className="me-2" />
            Back to Library
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="playlist-page">
      {/* Playlist Header */}
      <div className="playlist-header-section">
        <div className="playlist-header-content">
          <div className="playlist-icon">🎵</div>
          <div className="playlist-details">
            <span className="playlist-label">PLAYLIST</span>
            <h1 className="playlist-title">{playlist.name}</h1>
            <p className="playlist-meta">
              {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
            </p>
          </div>
        </div>
        <div className="playlist-actions">
          <Button 
            variant="outline-secondary" 
            className="action-btn"
            onClick={() => navigate("/library")}
          >
            <FaArrowLeft className="me-2" />
            Back
          </Button>
          <Button 
            variant="danger" 
            className="action-btn"
            onClick={handleDelete}
          >
            <FaTrash className="me-2" />
            Delete Playlist
          </Button>
        </div>
      </div>

      {/* Songs List */}
      {playlist.tracks.length === 0 ? (
        <div className="empty-playlist">
          <FaMusic size={80} className="empty-icon" />
          <h5 className="empty-title">No songs in this playlist</h5>
          <p className="empty-text">
            Add songs from search or home page to build your collection
          </p>
          <Button 
            variant="success" 
            onClick={() => navigate("/")}
          >
            Browse Songs
          </Button>
        </div>
      ) : (
        <div className="songs-grid">
          {playlist.tracks.map((song) => (
            <div
              key={song.trackId}
              className="song-card"
            >
              <div 
                className="song-image-wrapper"
                onClick={() => handlePlay(song)}
              >
                <img
                  src={song.artworkUrl100.replace("100x100bb", "600x600bb")}
                  className="song-image"
                  alt={song.trackName}
                />
                <div className="song-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                className="song-remove-btn"
                onClick={(e) => handleRemoveSong(song.trackId, song.trackName, e)}
                title="Remove from playlist"
              >
                <FaTimes />
              </button>

              <div className="song-info">
                <h6 className="song-title" title={song.trackName}>
                  {song.trackName}
                </h6>
                <p className="song-artist" title={song.artistName}>
                  {song.artistName}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastManager
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <style jsx>{`
        .playlist-page {
          padding: 20px 0;
        }

        .not-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }

        .playlist-header-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 40px;
          border: 1px solid #282828;
        }

        .playlist-header-content {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }

        .playlist-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          box-shadow: 0 8px 30px rgba(29, 185, 84, 0.3);
        }

        .playlist-details {
          flex: 1;
        }

        .playlist-label {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #b3b3b3;
          text-transform: uppercase;
        }

        .playlist-title {
          font-size: 3rem;
          font-weight: 700;
          color: #fff;
          margin: 8px 0;
          line-height: 1.2;
        }

        .playlist-meta {
          font-size: 1rem;
          color: #b3b3b3;
          margin: 0;
        }

        .playlist-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 10px 20px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .empty-playlist {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          background: #0a0a0a;
          border-radius: 16px;
          border: 1px solid #282828;
        }

        .empty-icon {
          color: #404040;
          margin-bottom: 24px;
        }

        .empty-title {
          color: #fff;
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .empty-text {
          color: #b3b3b3;
          font-size: 1rem;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .songs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 24px;
        }

        .song-card {
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          border: 1px solid #282828;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .song-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(29, 185, 84, 0.3);
          border-color: #1DB954;
        }

        .song-image-wrapper {
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }

        .song-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .song-card:hover .song-image {
          transform: scale(1.05);
        }

        .song-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .song-image-wrapper:hover .song-overlay {
          opacity: 1;
        }

        .play-button {
          width: 60px;
          height: 60px;
          background-color: #1DB954;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          transition: all 0.2s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
          background-color: #1ed760;
        }

        .song-remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #ff4d4d;
          color: #ff4d4d;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 10;
          font-size: 14px;
        }

        .song-card:hover .song-remove-btn {
          opacity: 1;
        }

        .song-remove-btn:hover {
          background: #ff4d4d;
          color: white;
          transform: scale(1.15);
        }

        .song-info {
          padding: 16px;
        }

        .song-title {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .song-artist {
          font-size: 0.9rem;
          color: #b3b3b3;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Tablet Styles */
        @media (max-width: 992px) {
          .playlist-header-section {
            padding: 32px;
          }

          .playlist-icon {
            width: 80px;
            height: 80px;
            font-size: 40px;
          }

          .playlist-title {
            font-size: 2.5rem;
          }

          .songs-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .playlist-page {
            padding: 10px 0;
          }

          .playlist-header-section {
            padding: 24px;
            margin-bottom: 24px;
          }

          .playlist-header-content {
            flex-direction: column;
            text-align: center;
            margin-bottom: 20px;
          }

          .playlist-icon {
            width: 70px;
            height: 70px;
            font-size: 36px;
          }

          .playlist-title {
            font-size: 2rem;
          }

          .playlist-actions {
            width: 100%;
          }

          .action-btn {
            flex: 1;
            justify-content: center;
          }

          .songs-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
          }

          .song-remove-btn {
            opacity: 1;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .playlist-header-section {
            padding: 20px;
          }

          .playlist-icon {
            width: 60px;
            height: 60px;
            font-size: 32px;
          }

          .playlist-title {
            font-size: 1.75rem;
          }

          .playlist-meta {
            font-size: 0.9rem;
          }

          .action-btn {
            font-size: 0.9rem;
            padding: 8px 16px;
          }

          .songs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .song-info {
            padding: 12px;
          }

          .song-title {
            font-size: 0.9rem;
          }

          .song-artist {
            font-size: 0.8rem;
          }

          .song-remove-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .play-button {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
      `}</style>
    </Container>
  );
}