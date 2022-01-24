const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'himmat',
  host: 'localhost',
  database: 'mydb',
  password: 'boardtoadsilversock',
  port: 5432,
  // idleTimeoutMillis: 0,
  // connectionTimeoutMillis: 0,
})

const sortHelpful = (reviewList) => {
  return reviewList.sort((a, b) => b.helpfulness - a.helpfulness);
}

const sortNewest = (reviewList) => {
  return reviewList.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

//bases sort on combination of helpfulness and newness, valuing each helpful count at Math.pow(10, 8)
const sortRelevant = (reviewList) => {
  return reviewList.sort((a, b) => {
    return
      (Date.parse(b.date)/Math.pow(10, 8) + b.helpfulness)
      -
      (Date.parse(a.date)/Math.pow(10, 8) + a.helpfulness);
  })
}

module.exports.getReviews = ({page = 0, count = 5, sort, product_id = 1}) => {
  product_id = 2; //use valid product ID while still using sample data
  let order = 'helpfulness DESC, date DESC';
  if (sort === 'helpful') {
    order = 'helpfulness DESC';
  } else if (sort === 'newest') {
    order = 'date DESC';
  }
  return pool
    .query(`SELECT * FROM reviews WHERE product_id = ${product_id} ORDER BY ${order} LIMIT ${count} OFFSET ${page};`)
}

module.exports.getPhotos = (review_id) => {
  // console.log('review ID: ', review_id);
  return pool
    .query(`SELECT id, url FROM reviews_photos WHERE review_id = ${review_id};`)
    .then(photos => {
      // console.log('PHOTOS QUERY: ', photos);
      return photos.rows;
    })
}

module.exports.getReviewsMeta = ({product_id = 1}) => {
  product_id = 2; //use valid product ID while still using sample data
  //product_id from reviews
  //ratings added up from each review
  //recommend added up from each review
  //characteristics
  return pool
    .query(`SELECT * FROM reviews WHERE product_id = ${product_id};`)
}

