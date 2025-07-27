const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON body

const clientID = '4fb0cdafac7a4e3ca9eeba1b711aaf78';
const clientSecret = '0289b876c005418a848d30e6650f5941';

// Get Spotify access token
async function getSpotifyToken() {
  const authHeader = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

// Get artist ID from name
async function getArtistID(token, artistName) {
  const encodedName = encodeURIComponent(artistName);
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${encodedName}&type=artist&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.artists.items[0]?.id;
}

// Get top tracks
async function getTopTracks(token, artistID, country = 'US') {
  const response = await axios.get(
    `https://api.spotify.com/v1/artists/${artistID}/top-tracks?market=${country}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.tracks;
}

// Endpoint to get top tracks for artist
app.post('/api/spotify/top-tracks', async (req, res) => {
  try {
    const artistName = req.body.artist;
    const marketName = req.body.market;
    // console.log(marketName)
    if (!artistName) return res.status(400).json({ error: 'Artist name is required' });

    const token = await getSpotifyToken();
    const artistID = await getArtistID(token, artistName);  

    if (!artistID) return res.status(404).json({ error: 'Artist not found' });

    const tracks = await getTopTracks(token, artistID, marketName);
    res.json(tracks);
  } catch (err) {
    console.error('Error fetching tracks:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
