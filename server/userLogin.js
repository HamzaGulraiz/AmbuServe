const mongoose = require('mongoose');
const userLoginSchema = mongoose.Schema({
  email: String,
  password: String,
});

module.exports = mongoose.model('userregisters', userLoginSchema);
