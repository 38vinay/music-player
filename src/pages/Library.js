import React, { useContext, useState } from "react";
import { MusicContext } from "../context/MusicContext";
import PlaylistModal from "../components/PlaylistModal";
import { Button } from "react-bootstrap";
import { FaPlus, FaTrash, FaMusic, FaTimes } from "react-icons/fa";
import ToastManager from "../components/ToastManager";

export default function Library() {
  const { playlists, playTrack, deletePlaylist, removeFromPlaylist } = useContext(MusicContext);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handlePlay = (song, playlistTracks) => {
    playTrack(song, playlistTracks);
  };

  const handleRemoveSong = (playlistName, songId, songName, e) => {
    e.stopPropagation();
    removeFromPlaylist(playlistName, songId);
    setToastMsg(`Removed "${songName}" from playlist 🗑️`);
    setShowToast(true);
  };

  const handleDeletePlaylist = (playlistName) => {
    deletePlaylist(playlistName);
    setToastMsg(`Deleted playlist "${playlistName}" 🗑️`);
    setShowToast(true);
  };

  return (
    <div className="library-container">
      {/* Header */}
      <div className="library-header">
        <div>
          <h3 className="library-title">🎶 Your Library</h3>
          <p className="library-subtitle">Manage your playlists and collections</p>
        </div>
        <Button 
          variant="success" 
          className="create-playlist-btn"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="me-2" />
          Create Playlist
        </Button>
      </div>

      {/* Empty State */}
      {playlists.length === 0 ? (
        <div className="empty-state">
          <FaMusic size={80} className="empty-icon" />
          <h5 className="empty-title">No playlists yet</h5>
          <p className="empty-text">
            Create your first playlist to organize your favorite songs
          </p>
          <Button 
            variant="success" 
            size="lg"
            onClick={() => setShowModal(true)}
          >
            <FaPlus className="me-2" />
            Create Your First Playlist
          </Button>
        </div>
      ) : (
        /* Playlists Grid */
        <div className="playlists-grid">
          {playlists.map((playlist, idx) => (
            <div key={idx} className="playlist-card">
              <div className="playlist-header">
                <div>
                  <h5 className="playlist-name">{playlist.name}</h5>
                  <p className="playlist-info">
                    {playlist.tracks.length} {playlist.tracks.length === 1 ? 'song' : 'songs'}
                  </p>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="delete-btn"
                  onClick={() => handleDeletePlaylist(playlist.name)}
                  title="Delete Playlist"
                >
                  <FaTrash />
                </Button>
              </div>

              {playlist.tracks.length === 0 ? (
                <div className="playlist-empty">
                  <FaMusic size={40} className="text-muted" />
                  <p className="text-muted mt-2 mb-0">No songs added yet</p>
                </div>
              ) : (
                <div className="playlist-tracks">
                  {playlist.tracks.map((song) => (
                    <div
                      key={song.trackId}
                      className="track-card"
                    >
                      <div 
                        className="track-image-wrapper"
                        onClick={() => handlePlay(song, playlist.tracks)}
                      >
                        <img
                          src={song.artworkUrl100.replace("100x100bb", "300x300bb")}
                          className="track-image"
                          alt={song.trackName}
                        />
                        <div className="track-overlay">
                          <div className="track-play-btn">▶</div>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        className="track-remove-btn"
                        onClick={(e) => handleRemoveSong(playlist.name, song.trackId, song.trackName, e)}
                        title="Remove from playlist"
                      >
                        <FaTimes />
                      </button>
                      
                      <div className="track-info">
                        <h6 className="track-name" title={song.trackName}>
                          {song.trackName}
                        </h6>
                        <p className="track-artist" title={song.artistName}>
                          {song.artistName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <PlaylistModal show={showModal} handleClose={() => setShowModal(false)} />
      
      <ToastManager
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <style jsx>{`
        .library-container {
          padding: 20px 0;
        }

        .library-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .library-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .library-subtitle {
          font-size: 1rem;
          color: #b3b3b3;
          margin: 0;
        }

        .create-playlist-btn {
          background-color: #1DB954;
          border: none;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .create-playlist-btn:hover {
          background-color: #1ed760;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(29, 185, 84, 0.4);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
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
          max-width: 400px;
        }

        .playlists-grid {
          display: grid;
          gap: 24px;
        }

        .playlist-card {
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          border: 1px solid #282828;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .playlist-card:hover {
          border-color: #1DB954;
          box-shadow: 0 8px 30px rgba(29, 185, 84, 0.2);
          transform: translateY(-4px);
        }

        .playlist-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #282828;
        }

        .playlist-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
        }

        .playlist-info {
          font-size: 0.9rem;
          color: #b3b3b3;
          margin: 0;
        }

        .delete-btn {
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border-color: #404040;
          transition: all 0.2s ease;
        }

        .delete-btn:hover {
          background-color: #ff4d4d;
          border-color: #ff4d4d;
          transform: scale(1.1);
        }

        .playlist-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: #0a0a0a;
          border-radius: 12px;
        }

        .playlist-tracks {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
        }

        .track-card {
          background: #0a0a0a;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .track-card:hover {
          background: #1a1a1a;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
        }

        .track-image-wrapper {
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }

        .track-image {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          display: block;
          transition: transform 0.3s ease;
        }

        .track-card:hover .track-image {
          transform: scale(1.05);
        }

        .track-overlay {
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

        .track-image-wrapper:hover .track-overlay {
          opacity: 1;
        }

        .track-play-btn {
          width: 40px;
          height: 40px;
          background-color: #1DB954;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: white;
          transition: transform 0.2s ease;
        }

        .track-play-btn:hover {
          transform: scale(1.1);
        }

        .track-remove-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #ff4d4d;
          color: #ff4d4d;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .track-card:hover .track-remove-btn {
          opacity: 1;
        }

        .track-remove-btn:hover {
          background: #ff4d4d;
          color: white;
          transform: scale(1.15);
        }

        .track-info {
          padding: 12px;
        }

        .track-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .track-artist {
          font-size: 0.8rem;
          color: #b3b3b3;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Tablet Styles */
        @media (max-width: 992px) {
          .library-title {
            font-size: 2rem;
          }

          .playlist-tracks {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .library-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .library-title {
            font-size: 1.75rem;
          }

          .library-subtitle {
            font-size: 0.9rem;
          }

          .create-playlist-btn {
            width: 100%;
            justify-content: center;
          }

          .empty-state {
            padding: 60px 20px;
          }

          .empty-icon {
            font-size: 60px;
          }

          .empty-title {
            font-size: 1.5rem;
          }

          .playlist-card {
            padding: 20px;
          }

          .playlist-name {
            font-size: 1.3rem;
          }

          .playlist-tracks {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
          }

          .track-remove-btn {
            opacity: 1;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .library-container {
            padding: 10px 0;
          }

          .library-header {
            margin-bottom: 24px;
          }

          .library-title {
            font-size: 1.5rem;
          }

          .create-playlist-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }

          .playlists-grid {
            gap: 16px;
          }

          .playlist-card {
            padding: 16px;
          }

          .playlist-name {
            font-size: 1.2rem;
          }

          .playlist-info {
            font-size: 0.85rem;
          }

          .playlist-tracks {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .track-info {
            padding: 10px;
          }

          .track-name {
            font-size: 0.85rem;
          }

          .track-artist {
            font-size: 0.75rem;
          }

          .track-remove-btn {
            width: 24px;
            height: 24px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}