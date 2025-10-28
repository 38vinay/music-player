import React, { useEffect, useState, useContext } from "react";
import SongList from "../components/Loader";
import { MusicContext } from "../context/MusicContext";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const { playTrack } = useContext(MusicContext);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch("https://itunes.apple.com/search?term=honeysingh&entity=song&limit=20");
      const data = await res.json();
      setSongs(data.results);
    };
    fetchSongs();
  }, []);

  return (
    <div className="text-light">
      <h3 className="mb-4">🔥 Trending Songs</h3>
      <SongList songs={songs} onPlay={playTrack} />
    </div>
  );
}
