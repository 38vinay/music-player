import React, { createContext, useState, useRef, useEffect } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]); // all tracks currently in list
  const [currentIndex, setCurrentIndex] = useState(0); // index in queue

  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );
  const [likedSongs, setLikedSongs] = useState(
    JSON.parse(localStorage.getItem("likedSongs")) || []
  );

  const audioRef = useRef(new Audio());

  // 🔊 PLAY SELECTED TRACK
  const playTrack = (track, allSongs = []) => {
    setCurrentTrack(track);
    if (allSongs.length) {
      setQueue(allSongs);
      const index = allSongs.findIndex((s) => s.trackId === track.trackId);
      setCurrentIndex(index !== -1 ? index : 0);
    }
    audioRef.current.src = track.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // ▶️ TOGGLE PLAY / PAUSE
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // ⏭️ NEXT TRACK
  const nextTrack = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    const next = queue[nextIndex];
    setCurrentTrack(next);
    setCurrentIndex(nextIndex);
    audioRef.current.src = next.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // ⏮️ PREVIOUS TRACK
  const prevTrack = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prev = queue[prevIndex];
    setCurrentTrack(prev);
    setCurrentIndex(prevIndex);
    audioRef.current.src = prev.previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  };

  // ❤️ LIKE / UNLIKE SONG
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

  // 💾 Save liked songs & playlists
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  // ⏩ AUTO-PLAY NEXT SONG when current finishes
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      nextTrack();
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [queue, currentIndex]);

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
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
