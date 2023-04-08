const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  secret: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  revoked: {
    type: Boolean,
    required: true,
    default: false,
  },
//   createdAt: {},
//   updatedAt: {},
});

module.exports = mongoose.model('AuthClients', schema);