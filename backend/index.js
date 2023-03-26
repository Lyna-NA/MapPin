//modules: require
const express = require('express');
const HttpError = require('./models/HttpError');
const dotenv = require('dotenv');
const rateLimitMiddleware = require('./middlewares/throttle');

//Configure dotenv
dotenv.config();

//modules: routes
const userRoutes = require('./routes/user-routes');
const pinRoutes = require('./routes/pin-routes');
const authRoutes = require('./routes/auth-routes');

//modules : mongoose
const mongoose = require('mongoose');

//express: instance
const app = express();

//app.use: json
app.use(express.json());

// apply the limiter to all requests
app.use(rateLimitMiddleware);

//app.use: routes
app.use('/api/users', userRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/auth', authRoutes);

//app.user: Fallback route
app.use('/', (req, res) => {
  throw new HttpError(404, 'Not Found');
});

//app.use: Thrown Error Handler
app.use((error, req, res, next) => {
  return res.status(error.code).json({ status: false, message: error.message });
});

//mongoose: connect
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB Connected!');

    //app: listen
    const server = app.listen(process.env.PORT, function () {
      console.log(`Backend Server Connected on port: ${server.address().port}`);
    });
  })
  .catch((error) => {
    console.log('Error!', error);
  });
