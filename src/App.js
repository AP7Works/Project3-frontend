import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [message, setMessage] = useState("");
  const [songOfTheDay, setSongOfTheDay] = useState(null);

  // Use the environment variable for the backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Fetch the Song of the Day when the component mounts
  useEffect(() => {
    const fetchSongOfTheDay = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/songs/songoftheday`); // Use environment variable
        const data = await response.json();

        if (data.success) {
          setSongOfTheDay(data.data);
        } else {
          console.error('Failed to fetch song of the day');
        }
      } catch (error) {
        console.error('Error fetching song of the day:', error);
      }
    };

    fetchSongOfTheDay();
  }, [BACKEND_URL]);

  const handleSearch = async () => {
    setMessage(""); // Clear previous messages
    setSongs([]);   // Clear previous results
    let url = "";

    switch (searchType) {
      case "all":
        url = `${BACKEND_URL}/api/songs/getall`; // Updated URL
        break;
      case "artist":
        url = `${BACKEND_URL}/api/songs/search?artist=${searchInput}`; // Updated URL
        break;
      case "top5":
        url = `${BACKEND_URL}/api/songs/top5`; // Updated URL
        break;
      case "details":
        url = `${BACKEND_URL}/api/songs/get/${searchInput}`; // Updated URL
        break;
      default:
        setMessage("Please select a valid search option.");
        return;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setSongs(searchType === "details" ? [data.data] : data.data);
        if (data.data.length === 0) setMessage("No results found.");
      } else {
        setMessage(data.message || "Error fetching data.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching data.");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-left">Welcome to your music database</h1>

      {/* Song of the Day Section */}
      {songOfTheDay && (
        <div className="mt-4">
          <h3>Here is your song for today:</h3>
          <p><strong>{songOfTheDay.title}</strong> by {songOfTheDay.artist}</p>
        </div>
      )}

      {/* Search Form */}
      <div className="mt-4">
        <div className="mb-3">
          <label htmlFor="searchType" className="form-label">Search Type</label>
          <select
            id="searchType"
            className="form-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="">--Select an option--</option>
            <option value="all">Display all songs</option>
            <option value="artist">Search by artist</option>
            <option value="top5">Fetch top 5 songs</option>
            <option value="details">Get song details by ID</option>
          </select>
        </div>
        {searchType !== "all" && searchType !== "top5" && (
          <div className="mb-3">
            <label htmlFor="searchInput" className="form-label">Search Input</label>
            <input
              type="text"
              id="searchInput"
              className="form-control"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        )}
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {message && <p className="mt-3 text-danger">{message}</p>}

      {songs.length > 0 && (
        <div className="mt-4">
          <h2>Search Results</h2>
          <ul className="list-group">
            {songs.map((song) => (
              <li key={song._id} className="list-group-item">
                <strong>{song.title}</strong> by {song.artist} <br />
                Album: {song.album || "N/A"} | Genre: {song.genre || "N/A"} <br />
                Year: {song.year || "N/A"} | Rating: {song.rating || "N/A"} <br />
                ID: {song._id} <br />
                Release Date: {song.releaseDate ? new Date(song.releaseDate).toLocaleDateString() : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
