import React, { useContext, useMemo } from "react";
import { MusicContext } from "../context/MusicContext";
import {
  PlayFill,
  PauseFill,
  SkipStartFill,
  SkipEndFill,
} from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    seekAudio,
  } = useContext(MusicContext);

  const progress = useMemo(() => {
    if (!duration || duration === 0) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  }, [currentTime, duration]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSeek = (e) => {
    const pct = Number(e.target.value);
    const time = (pct / 100) * (duration || 30);
    seekAudio(time);
  };

  if (!currentTrack) {
    return (
      <div className="player-container no-track">
        <p className="text-muted mb-0"></p>
      </div>
    );
  }

  return (
    <div className="player-container">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <span className="time-display">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="progress-bar"
        />
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* Main Player Controls */}
      <div className="player-controls">
        {/* Left: Song Info */}
        <div className="song-info">
          <img
            src={currentTrack.artworkUrl100 || "/placeholder.png"}
            alt={currentTrack.trackName}
            className="song-artwork"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=No+Image";
            }}
          />
          <div className="song-details">
            <div className="song-title" title={currentTrack.trackName}>
              {currentTrack.trackName}
            </div>
            <div className="song-artist" title={currentTrack.artistName}>
              {currentTrack.artistName}
            </div>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="control-buttons">
          <Button
            variant="outline-light"
            onClick={prevTrack}
            className="control-btn control-btn-prev"
            title="Previous Track"
          >
            <SkipStartFill size={18} />
          </Button>

          <Button
            onClick={togglePlay}
            className="control-btn control-btn-play"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseFill size={26} color="white" />
            ) : (
              <PlayFill size={26} color="white" />
            )}
          </Button>

          <Button
            variant="outline-light"
            onClick={nextTrack}
            className="control-btn control-btn-next"
            title="Next Track"
          >
            <SkipEndFill size={18} />
          </Button>
        </div>

        {/* Right: Spacer for desktop alignment */}
        <div className="right-spacer" />
      </div>

      <style jsx>{`
        .player-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, #181818 0%, #000 100%);
          border-top: 1px solid #282828;
          box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.8);
          z-index: 1050;
          padding: 12px 20px;
        }

        .player-container.no-track {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .progress-bar-container {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .time-display {
          color: #b3b3b3;
          font-size: 0.75rem;
          min-width: 40px;
          text-align: center;
        }

        .progress-bar {
          flex: 1;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: #404040;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }

        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: #1DB954;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .progress-bar::-webkit-slider-thumb:hover {
          background: #1ed760;
          transform: scale(1.2);
        }

        .progress-bar::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #1DB954;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .player-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .song-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
          max-width: 300px;
        }

        .song-artwork {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .song-details {
          flex: 1;
          min-width: 0;
        }

        .song-title {
          font-weight: 600;
          font-size: 0.9rem;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-artist {
          font-size: 0.8rem;
          color: #b3b3b3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .control-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 0 0 auto;
        }

        .control-btn {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          transition: all 0.2s ease;
        }

        .control-btn-prev,
        .control-btn-next {
          width: 46px;
          height: 46px;
          background-color: transparent;
          border: 1px solid #404040;
          color: #fff;
        }

        .control-btn-prev:hover,
        .control-btn-next:hover {
          background-color: #282828;
          border-color: #fff;
          transform: scale(1.1);
        }

        .control-btn-play {
          width: 48px;
          height: 48px;
          background-color: #1DB954;
        }

        .control-btn-play:hover {
          background-color: #1ed760;
          transform: scale(1.1);
        }

        .right-spacer {
          flex: 1;
          max-width: 300px;
        }

        /* Tablet Styles */
        @media (max-width: 992px) {
          .right-spacer {
            display: none;
          }

          .song-info {
            max-width: 250px;
          }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
          .player-container {
            padding: 10px 15px;
          }

          .progress-bar-container {
            gap: 8px;
            margin-bottom: 10px;
          }

          .time-display {
            font-size: 0.7rem;
            min-width: 35px;
          }

          .song-info {
            max-width: 150px;
          }

          .song-artwork {
            width: 45px;
            height: 45px;
          }

          .song-title {
            font-size: 0.85rem;
          }

          .song-artist {
            font-size: 0.75rem;
          }

          .control-buttons {
            gap: 10px;
          }

          .control-btn-prev,
          .control-btn-next {
            width: 42px;
            height: 42px;
          }

          .control-btn-play {
            width: 44px;
            height: 44px;
          }
        }

        /* Small Mobile Styles */
        @media (max-width: 576px) {
          .player-container {
            padding: 8px 10px;
          }

          .progress-bar-container {
            gap: 6px;
            margin-bottom: 8px;
          }

          .time-display {
            font-size: 0.65rem;
            min-width: 30px;
          }

          .song-info {
            max-width: 120px;
            gap: 8px;
          }

          .song-artwork {
            width: 40px;
            height: 40px;
          }

          .song-title {
            font-size: 0.8rem;
          }

          .song-artist {
            font-size: 0.7rem;
          }

          .control-buttons {
            gap: 8px;
          }

          .control-btn-prev,
          .control-btn-next {
            width: 40px;
            height: 40px;
          }

          .control-btn-prev svg,
          .control-btn-next svg {
            font-size: 14px;
          }

          .control-btn-play {
            width: 40px;
            height: 40px;
          }

          .control-btn-play svg {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
