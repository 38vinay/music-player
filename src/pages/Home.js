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
          "https://itunes.apple.com/search?term=trending&entity=song&limit=101"
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
                    <button className="carousel-play-btn">
                      ▶ Play Now
                    </button>
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
          <h3 className="section-title ">🔥 Trending Songs</h3>
          <p className="section-subtitle">Discover the hottest tracks right now</p>
        </div>
        <SongList songs={songs} onPlay={handlePlay} />
      </div>

      <style jsx>{`
        .home-container {
          width: 100%;
          max-width: 100%;
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

        .hero-carousel {
          border-radius: 16px;
          overflow: hidden;
        }

        .carousel-item-custom {
          position: relative;
          height: 450px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
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
            rgba(101, 67, 67, 0.9) 0%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.3) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 40px;
        }

        .carousel-content {
          max-width: 600px;
        }

        .carousel-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 12px;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
        }

        .carousel-artist {
          font-size: 1.2rem;
          color: #b3b3b3;
          margin-bottom: 20px;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
        }

        .carousel-play-btn {
          background-color: #1DB954;
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 30px;
          font-size: 1rem;
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
          margin-top: 40px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .section-subtitle {
          font-size: 1rem;
          color: #b3b3b3;
          margin: 0;
        }

        /* Tablet Styles */
        @media (max-width: 992px) {
          .hero-section {
            margin-bottom: 30px;
          }

          .carousel-item-custom {
            height: 350px;
          }

          .carousel-gradient {
            padding: 30px;
          }

          .carousel-title {
            font-size: 2rem;
          }

          .carousel-artist {
            font-size: 1rem;
          }

          .carousel-play-btn {
            padding: 10px 28px;
            font-size: 0.95rem;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .section-subtitle {
            font-size: 0.9rem;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .hero-section {
            margin-bottom: 24px;
            border-radius: 12px;
          }

          .carousel-item-custom {
            height: 300px;
          }

          .carousel-gradient {
            padding: 24px;
          }

          .carousel-title {
            font-size: 1.5rem;
            margin-bottom: 8px;
          }

          .carousel-artist {
            font-size: 0.9rem;
            margin-bottom: 16px;
          }

          .carousel-play-btn {
            padding: 8px 24px;
            font-size: 0.9rem;
          }

          .trending-section {
            margin-top: 30px;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-subtitle {
            font-size: 0.85rem;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .hero-section {
            margin-bottom: 20px;
            border-radius: 10px;
          }

          .carousel-item-custom {
            height: 250px;
          }

          .carousel-gradient {
            padding: 20px;
          }

          .carousel-title {
            font-size: 1.2rem;
            margin-bottom: 6px;
          }

          .carousel-artist {
            font-size: 0.8rem;
            margin-bottom: 12px;
          }

          .carousel-play-btn {
            padding: 6px 20px;
            font-size: 0.85rem;
          }

          .trending-section {
            margin-top: 24px;
          }

          .section-header {
            margin-bottom: 16px;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .section-subtitle {
            font-size: 0.8rem;
          }
        }

        /* Very Small Devices */
        @media (max-width: 400px) {
          .carousel-item-custom {
            height: 220px;
          }

          .carousel-gradient {
            padding: 16px;
          }

          .carousel-title {
            font-size: 1.1rem;
          }

          .carousel-artist {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}