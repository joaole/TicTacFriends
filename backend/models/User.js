const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profileImage: { type: String, default: 'https://i.imgur.com/0Jh9ax5.png' },
  });
  
  module.exports = mongoose.model('User', userSchema);