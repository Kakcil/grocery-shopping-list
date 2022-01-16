var express = require('express');
var router = express.Router();

// gets welcome page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
