var mongoose = require('mongoose');
var User = require('./user');

var ProcessSchema = new mongoose.Schema({
  time: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    unique: false,
    required: true,
    trim: true
  },
  status: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  progress: {
    type:  mongoose.Schema.Types.Number ,
    unique: false,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    unique: false,
    required: true,
    trim: true,
    ref: User
  },
});
var Process = mongoose.model('Process', ProcessSchema);
module.exports = Process;