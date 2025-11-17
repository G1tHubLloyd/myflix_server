const express = require('express');
const router = express.Router();
const movies = require('../data/movies.json');

// PUBLIC: GET /movies
router.get('/', (req, res) => {
    res.json(movies);
});

module.exports = router;
