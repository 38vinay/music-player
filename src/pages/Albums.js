import React, { useState, useContext } from "react";
import SongList from "../components/Loader";
import SearchBar from "../components/SearchResults";
import { MusicContext } from "../context/MusicContext";
import { searchMusic } from "../utils/api";

export default function Search() {
  const [results, setResults] = useState([]);
  const { playTrack } = useContext(MusicContext);

  const handleSearch = async (query) => {
    const data = await searchMusic(query);
    setResults(data);
  };

  return (
    <div className="text-light">
      <h3 className="mb-3">🔍 Search Music</h3>
      <SearchBar onSearch={handleSearch} />
      <SongList songs={results} onPlay={playTrack} />
    </div>
  );
}
