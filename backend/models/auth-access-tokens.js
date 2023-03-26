const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  expiresIn: {
    type: Schema.Types.Date,
    required: true,
  },
  revoked: {
    type: Schema.Types.Boolean,
    required: true,
    default: false,
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'AuthClients',
    required: true,
  },
});

module.exports = mongoose.model('AuthAccessTokens', schema);