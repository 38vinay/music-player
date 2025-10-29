import React, { createContext, useState, useRef, useEffect } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]); // all tracks in list
  const [currentIndex, setCurrentIndex] = useState(0); // current position in queue

  const [playlists, setPlaylists] = useState(
    JSON.parse(localStorage.getItem("playlists")) || []
  );
  const [likedSongs, setLikedSongs] = useState(
    JSON.parse(localStorage.getItem("likedSongs")) || []
  );

  const audioRef = useRef(new Audio());

  // 🎵 PLAY SELECTED TRACK
  const playTrack = (track, allSongs = []) => {
    if (!track?.previewUrl) return;

    // Update queue if new song list provided
    if (allSongs.length) {
      setQueue(allSongs);
      const index = allSongs.findIndex((s) => s.trackId === track.trackId);
      setCurrentIndex(index !== -1 ? index : 0);
    }

    // Set current track and play
    setCurrentTrack(track);
    const audio = audioRef.current;
    audio.pause();
    audio.src = track.previewUrl;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  // ▶️ TOGGLE PLAY / PAUSE
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
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

    const audio = audioRef.current;
    audio.pause();
    audio.src = next.previewUrl;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  // ⏮️ PREVIOUS TRACK
  const prevTrack = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prev = queue[prevIndex];
    setCurrentTrack(prev);
    setCurrentIndex(prevIndex);

    const audio = audioRef.current;
    audio.pause();
    audio.src = prev.previewUrl;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    setIsPlaying(true);
  };

  // ❤️ LIKE / UNLIKE SONG
  const toggleLikeSong = (song) => {
    const exists = likedSongs.find((s) => s.trackId === song.trackId);
    const updated = exists
      ? likedSongs.filter((s) => s.trackId !== song.trackId)
      : [...likedSongs, song];
    setLikedSongs(updated);
  };

  // 🎧 PLAYLIST MANAGEMENT
  const createPlaylist = (name) => {
    if (!name?.trim()) return;
    const exists = playlists.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return;
    const newPlaylist = { name, tracks: [] };
    setPlaylists([...playlists, newPlaylist]);
  };

  const deletePlaylist = (name) => {
    setPlaylists(playlists.filter((p) => p.name !== name));
  };

  const addToPlaylist = (playlistName, song) => {
    const updated = playlists.map((p) => {
      if (p.name === playlistName) {
        const exists = p.tracks.some((s) => s.trackId === song.trackId);
        if (!exists) {
          return { ...p, tracks: [...p.tracks, song] };
        }
      }
      return p;
    });
    setPlaylists(updated);
  };

  // 💾 SAVE LIKED SONGS & PLAYLISTS TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  // ⏩ AUTO PLAY NEXT WHEN SONG ENDS
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      nextTrack();
    };
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [queue, currentIndex]);

  // 🧹 CLEAN UP AUDIO ON UNMOUNT
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

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
