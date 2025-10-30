import React, { createContext, useState, useRef, useEffect } from "react";

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [playlists, setPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem("playlists");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Could not load playlists:", error);
      return [];
    }
  });

  const [likedSongs, setLikedSongs] = useState(() => {
    try {
      const saved = localStorage.getItem("likedSongs");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Could not load liked songs:", error);
      return [];
    }
  });

  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const proxify = (url) => {
    if (!url) return "";
    return url;
  };

  const playTrack = (track, allSongs = []) => {
    if (!track?.previewUrl) {
      console.warn("No preview URL available for track:", track);
      return;
    }
    
    const audio = audioRef.current;

    if (allSongs.length > 0) {
      setQueue(allSongs);
      const index = allSongs.findIndex((s) => s.trackId === track.trackId);
      setCurrentIndex(index !== -1 ? index : 0);
      console.log(`Queue set with ${allSongs.length} songs, playing index ${index !== -1 ? index : 0}`);
    } else if (queue.length > 0) {
      const index = queue.findIndex((s) => s.trackId === track.trackId);
      if (index !== -1) {
        setCurrentIndex(index);
        console.log(`Playing from existing queue, index ${index}`);
      } else {
        setQueue([track]);
        setCurrentIndex(0);
        console.log("Track not in queue, creating new single-track queue");
      }
    } else {
      setQueue([track]);
      setCurrentIndex(0);
      console.log("No queue exists, creating single-track queue");
    }

    setCurrentTrack(track);
    const url = proxify(track.previewUrl);

    audio.pause();
    audio.src = url;
    audio.currentTime = 0;
    audio.load();
    
    audio
      .play()
      .then(() => {
        console.log("Playing:", track.trackName);
        setIsPlaying(true);
      })
      .catch((err) => {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) {
      console.warn("No track loaded");
      return;
    }
    
    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Play failed:", err);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (queue.length === 0) {
      console.warn("Queue is empty");
      return;
    }
    
    const nextIndex = (currentIndex + 1) % queue.length;
    const next = queue[nextIndex];
    setCurrentIndex(nextIndex);
    setCurrentTrack(next);

    const audio = audioRef.current;
    audio.pause();
    audio.src = proxify(next.previewUrl);
    audio.currentTime = 0;
    audio.load();
    
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Next track play failed:", err);
        setIsPlaying(false);
      });
  };

  const prevTrack = () => {
    if (queue.length === 0) {
      console.warn("Queue is empty");
      return;
    }
    
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prev = queue[prevIndex];
    setCurrentIndex(prevIndex);
    setCurrentTrack(prev);

    const audio = audioRef.current;
    audio.pause();
    audio.src = proxify(prev.previewUrl);
    audio.currentTime = 0;
    audio.load();
    
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Previous track play failed:", err);
        setIsPlaying(false);
      });
  };

  const toggleLikeSong = (song) => {
    const exists = likedSongs.find((s) => s.trackId === song.trackId);
    const updated = exists
      ? likedSongs.filter((s) => s.trackId !== song.trackId)
      : [...likedSongs, song];
    setLikedSongs(updated);
  };

  const createPlaylist = (name) => {
    if (!name?.trim()) return;
    const exists = playlists.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      console.warn("Playlist already exists:", name);
      return;
    }
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

  useEffect(() => {
    try {
      localStorage.setItem("playlists", JSON.stringify(playlists));
    } catch (error) {
      console.warn("Could not save playlists:", error);
    }
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
    } catch (error) {
      console.warn("Could not save liked songs:", error);
    }
  }, [likedSongs]);

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const onEnded = () => {
      if (queue.length > 0) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const onError = (e) => {
      console.error("Audio error:", e);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const seekAudio = (time) => {
    const audio = audioRef.current;
    if (!isNaN(time) && audio.src) {
      const seekTime = Math.max(0, Math.min(time, audio.duration || time));
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        playTrack,
        nextTrack,
        prevTrack,
        seekAudio,
        audioRef,
        playlists,
        likedSongs,
        toggleLikeSong,
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        queue,
        currentIndex,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};