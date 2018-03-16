require('dotenv').config();

'use strict';

console.log("Starting process");


const getFile = require('./getFile');
const unZip = require('./unZip');
const processData = require('./processData');
const convertToCsv = require('./convertToCSV');
const uploadToS3 = require('./uploadToS3');

getFile()
    .then(unZip)
    .then(processData)
    .then(convertToCsv)
    .then(uploadToS3)
    .catch(err => {console.error(err)});

