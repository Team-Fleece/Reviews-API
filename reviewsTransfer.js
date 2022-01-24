const fs = require('fs');
const { pipeline, Transform } = require('stream');
const csv = require('csvtojson');

const inputStream = fs.createReadStream('../raw-csv-data/reviews.csv');
const outputStream = fs.createWriteStream('../raw-csv-data/reviews.ndjson');

const csvParser = csv();
let transformCount = 0;

const transformStream = new Transform({
  transform(chunk, encoding, cb) {
    try {
      let review = Object.assign({}, JSON.parse(chunk));
      review = {
        id: review.id,
        product_id: review.product_id,
        rating: review.rating,
        date: review.date,
        summary: review.summary,
        body: review.body,
        recommend: review.recommend,
        reported: review.reported,
        reviewer_name: review.reviewer_name,
        reviewer_email: review.reviewer_email,
        response: review.response,
        helpfulness: review.helpfulness
      }
      transformCount++;
      console.log('successfully completed ', transformCount, ' transfers');
      cb(null, JSON.stringify(review) + '\n');
    } catch(err) {
      cb(err);
    }
  }
});

pipeline(inputStream, csvParser, transformStream, outputStream, err => {
  if (err) {
    console.log('Pipeline encountered an error. ', err);
  } else {
    console.log('Pipeline completed successfully!');
  }
});


//id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness

// const { Pool, Client } = require('pg');

// const pool = new Pool({
//   user: 'himmat',
//   host: 'localhost',
//   database: 'mydb',
//   password: 'boardtoadsilversock',
//   port: 5432,
//   // idleTimeoutMillis: 0,
//   // connectionTimeoutMillis: 0,
// })

// fs.createReadStream('../raw-csv-data/reviews.csv', ) {

// }

