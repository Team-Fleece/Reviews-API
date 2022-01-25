const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const query = require('./queries.js');

const app = express();
const port = 3030;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//listener to GET reviews for a product
app.get('/reviews', (req, res) => {
  // console.log('request: ', req);
  query.getReviews()
    .then(reviews => {
      console.log('reviews: ', reviews);
    })
    .catch(err => {
      console.log('error: ', err);
    })
});

//listener to GET metadata for a product
app.get('/reviews/meta', (req, res) => {

});

//listener to POST new review for a product
app.post('/reviews', (req, res) => {

});

//listener to PUT helpfulness for a review
app.put('/reviews', (req, res) => {

});

//listener to PUT reported for a review
app.put('/reviews', (req, res) => {

});

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});
