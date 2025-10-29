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
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!currentTrack) return null;

  return (
    <div
      className="fixed-bottom bg-dark text-white d-flex flex-column align-items-center justify-content-center px-4 py-2"
      style={{
        borderTop: "1px solid #333",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.6)",
        zIndex: 1000,
      }}
    >
      {/* Progress Bar */}
      <div className="w-100 d-flex align-items-center">
        <small style={{ width: 46 }}>{formatTime(currentTime)}</small>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => {
            const pct = Number(e.target.value);
            const time = (pct / 100) * (duration || 30);
            seekAudio(time);
          }}
          className="flex-grow-1 mx-2"
          style={{ accentColor: "#e50914", cursor: "pointer" }}
        />
        <small style={{ width: 46, textAlign: "right" }}>
          {formatTime(duration)}
        </small>
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center justify-content-between w-100 mt-2">
        {/* Left: Song Info */}
        <div className="d-flex align-items-center">
          <img
            src={currentTrack.artworkUrl100}
            alt={currentTrack.trackName}
            style={{
              width: 55,
              height: 55,
              borderRadius: 10,
              marginRight: 12,
              objectFit: "cover",
            }}
          />
          <div>
            <div className="fw-bold" style={{ fontSize: "1rem" }}>
              {currentTrack.trackName}
            </div>
            <div className="text-muted" style={{ fontSize: "0.85rem" }}>
              {currentTrack.artistName}
            </div>
          </div>
        </div>

        {/* Center Controls */}
        <div className="d-flex align-items-center gap-3">
          <Button
            variant="outline-light"
            onClick={prevTrack}
            className="rounded-circle"
            style={{ width: 40, height: 40 }}
          >
            <SkipStartFill size={20} />
          </Button>

          <Button
            onClick={togglePlay}
            className="rounded-circle"
            style={{
              width: 55,
              height: 55,
              backgroundColor: "#e50914",
              border: "none",
            }}
          >
            {isPlaying ? (
              <PauseFill size={28} color="white" />
            ) : (
              <PlayFill size={28} color="white" />
            )}
          </Button>

          <Button
            variant="outline-light"
            onClick={nextTrack}
            className="rounded-circle"
            style={{ width: 40, height: 40 }}
          >
            <SkipEndFill size={20} />
          </Button>
        </div>

        {/* Spacer Right */}
        <div style={{ width: "110px" }} />
      </div>
    </div>
  );
}
