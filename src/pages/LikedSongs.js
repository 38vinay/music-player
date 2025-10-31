import React, { useContext } from "react";
import { MusicContext } from "../context/MusicContext";
import { FaHeart, FaMusic } from "react-icons/fa";

export default function Liked() {
  const { likedSongs, playTrack, toggleLikeSong } = useContext(MusicContext);

  const handlePlay = (song) => {
    playTrack(song, likedSongs);
  };

  return (
    <div className="liked-container">
      {/* Header */}
      <div className="liked-header">
        <div className="liked-header-icon">
          <FaHeart size={40} />
        </div>
        <div>
          <h3 className="liked-title">Liked Songs</h3>
          <p className="liked-subtitle">
            {likedSongs.length} {likedSongs.length === 1 ? 'song' : 'songs'} you love
          </p>
        </div>
      </div>

      {/* Empty State */}
      {likedSongs.length === 0 ? (
        <div className="empty-state">
          <FaMusic size={80} className="empty-icon" />
          <h5 className="empty-title">No liked songs yet</h5>
          <p className="empty-text">
            Start liking songs to see them here. Your favorite tracks are just a heart click away!
          </p>
        </div>
      ) : (
        /* Songs Grid */
        <div className="songs-grid">
          {likedSongs.map((song) => (
            <div key={song.trackId} className="song-card">
              <div className="song-image-wrapper" onClick={() => handlePlay(song)}>
                <img
                  src={song.artworkUrl100.replace("100x100bb", "600x600bb")}
                  className="song-image"
                  alt={song.trackName}
                />
                <div className="song-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>
              
              <div className="song-details">
                <h6 className="song-title" title={song.trackName}>
                  {song.trackName}
                </h6>
                <p className="song-artist" title={song.artistName}>
                  {song.artistName}
                </p>
                
                <div className="song-actions">
                  <button
                    className="action-btn play-btn"
                    onClick={() => handlePlay(song)}
                  >
                    ▶ Play
                  </button>
                  <button
                    className="action-btn unlike-btn"
                    onClick={() => toggleLikeSong(song)}
                  >
                    <FaHeart className="me-1" /> Unlike
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .liked-container {
          padding: 20px 0;
        }

        .liked-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 40px;
          padding: 32px;
          background: linear-gradient(135deg, #5E1B8D 0%, #1DB954 100%);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(94, 27, 141, 0.3);
        }

        .liked-header-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #ff4d4d 0%, #ff1744 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 20px rgba(255, 77, 77, 0.4);
        }

        .liked-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .liked-subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
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
          max-width: 500px;
          line-height: 1.6;
        }

        .songs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 24px;
        }

        .song-card {
          background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
          border: 1px solid #282828;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .song-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(255, 77, 77, 0.3);
          border-color: #ff4d4d;
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

        .song-details {
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
          margin-bottom: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .song-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 8px 16px;
          border-radius: 20px;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .play-btn {
          background-color: #1DB954;
          color: white;
        }

        .play-btn:hover {
          background-color: #1ed760;
          transform: translateY(-2px);
        }

        .unlike-btn {
          background-color: transparent;
          color: #ff4d4d;
          border: 1px solid #ff4d4d;
        }

        .unlike-btn:hover {
          background-color: #ff4d4d;
          color: white;
          transform: translateY(-2px);
        }

        /* Tablet Styles */
        @media (max-width: 992px) {
          .liked-header {
            padding: 24px;
            gap: 20px;
          }

          .liked-header-icon {
            width: 70px;
            height: 70px;
          }

          .liked-title {
            font-size: 2rem;
          }

          .songs-grid {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .liked-header {
            padding: 20px;
            gap: 16px;
          }

          .liked-header-icon {
            width: 60px;
            height: 60px;
          }

          .liked-header-icon svg {
            font-size: 30px;
          }

          .liked-title {
            font-size: 1.75rem;
          }

          .liked-subtitle {
            font-size: 0.9rem;
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

          .empty-text {
            font-size: 0.9rem;
          }

          .songs-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
          }

          .song-details {
            padding: 14px;
          }

          .song-title {
            font-size: 0.9rem;
          }

          .song-artist {
            font-size: 0.85rem;
            margin-bottom: 12px;
          }

          .action-btn {
            font-size: 0.8rem;
            padding: 6px 12px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .liked-container {
            padding: 10px 0;
          }

          .liked-header {
            padding: 16px;
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .liked-header-icon {
            width: 50px;
            height: 50px;
          }

          .liked-header-icon svg {
            font-size: 24px;
          }

          .liked-title {
            font-size: 1.5rem;
            margin-bottom: 4px;
          }

          .liked-subtitle {
            font-size: 0.85rem;
          }

          .songs-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .song-details {
            padding: 12px;
          }

          .song-title {
            font-size: 0.85rem;
            margin-bottom: 4px;
          }

          .song-artist {
            font-size: 0.8rem;
            margin-bottom: 10px;
          }

          .song-actions {
            flex-direction: column;
            gap: 6px;
          }

          .action-btn {
            font-size: 0.75rem;
            padding: 6px 10px;
          }

          .play-button {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}