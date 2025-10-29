import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-bootstrap";
import SongList from "../components/Loader";
import { MusicContext } from "../context/MusicContext";

export default function Home() {
  const [songs, setSongs] = useState([]);
  const { playTrack } = useContext(MusicContext);

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch(
        "https://itunes.apple.com/search?term=honeysingh&entity=song&limit=20"
      );
      const data = await res.json();
      setSongs(data.results);
    };
    fetchSongs();
  }, []);

  return (
    <div className="text-light" style={{ paddingTop: "80px" }}>
      {/* 🎵 Carousel Section */}
      <Carousel fade interval={3000} className="mb-5 rounded shadow">
        {songs.slice(0, 5).map((song, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                position: "relative",
                height: "400px", // 🔹 Reduced height from 400px to 250px
                width: "100%",
                backgroundSize: "contain",
                backgroundRepeat:"no-repeat",
                backgroundPosition: "center",
                borderRadius: "15px",
                overflow: "hidden",
                backgroundImage: `url(${song.artworkUrl100.replace(
                  "100x100bb",
                  "1000x1000bb"
                )})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  width: "100%",
                  padding: "15px",
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))",
                }}
              >
                <h5 className="fw-bold m-0">{song.trackName}</h5>
                <small className="text-light">{song.artistName}</small>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* 🔥 Trending Songs */}
      <h3 className="mb-4">🔥 Trending Songs</h3>
      <SongList songs={songs} onPlay={playTrack} />
    </div>
  );
}
