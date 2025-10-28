const dotenv = require('dotenv');
dotenv.config({ path: './dev-data/config.env' });
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const mongoose = require('mongoose');
const { json } = require('stream/consumers');
const { type } = require('os');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const Upgradederror = require('./utilities/apperror');
const globalErrorHandlere = require('./controller/globalErrorController');

const rate = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests!, plz try again later',
});

const e = express();
e.use(morgan('dev'));
e.use(express.json());
e.use('/api', rate);
e.use(helmet());
e.use(sanitize());
e.use(xss());
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
dbConnect().catch((err) => console.log(err));
async function dbConnect() {
  await mongoose.connect(DB).then(() => console.log('successful connection'));
}

e.use('/api/v1/tourRoutes', tourRoutes);
e.use('/api/v1/usersRoutes', userRoutes);
e.use('/api/v1/reviewRoutes', reviewRoutes);
e.all('', (req, res, next) => {
  next(new Upgradederror(`URL ${req.originalUrl} is not definded`, '404'));
});

e.use(globalErrorHandlere);

const port = parseInt(process.env.PORT);
e.listen(port, () => {
  console.log(' server is running on port' + `${port}`);
});
