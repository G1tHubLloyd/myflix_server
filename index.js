require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');

require('./config/passport')(passport);

const moviesRouter = require('./routes/movies');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/movies', moviesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
