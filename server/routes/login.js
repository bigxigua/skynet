var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/login', function(req, res, next) {
  console.log('0------000')
  res.render('/dist/index', { title: 'login' });
  next();
});


module.exports = router;
