const express = require('express')
const router = express.Router()
const { fn } = require('sequelize')
const Searches = require('../config/searchesDB')

// handles the mysql2 query
router.get('/', async (req, res) => {
  try {
    const latestSearches = await Searches.findAll({
      attributes: ['artist', 'country', 'trackNumber'],
      order: [['createdAt', 'DESC']],  // assumes timestamps enabled, if not enable in model
      limit: 20,
    });

    res.json(latestSearches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch latest searches' });
  }
});

// POST new search entry
router.post('/', async (req, res) => {
  const { artist, country, trackNumber } = req.body;

  if (!artist || !country || typeof trackNumber !== 'number') {
    return res.status(400).json({ error: 'artist, country and numeric trackNumber are required' });
  }

  try {
    const newSearch = await Searches.create({ artist, country, trackNumber });
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create new search' });
  }
});

router.get('/topic', async (req, res) => {
  try{
    const randomTopic = await Searches.findOne({
      attributes: ['artist'],
      order: [fn('RAND')],  // gets random entry
      limit: 1,
    })

    console.log(randomTopic);

    res.json(randomTopic);
  }
  catch (err){
    console.log(err);
    res.status(500).json({error : 'Failed to fetch artist for topic'})
  }
})

module.exports = router;
