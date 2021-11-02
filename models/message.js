var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { DateTime } = require("luxon");

var MessageSchema = new Schema({
  title: {type: String, required: true},
  timestamp: {type: Date, default: Date.now},
  text: {type: String, required: true},
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

MessageSchema
.virtual('timestamp_formatted')
.get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Message', MessageSchema)