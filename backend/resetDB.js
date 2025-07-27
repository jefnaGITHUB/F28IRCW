const Searches = require('./config/searchesDB');

async function resetDatabase() {
  try {
    console.log('Resetting database...');
    await Searches.destroy({
        where: {},
        truncate: true,
        force: true,
      });
    console.log('Database reset.');
  } catch (err) {
    console.error('Error resetting DB:', err);
  }
}

// Call function if run directly from CLI
if (require.main === module) {
  resetDatabase();
}