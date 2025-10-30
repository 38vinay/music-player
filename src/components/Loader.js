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
      <div
        className="row justify-content-start"
        style={{
          marginTop: "10px",
        }}
      >
        {songs.map((song) => (
          <div
            className="col-6 col-sm-4 col-md-3 col-lg-2"
            key={song.trackId}
            style={{
              padding: "10px",
            }}
          >
            <div
              className="card bg-dark text-light shadow-sm song-card"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >
              <img
                src={song.artworkUrl100.replace("100x100bb", "600x600bb")}
                className="card-img-top"
                alt={song.trackName}
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "240px",
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => onPlay(song)}
              />

              <div className="card-body text-center p-2">
                <h6 className="text-truncate mb-1" style={{ fontSize: "0.9rem" }}>
                  {song.trackName}
                </h6>
                <p
                  className="text-muted mb-2 text-truncate"
                  style={{ fontSize: "0.8rem" }}
                >
                  {song.artistName}
                </p>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-outline-success btn-sm"
                    style={{ padding: "2px 6px", fontSize: "0.8rem" }}
                    onClick={() => onPlay(song)}
                    title="Play"
                  >
                    ▶
                  </button>

                  <button
                    className="btn btn-outline-light btn-sm"
                    style={{ padding: "2px 6px" }}
                    onClick={() => handleLikeClick(song)}
                    title={likedSongs.some((s) => s.trackId === song.trackId) ? "Unlike" : "Like"}
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
                    style={{ padding: "2px 6px" }}
                    onClick={() => handleAddClick(song)}
                    title="Add to Playlist"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
    </>
  );
};

export default SongList;