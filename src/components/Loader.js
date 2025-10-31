import React, { useContext, useState } from "react";
import { MusicContext } from "../context/MusicContext";
import { FaHeart, FaPlus } from "react-icons/fa";
import AddToPlaylistModal from "./AddToPlaylistModal";
import ToastManager from "./ToastManager";

const SongList = ({ songs, onPlay }) => {
  const { likedSongs, toggleLikeSong } = useContext(MusicContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleAddClick = (song, e) => {
    e.stopPropagation();
    setSelectedSong(song);
    setShowModal(true);
  };

  const handleLikeClick = (song, e) => {
    e.stopPropagation();
    toggleLikeSong(song);
    const isLiked = likedSongs.some((s) => s.trackId === song.trackId);
    setToastMsg(isLiked ? "Removed from Liked Songs 💔" : "Added to Liked Songs ❤️");
    setShowToast(true);
  };

  const handlePlaylistAdd = (playlistName) => {
    setToastMsg(`Added to "${playlistName}" 🎵`);
    setShowToast(true);
  };

  if (!songs || songs.length === 0)
    return <p className="text-muted text-center py-5">No songs found.</p>;

  return (
    <>
      <div className="song-grid">
        {songs.map((song) => {
          const isLiked = likedSongs.some((s) => s.trackId === song.trackId);
          
          return (
            <div key={song.trackId} className="song-card-wrapper">
              <div
                className="song-card"
                onClick={() => onPlay(song)}
              >
                <div className="song-card-image-wrapper">
                  <img
                    src={song.artworkUrl100.replace("100x100bb", "600x600bb")}
                    className="song-card-image"
                    alt={song.trackName}
                    loading="lazy"
                  />
                  <div className="song-card-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>

                <div className="song-card-body">
                  <h6 className="song-card-title" title={song.trackName}>
                    {song.trackName}
                  </h6>
                  <p className="song-card-artist" title={song.artistName}>
                    {song.artistName}
                  </p>

                  <div className="song-card-actions">
                    <button
                      className="action-btn action-btn-like"
                      onClick={(e) => handleLikeClick(song, e)}
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <FaHeart className={isLiked ? "liked" : ""} />
                    </button>

                    <button
                      className="action-btn action-btn-add"
                      onClick={(e) => handleAddClick(song, e)}
                      title="Add to Playlist"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddToPlaylistModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        song={selectedSong}
        onAdded={handlePlaylistAdd}
      />

      <ToastManager
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <style jsx>{`
        .song-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
          padding: 10px 0;
        }

        .song-card-wrapper {
          width: 100%;
        }

        .song-card {
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .song-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(29, 185, 84, 0.3);
          background: linear-gradient(145deg, #282828 0%, #1a1a1a 100%);
        }

        .song-card-image-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 100%;
          overflow: hidden;
        }

        .song-card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .song-card:hover .song-card-image {
          transform: scale(1.05);
        }

        .song-card-overlay {
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

        .song-card:hover .song-card-overlay {
          opacity: 1;
        }

        .play-button {
          width: 50px;
          height: 50px;
          background-color: #1DB954;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          transition: all 0.2s ease;
        }

        .play-button:hover {
          transform: scale(1.1);
          background-color: #1ed760;
        }

        .song-card-body {
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .song-card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          margin: 0 0 6px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .song-card-artist {
          font-size: 0.8rem;
          color: #b3b3b3;
          margin: 0 0 12px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .song-card-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #404040;
          background: transparent;
          color: #b3b3b3;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #282828;
          border-color: #fff;
          color: #fff;
          transform: scale(1.1);
        }

        .action-btn-like .liked {
          color: #ff4d4d;
        }

        /* Tablet Styles */
        @media (max-width: 992px) {
          .song-grid {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
          }

          .song-card-title {
            font-size: 0.85rem;
          }

          .song-card-artist {
            font-size: 0.75rem;
          }

          .play-button {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .song-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 12px;
          }

          .song-card-body {
            padding: 10px;
          }

          .song-card-title {
            font-size: 0.8rem;
            margin-bottom: 4px;
          }

          .song-card-artist {
            font-size: 0.7rem;
            margin-bottom: 10px;
          }

          .action-btn {
            width: 28px;
            height: 28px;
          }

          .action-btn svg {
            font-size: 12px;
          }

          .play-button {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .song-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }

          .song-card-body {
            padding: 8px;
          }

          .song-card-title {
            font-size: 0.75rem;
            margin-bottom: 3px;
          }

          .song-card-artist {
            font-size: 0.65rem;
            margin-bottom: 8px;
          }

          .song-card-actions {
            gap: 6px;
          }

          .action-btn {
            width: 26px;
            height: 26px;
          }

          .action-btn svg {
            font-size: 11px;
          }

          .play-button {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
        }

        /* Very Small Devices */
        @media (max-width: 400px) {
          .song-grid {
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default SongList;