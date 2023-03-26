const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      min:3,
      max:20,
      unique: true
    },
    email: {
      type: String,
      require: true,
      max: 50,
      unique: true
    },
    password: {
      type: String,
      require: true,
      min: 6
    },
    verification_code: {
      type: String,
      required: false,
    },
    reset_code: {
      type: String,
      required: false,
    },
    verified: {
      type: Boolean,
      default: false,
      required: false,
    },
    // posts: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Post',
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);