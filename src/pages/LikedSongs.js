import React, { useContext } from "react";
import { MusicContext } from "../context/MusicContext";

export default function Liked() {
  const { likedSongs, playTrack, toggleLikeSong } = useContext(MusicContext);

  const handlePlay = (song) => {
    playTrack(song, likedSongs);
  };

  return (
    <div className="text-light ">
      <h3 className="mb-4">❤️ Liked Songs</h3>
      {likedSongs.length === 0 ? (
        <p className="text-muted">You haven't liked any songs yet.</p>
      ) : (
        <div className="row">
          {likedSongs.map((song) => (
            <div key={song.trackId} className="col-md-3 mb-4">
              <div className="card bg-dark text-light h-100">
                <img 
                  src={song.artworkUrl100} 
                  className="card-img-top" 
                  alt={song.trackName}
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePlay(song)}
                />
                <div className="card-body text-center">
                  <h6 className="text-truncate">{song.trackName}</h6>
                  <p className="text-muted mb-2">{song.artistName}</p>
                  <button
                    className="btn btn-outline-success btn-sm me-2"
                    onClick={() => handlePlay(song)}
                  >
                    ▶ Play
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => toggleLikeSong(song)}
                  >
                    💔 Unlike
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}