'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseToCsv = require('mongoose-to-csv')

const certificateModel = new Schema({
  url: { type: String, required: true },
  poNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  downloaded: { type: Date, required: false }
});

certificateModel.plugin(mongooseToCsv, {
  headers: 'url poNumber',
  constraints: {
    'url': 'url',
    'poNumber': 'poNumber'
  }
});

module.exports = mongoose.model('Certificate', certificateModel);
