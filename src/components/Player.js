import React, { useContext } from "react";
import { MusicContext } from "../context/MusicContext";
import { Button, ProgressBar } from "react-bootstrap";
import { PlayFill, PauseFill, SkipStartFill, SkipEndFill } from "react-bootstrap-icons";

export default function Player() {
  const { currentTrack, isPlaying, togglePlay } = useContext(MusicContext);

  if (!currentTrack) return null;

  return (
    <div className="player-bar bg-dark text-white d-flex align-items-center p-2 fixed-bottom">
      <img src={currentTrack.artworkUrl100} alt="Album Art" className="me-3" width="60" />
      <div className="flex-grow-1">
        <h6 className="mb-0">{currentTrack.trackName}</h6>
        <small className="text-muted">{currentTrack.artistName}</small>
        <ProgressBar now={50} className="mt-1" />
      </div>
      <div className="ms-3">
        <Button variant="link" onClick={togglePlay} className="text-white">
          {isPlaying ? <PauseFill size={30} /> : <PlayFill size={30} />}
        </Button>
      </div>
    </div>
  );
}
