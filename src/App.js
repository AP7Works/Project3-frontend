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
