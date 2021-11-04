var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  membership: {type: Boolean, default: false},
  avatar: { 
    type: String, 
    enum: ['alien', 'clown', 'cowboy', 'devil', 'evil', 'ghost', 'robot', 'spy'],
    default: 'alien',
    required: true
  },
  is_admin: {type: Boolean, default: false}
})

UserSchema
.virtual('full_name')
.get(() => {
  return `${first_name} ${last_name}`;
})

module.exports = mongoose.model('User', UserSchema)