import React, { useContext, useRef, useEffect, useState } from "react";
import { MusicContext } from "../context/MusicContext";
import { Button, ProgressBar } from "react-bootstrap";
import {
  PlayFill,
  PauseFill,
  SkipStartFill,
  SkipEndFill,
  VolumeUpFill,
  VolumeMuteFill,
} from "react-bootstrap-icons";

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
  } = useContext(MusicContext);

  const audioRef = useRef(new Audio());
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Load track when changed
  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.play();
    }
  }, [currentTrack]);

  // Play / Pause handling
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Progress update
  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 30); // iTunes previews are 30 sec
      setProgress((audio.currentTime / (audio.duration || 30)) * 100);
    };
    audio.addEventListener("timeupdate", updateProgress);
    return () => audio.removeEventListener("timeupdate", updateProgress);
  }, []);

  // Volume change
  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (sec) => {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="player-bar bg-dark text-white d-flex align-items-center justify-content-between p-2 fixed-bottom shadow-lg">
      {/* Left: Album Art + Info */}
      <div className="d-flex align-items-center">
        <img
          src={currentTrack.artworkUrl100}
          alt="Album Art"
          className="me-3 rounded"
          width="60"
        />
        <div>
          <h6 className="mb-0">{currentTrack.trackName}</h6>
          <small className="text-muted">{currentTrack.artistName}</small>
        </div>
      </div>

      {/* Center: Controls + Progress */}
      <div className="text-center flex-grow-1 mx-4">
        <div className="d-flex justify-content-center align-items-center mb-2">
          <Button variant="link" onClick={prevTrack} className="text-white">
            <SkipStartFill size={25} />
          </Button>
          <Button variant="link" onClick={togglePlay} className="text-white mx-3">
            {isPlaying ? <PauseFill size={35} /> : <PlayFill size={35} />}
          </Button>
          <Button variant="link" onClick={nextTrack} className="text-white">
            <SkipEndFill size={25} />
          </Button>
        </div>

        <div className="d-flex align-items-center">
          <small className="me-2">{formatTime(currentTime)}</small>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="form-range flex-grow-1"
            style={{ accentColor: "red" }}
          />
          <small className="ms-2">{formatTime(duration)}</small>
        </div>
      </div>

      {/* Right: Volume Control */}
      <div className="d-flex align-items-center">
        <Button
          variant="link"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white"
        >
          {isMuted ? <VolumeMuteFill size={25} /> : <VolumeUpFill size={25} />}
        </Button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="form-range ms-2"
          style={{ width: "100px", accentColor: "red" }}
        />
      </div>
    </div>
  );
}
