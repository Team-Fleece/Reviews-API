const fs = require('fs');
const { pipeline, Transform } = require('stream');
const csv = require('csvtojson');

const inputStream = fs.createReadStream('../raw-csv-data/characteristic_reviews.csv');
const outputStream = fs.createWriteStream('../raw-csv-data/characteristic_reviews.ndjson');

const csvParser = csv();
let transformCount = 0;
let startTime = Date.now();

const transformStream = new Transform({
  transform(chunk, encoding, cb) {
    try {
      let characteristicReview = Object.assign({}, JSON.parse(chunk));
      characteristicReview = {
        id: characteristicReview.id,
        review_id: characteristicReview.review_id,
        url: characteristicReview.url,
      }
      transformCount++;
      if (transformCount % 1000 === 0) {
        console.log('successfully completed ', transformCount, ' transfers in ', Math.floor((Date.now() - startTime)/1000), ' seconds');
      }
      cb(null, JSON.stringify(characteristicReview) + '\n');
    } catch(err) {
      cb(err);
    }
  }
});

pipeline(inputStream, csvParser, transformStream, outputStream, err => {
  if (err) {
    console.log('Pipeline encountered an error. ', err);
  } else {
    console.log('Pipeline completed successfully in ', Math.floor((Date.now() - startTime)/1000), ' seconds!');
  }
});
