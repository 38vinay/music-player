import React, { useContext, useEffect, useRef, useState } from "react";
import { MusicContext } from "../context/MusicContext";
import {
  PlayFill,
  PauseFill,
  SkipStartFill,
  SkipEndFill,
} from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

export default function Player() {
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack } =
    useContext(MusicContext);

  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // 🎵 Load & Play Track when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;
    audioRef.current.src = currentTrack.previewUrl;
    audioRef.current.play().catch(() => {});
    setProgress(0);
    setDuration(0);
  }, [currentTrack]);

  // ▶️ Handle Play / Pause toggle
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  // ⏩ Progress Bar Update
  useEffect(() => {
    const audio = audioRef.current;
    const update = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 30); // iTunes preview ~30s
      setProgress((audio.currentTime / (audio.duration || 30)) * 100);
    };
    audio.addEventListener("timeupdate", update);
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  // ⏮️ Seek in the track
  const handleSeek = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    audioRef.current.currentTime = (newProgress / 100) * duration;
  };

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
      {/* 🎵 Progress bar */}
      <div className="w-100 d-flex align-items-center">
        <small style={{ width: 40 }}>{formatTime(currentTime)}</small>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="flex-grow-1 mx-2"
          style={{ accentColor: "#e50914", cursor: "pointer" }}
        />
        <small style={{ width: 40, textAlign: "right" }}>
          {formatTime(duration)}
        </small>
      </div>

      {/* 🎧 Player Controls */}
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

        {/* Center: Controls */}
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

        {/* Spacer Right (for alignment) */}
        <div style={{ width: "110px" }} />
      </div>
    </div>
  );
}
