const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// create db schema to query
const Searches = sequelize.define('Searches', {
    artist: DataTypes.STRING,
    country: DataTypes.STRING,
    trackNumber: DataTypes.INTEGER,
}, {
    timestamps: true,  // enables createdAt and updatedAt columns automatically
});

module.exports = Searches;
