const express = require('express');
const cors = require('cors');
const searchesRoutes = require('./server/handle');
const sequelize = require('./config/db');
const Searches = require('./config/searchesDB');

const app = express();
const PORT = 2121;

app.use(cors());
app.use(express.json());

// Use the searches API routes
app.use('/api/searches', searchesRoutes);

sequelize.sync().then((async () => {

  const count = await Searches.count();
  if (count === 0) {
    await Searches.bulkCreate([
      { artist: 'The Beatles', country: 'UK', trackNumber: 12 },
      { artist: 'Drake', country: 'Canada', trackNumber: 9 },
      { artist: 'BTS', country: 'South Korea', trackNumber: 15 },
      { artist: 'Adele', country: 'UK', trackNumber: 8 },
      { artist: 'Taylor Swift', country: 'USA', trackNumber: 13 },
      { artist: 'Ed Sheeran', country: 'UK', trackNumber: 11 },
      { artist: 'Bad Bunny', country: 'Puerto Rico', trackNumber: 14 },
      { artist: 'BLACKPINK', country: 'South Korea', trackNumber: 10 },
      { artist: 'Weekend', country: 'Canada', trackNumber: 16 },
      { artist: 'Post Malone', country: 'USA', trackNumber: 7 },
    ]);
    console.log('Dummy search entries added to the database.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}));  
