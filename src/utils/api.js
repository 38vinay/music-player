const BASE_URL = "https://itunes.apple.com/search";

export const searchMusic = async (query, type = "music") => {
  try {
    const response = await fetch(`${BASE_URL}?term=${query}&media=${type}&limit=100`);
    const data = await response.json();
    return data.results;
  } catch (err) {
    console.error("Error fetching from iTunes API:", err);
    return [];
  }
};
