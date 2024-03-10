const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true }, 
  password: { type: String, select: false } 
}, { collection: "UserBaseNode", versionKey: false});

const User = mongoose.model('UserBaseNode', userSchema);

module.exports = User;
