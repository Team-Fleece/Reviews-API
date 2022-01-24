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
  //TODO: skip review if reported = t
  return pool
    .query(`SELECT * FROM reviews WHERE product_id = ${product_id} ORDER BY ${order} LIMIT ${count} OFFSET ${page};`)
}

module.exports.getPhotos = (review_id) => {
  return pool
    .query(`SELECT id, url FROM reviews_photos WHERE review_id = ${review_id};`)
    .then(photos => {
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
  //need reponse to look something like this:  {
  //   product_id: '37312',
  //   ratings: { '2': '1', '3': '5', '4': '2', '5': '3' },
  //   recommended: { false: '2', true: '9' },
  //   characteristics: { Quality: { id: 125035, value: '4.0000000000000000' } }
  //   }
}

module.exports.postReview = ({
  product_id,
  rating,
  summary,
  body,
  recommend,
  name,
  email,
  photos, //maybe photos go to a separate query
  characteristics //maybe these go to a separate query also
}) => {
  return pool
    .query(`INSERT INTO reviews...`) //need to add review data to 'review' table as well
    //also insert data into 'reviews_photos' if there are photos
    //also insert score for each characteristic in 'characteristic_reviews'
}

module.exports.markReviewHelpful = (review_id) => {
  review_id = 2; //use valid product ID while still using sample data
  return pool
    .query(`UPDATE reviews SET helpfulness = helpfulness+1 WHERE id=${review_id}`)
}

module.exports.reportReview = (review_id) => {
  review_id = 2; //use valid product ID while still using sample data
  return pool
    .query(`UPDATE reviews SET reported = 't' WHERE id=${review_id}`)
}
