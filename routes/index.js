var express = require('express');
var router = express.Router();
//var keystone = require('keystone');

 /*GET home page.*/
router.get('/', function(req, res, next) {
  
  res.render('index', { title:'Tutorry' });
});


module.exports = router;
