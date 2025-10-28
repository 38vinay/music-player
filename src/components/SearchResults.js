import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch(q.trim());
  };

  return (
    <form className="d-flex mb-3" onSubmit={submit}>
      <input
        className="form-control me-2 bg-secondary bg-opacity-10 text-light border-0"
        placeholder="Search artist, song or album..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button className="btn btn-success">Search</button>
    </form>
  );
};

export default SearchBar;
