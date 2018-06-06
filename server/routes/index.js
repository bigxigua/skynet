var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('-----------index-----')
  res.render('/dist/index', { title: 'skyNet' });
  next();
});

router.get('/login', function(req, res, next) {
  res.render('/dist/index', { title: 'login' });
  next();
});


module.exports = router;
