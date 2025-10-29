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

  // single audio instance used across the app
  const audioRef = useRef(new Audio());

  // progress state exposed to UI
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // helper: optionally use a CORS proxy for previews that block playback
  const proxify = (url) => {
    if (!url) return "";
    // If you want to enable proxying, uncomment below and return proxied URL.
    // return `https://corsproxy.io/?${encodeURIComponent(url)}`;
    return url; // default: use original URL
  };

  // play a selected track (and optionally set a queue)
  const playTrack = (track, allSongs = []) => {
    if (!track?.previewUrl) return;
    const audio = audioRef.current;

    // update queue if provided
    if (allSongs.length) {
      setQueue(allSongs);
      const index = allSongs.findIndex((s) => s.trackId === track.trackId);
      setCurrentIndex(index !== -1 ? index : 0);
    }

    setCurrentTrack(track);
    const url = proxify(track.previewUrl);

    // load and play (update isPlaying only if play succeeds)
    audio.pause();
    audio.src = url;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      });
  };

  // toggle play / pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) return; // nothing to play
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

  // next track
  const nextTrack = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    const next = queue[nextIndex];
    setCurrentIndex(nextIndex);
    setCurrentTrack(next);

    const audio = audioRef.current;
    audio.pause();
    audio.src = proxify(next.previewUrl);
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  // previous track
  const prevTrack = () => {
    if (queue.length === 0) return;
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    const prev = queue[prevIndex];
    setCurrentIndex(prevIndex);
    setCurrentTrack(prev);

    const audio = audioRef.current;
    audio.pause();
    audio.src = proxify(prev.previewUrl);
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  // like/unlike
  const toggleLikeSong = (song) => {
    const exists = likedSongs.find((s) => s.trackId === song.trackId);
    const updated = exists
      ? likedSongs.filter((s) => s.trackId !== song.trackId)
      : [...likedSongs, song];
    setLikedSongs(updated);
  };

  // playlist management
  const createPlaylist = (name) => {
    if (!name?.trim()) return;
    const exists = playlists.find((p) => p.name.toLowerCase() === name.toLowerCase());
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

  // save lists to localStorage
  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  // sync audio element events to context state (timeupdate, duration, ended)
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      // auto next
      if (queue.length > 0) nextTrack();
      else setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex]);

  // clean up on unmount
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // seek function
  const seekAudio = (time) => {
    const audio = audioRef.current;
    if (!isNaN(time) && audio.src) {
      audio.currentTime = Math.max(0, Math.min(time, audio.duration || time));
      setCurrentTime(audio.currentTime);
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
        audioRef, // exposed in case you want to directly access it (optional)
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
