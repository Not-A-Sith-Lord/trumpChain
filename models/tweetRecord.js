const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetRecordSchema = new Schema({
  originalContent: String,
  receipt: Object
});

//actual model
const tweetRecord = mongoose.model('tweetRecord', tweetRecordSchema);


module.exports = tweetRecord;