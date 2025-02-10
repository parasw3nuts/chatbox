// models/message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', MessageSchema);