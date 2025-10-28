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

  const handleAddClick = (song) => {
    setSelectedSong(song);
    setShowModal(true);
  };

  const handleLikeClick = (song) => {
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
    return <p className="text-muted">No songs found.</p>;

  return (
    <>
      <div className="row">
        {songs.map((song) => (
          <div className="col-md-3 mb-4" key={song.trackId}>
            <div className="card bg-dark text-light h-100 shadow-sm">
              <img
                src={song.artworkUrl100.replace('100x100bb', '600x600bb')}
                className="card-img-top"
                alt={song.trackName}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />

              <div className="card-body text-center">
                <h6 className="text-truncate">{song.trackName}</h6>
                <p className="text-muted mb-2">{song.artistName}</p>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => onPlay(song)}
                  >
                    ▶ Play
                  </button>

                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => handleLikeClick(song)}
                  >
                    <FaHeart
                      className={
                        likedSongs.some((s) => s.trackId === song.trackId)
                          ? "text-danger"
                          : ""
                      }
                    />
                  </button>

                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => handleAddClick(song)}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        song={selectedSong}
        onAdded={handlePlaylistAdd}
      />

      {/* Toast Notifications */}
      <ToastManager
        message={toastMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default SongList;
