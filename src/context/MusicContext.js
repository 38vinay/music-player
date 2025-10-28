import React, { createContext, useState, useRef, useEffect } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );
  const [likedSongs, setLikedSongs] = useState(
    JSON.parse(localStorage.getItem("likedSongs")) || []
  );

  const audioRef = useRef(new Audio());

  // 🔊 PLAYBACK CONTROLS
  const playTrack = (track) => {
    setCurrentTrack(track);
    audioRef.current.src = track.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // 💾 Persist data to localStorage
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  // ❤️ LIKE/UNLIKE SONG
  const toggleLikeSong = (song) => {
    const exists = likedSongs.find((s) => s.trackId === song.trackId);
    if (exists) {
      setLikedSongs(likedSongs.filter((s) => s.trackId !== song.trackId));
    } else {
      setLikedSongs([...likedSongs, song]);
    }
  };

  // 🎵 PLAYLIST MANAGEMENT
  const createPlaylist = (name) => {
    const newPlaylist = { name, tracks: [] };
    setPlaylists([...playlists, newPlaylist]);
  };

  const deletePlaylist = (name) => {
    setPlaylists(playlists.filter((p) => p.name !== name));
  };

  const addToPlaylist = (playlistName, song) => {
    const updated = playlists.map((p) => {
      if (p.name === playlistName) {
        const exists = p.tracks.find((s) => s.trackId === song.trackId);
        if (!exists) p.tracks.push(song);
      }
      return p;
    });
    setPlaylists(updated);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        togglePlay,
        playTrack,
        playlists,
        likedSongs,
        toggleLikeSong,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
