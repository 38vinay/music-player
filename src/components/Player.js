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
      <div
        className="fixed-bottom bg-dark text-white d-flex align-items-center justify-content-center px-4 py-3"
        style={{
          borderTop: "1px solid #333",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.6)",
          zIndex: 1050,
        }}
      >
        <p className="text-muted mb-0">No track playing</p>
      </div>
    );
  }

  return (
    <div
      className="fixed-bottom bg-dark text-white px-4 py-2"
      style={{
        borderTop: "1px solid #333",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.6)",
        zIndex: 1050,
      }}
    >
      {/* Progress Bar */}
      <div className="w-100 d-flex align-items-center mb-2">
        <small className="text-muted" style={{ width: "50px", textAlign: "left" }}>
          {formatTime(currentTime)}
        </small>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="flex-grow-1 mx-2"
          style={{
            accentColor: "#1DB954",
            cursor: "pointer",
            height: "4px",
          }}
        />
        <small className="text-muted" style={{ width: "50px", textAlign: "right" }}>
          {formatTime(duration)}
        </small>
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center justify-content-between w-100">
        {/* Left: Song Info */}
        <div className="d-flex align-items-center" style={{ minWidth: "200px", maxWidth: "30%" }}>
          <img
            src={currentTrack.artworkUrl100 || "/placeholder.png"}
            alt={currentTrack.trackName}
            style={{
              width: 55,
              height: 55,
              borderRadius: 8,
              marginRight: 12,
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/100?text=No+Image";
            }}
          />
          <div style={{ overflow: "hidden" }}>
            <div
              className="fw-bold text-truncate"
              style={{ fontSize: "0.95rem", maxWidth: "200px" }}
              title={currentTrack.trackName}
            >
              {currentTrack.trackName}
            </div>
            <div
              className="text-muted text-truncate"
              style={{ fontSize: "0.85rem", maxWidth: "200px" }}
              title={currentTrack.artistName}
            >
              {currentTrack.artistName}
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-light"
            onClick={prevTrack}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 38, height: 38, border: "1px solid #555" }}
            title="Previous Track"
          >
            <SkipStartFill size={18} />
          </Button>

          <Button
            onClick={togglePlay}
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#1DB954",
              border: "none",
            }}
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
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 38, height: 38, border: "1px solid #555" }}
            title="Next Track"
          >
            <SkipEndFill size={18} />
          </Button>
        </div>

        {/* Right Spacer */}
        <div style={{ minWidth: "200px", maxWidth: "30%" }} />
      </div>
    </div>
  );
}