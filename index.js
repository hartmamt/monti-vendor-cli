#!/usr/bin/env node

var program = require('commander');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const User = require('./models/User');
const Certificate = require('./models/Certificate');
const fs = require('fs');


const image_downloader = require('image-downloader');

program
 .arguments('<file>')
 .option('--connection <mongodb://username:password@host:port/database>', 'The db host and port')
 .option('--file <filename>', 'The name of the generated csv file.')
 .option('--csvpath <path to csv>', 'path to csv file')
 .option('--certificateDir <path to certificateDir>', 'path to certificateDir')
 .action(function() {
   console.log('connection: %s file: %s',
       program.connection, program.file);
 })
 .parse(process.argv)

const dbUrl = program.connection; //process.env.MONGODB_URI || 'mongodb://localhost:27017/montivendor-dev';


  mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbUrl);
    console.log(program.file)
  });

  mongoose.connection.once('open', () => {
    Certificate
      .find()
      .exec((err, certificates) => {
        if (err) {
          console.log(err)
        } else {
          certificates.map( (cert) => {
            var options = {
                url: 'https://montivendor.s3.amazonaws.com/' + cert.url,
                dest: program.certificateDir,                  // Save to /path/to/dest/image.jpg
                done: function(err, filename, image) {
                    if (err) {
                        throw err;
                    }
                },
            }
            image_downloader(options)
            cert.downloaded = Date.now()
            cert.save()
          })
        }
      })
      .then(function(docs) {
          Certificate.csvReadStream(docs)
            .pipe(fs.createWriteStream(program.csvpath + program.file, { 'flags': 'a' }));
      })
      .finally(()=> mongoose.connection.close())
  })

  mongoose.connect(dbUrl);

  // If the Node process ends, close the Mongoose connection
  process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose default connection disconnected through app termination');
      process.exit(0);
    });
  });
