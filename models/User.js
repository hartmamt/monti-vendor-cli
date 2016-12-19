'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv')

const userModel = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  company: { type: String, required: true }
});

userModel.plugin(mongooseToCsv, {
  headers: 'email username company',
  constraints: {
    'email': 'email',
    'username': 'username',
    'company': 'company'
  }//,
  // virtuals: {
  //   'Firstname': function(doc) {
  //     return doc.fullname.split(' ')[0];
  //   },
  //   'Lastname': function(doc) {
  //     return doc.fullname.split(' ')[1];
  //   }
  // }
});

module.exports = mongoose.model('User', userModel);
