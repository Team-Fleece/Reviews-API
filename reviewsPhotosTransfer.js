const fs = require('fs');
const { pipeline, Transform } = require('stream');
const csv = require('csvtojson');

const inputStream = fs.createReadStream('../raw-csv-data/reviews_photos.csv');
const outputStream = fs.createWriteStream('../raw-csv-data/reviews_photos.ndjson');

const csvParser = csv();
let transformCount = 0;
let startTime = Date.now();

const transformStream = new Transform({
  transform(chunk, encoding, cb) {
    try {
      let reviewPhoto = Object.assign({}, JSON.parse(chunk));
      reviewPhoto = {
        id: reviewPhoto.id,
        review_id: reviewPhoto.review_id,
        url: reviewPhoto.url,
      }
      transformCount++;
      if (transformCount % 1000 === 0) {
        console.log('successfully completed ', transformCount, ' transfers in ', (Date.now() - startTime), ' seconds');
      }
      cb(null, JSON.stringify(reviewPhoto) + '\n');
    } catch(err) {
      cb(err);
    }
  }
});

pipeline(inputStream, csvParser, transformStream, outputStream, err => {
  if (err) {
    console.log('Pipeline encountered an error. ', err);
  } else {
    console.log('Pipeline completed successfully in ', (Date.now() - startTime), ' seconds!');
  }
});
