const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  title: {
    type: String,
    required: true,
    min: 3
  },
  desc: {
    type: String,
    required: true,
    min: 3
  },
  rating: {
    type: Number,
    require: true,
    min: 0,
    max: 5
  },
  latitude: {
    type: Number,
    require: true
  },
  longitude: {
    type: Number,
    require: true
  }
});

module.exports = mongoose.model('Pin', pinSchema);