import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-bootstrap";
import SongList from "../components/Loader";
import { MusicContext } from "../context/MusicContext";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useContext(MusicContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://itunes.apple.com/search?term=honeysingh&entity=song&limit=101"
        );
        const data = await res.json();
        setSongs(data.results);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const handlePlay = (song) => {
    playTrack(song, songs);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading music...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Carousel Section */}
      <div className="hero-section">
        <Carousel fade interval={4000} className="hero-carousel">
          {songs.slice(0, 5).map((song, index) => (
            <Carousel.Item key={index}>
              <div
                className="carousel-item-custom"
                style={{
                  backgroundImage: `url(${song.artworkUrl100.replace(
                    "100x100bb",
                    "1000x1000bb"
                  )})`,
                }}
                onClick={() => handlePlay(song)}
              >
                <div className="carousel-gradient">
                  <div className="carousel-content">
                    <h2 className="carousel-title">{song.trackName}</h2>
                    <p className="carousel-artist">{song.artistName}</p>
                    <button className="carousel-play-btn">▶ Play Now</button>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Trending Songs Section */}
      <div className="trending-section">
        <div className="section-header">
          <h3 className="section-title">🔥 Trending Songs</h3>
          <p className="section-subtitle">
            Discover the hottest tracks right now
          </p>
        </div>
        <SongList songs={songs} onPlay={handlePlay} />
      </div>

      <style jsx>{`
        .home-container {
          width: 100%;
          overflow-x: hidden;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .hero-section {
          margin-bottom: 40px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
        }

        .carousel-item-custom {
          position: relative;
          height: clamp(220px, 45vh, 450px);
          background-size: cover;
          background-position: center;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .carousel-item-custom:hover {
          transform: scale(1.02);
        }

        .carousel-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.5) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: clamp(16px, 5vw, 40px);
        }

        .carousel-content {
          max-width: 90%;
        }

        .carousel-title {
          font-size: clamp(1.1rem, 4vw, 2.5rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .carousel-artist {
          font-size: clamp(0.8rem, 2.5vw, 1.2rem);
          color: #b3b3b3;
          margin-bottom: 16px;
        }

        .carousel-play-btn {
          background-color: #1db954;
          color: white;
          border: none;
          padding: clamp(6px, 1.5vw, 12px) clamp(20px, 4vw, 32px);
          border-radius: 30px;
          font-size: clamp(0.8rem, 2vw, 1rem);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
        }

        .carousel-play-btn:hover {
          background-color: #1ed760;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(29, 185, 84, 0.6);
        }

        .trending-section {
          margin-top: clamp(24px, 5vw, 40px);
          padding: 0 10px;
        }

        .section-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .section-title {
          font-size: clamp(1.3rem, 4vw, 2rem);
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: clamp(0.8rem, 2vw, 1rem);
          color: #b3b3b3;
          margin: 0;
        }

       /* Small Mobile Styles */
@media (max-width: 576px) {
  .song-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px; /* slight spacing for better balance */
    justify-items: center;
  }

  .song-card-wrapper {
    width: 100%;
  }

  .song-card {
    width: 100%;
    max-width: 160px; /* optional: ensures even card width */
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
    margin-bottom: 6px;
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

      `}</style>
    </div>
  );
}
