var express = require('express');
var router = express.Router();
const tutor = require('../models/tutorregistration');

 /*GET home page.*/
/*router.get('/', function(req, res, next) {

  res.render('index', { title:'Tutorry' });
});*/
var catchurl = '';
router.get('/', (req, res) => {
  //console.log('url is' + req.url);

  var tutorChunks = [];
  var chunkSize = 3;
  if(req.isAuthenticated()){
    tutor.find( { }, function(err, docs){
    for(var i=0; i < docs.length; i+= chunkSize){
        tutorChunks.push(docs.slice(i, i+chunkSize));
    }
      res.render('index', {  tutors: tutorChunks, username:req.user.username });
    });

  }else{
      //catchurl = req.originalUrl;
      tutor.find( { }, function(err, docs){
      for(var i=0; i < docs.length; i+= chunkSize){
          tutorChunks.push(docs.slice(i, i+chunkSize));
      }
        res.render('index', {  tutors: tutorChunks });
      });
    }
});


module.exports = router;
