var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mailer = require('../misc/mailer');
const url = require('url');
const bodyParser = require('body-parser');
const messageForm = require('../models/message');
const requirementForm = require('../models/requirement');
const tutor = require('../models/tutorregistration');
const chat = require('../models/chat');
//const tutor = require('../models/tutors');
const request = require('request');
const User = require('../models/user');
//const Profile = require('../models/profile');
const passport = require('passport');
const randomstring = require('randomstring');
const springedge = require('springedge');

var subjects = [];
var fees = [];
var result1 = [];
var result2 = [];
var displaysubjects = [];

/*router.route('/find_tutor')
  .get((req, res) => {

  /*  if(req.query.subject && req.query.location && req.query.zipcode){
      console.log('all details');
    }else if(req.query.subject&&req.query.location){
      console.log('subject and location');
    }else if(req.query.location && req.query.zipcode){
      console.log('location and zipcode');
    }else if(req.query.subject && req.query.zipcode){
      console.log('subject and zipcode');
    }else if(req.query.subject){
      console.log('only subject');
    }else if(req.query.location){
      console.log('only location');
    }else if(req.query.zipcode){
      console.log('only zipcode');
    }else{
      console.log('nothing');
    }*/

    /*if(req.isAuthenticated()){
      res.render('find_tutor',{username:req.user.username});
    }else{
      console.log(req.query);
      if(req.query.subjects){
        subjects.push(req.query.subjects);
        tutor.find({subjects:req.query.subjects},(err, result)=>{
          result1 = result;
          if(result2!=null){
          var finalresult =   merge(result1,result2);
          res.render('find_tutor', {tutors:finalresult});
          }else{
          res.render('find_tutor',{tutors:result1});
          }
        });
      }*//*else if(req.query.rateperhour){
        fees.push(req.query.fees);
        tutor.find({rateperhour:req.query.rateperhour}, (err,result)=>{
          result2 = result;
          if(result1!=null){
            var finalresult = merge(result1,result2);
            res.render('find_tutor', {tutors:finalresult});
          }else{
            res.render('find_tutor',{tutors:result2});
          }

        })
      }*//*
      else{
      res.render('find_tutor');
    }

  }*/

  /*this is the correct one
  var tutorChunks = [];
  var chunkSize = 3;
  var query = {};
  if(req.query.subjects){
    var length = displaysubjects.length;
    //displaysubjects[length] = req.query.subjects;
    displaysubjects.push(req.query.subjects);
    console.log(displaysubjects);
     query = {subjects:req.query.subjects};
     console.log(query);
  }

  tutor.find(query, function(err, docs){
  for(var i=0; i < docs.length; i+= chunkSize){
      tutorChunks.push(docs.slice(i, i+chunkSize));
      console.log(tutorChunks);
  }
  if(req.isAuthenticated()){
    res.render('find_tutor', {tutors: tutorChunks, username:req.user.username});
  }else{
  //  console.log(tutorChunks);
    res.render('find_tutor', {tutors: tutorChunks, displaysub:displaysubjects });
}
});
});*/


router.route('/find_tutor')
  .get((req, res) => {
    var tutorChunks = [];
    var chunkSize = 3;
    query = '';
    if(req.query.search){
      query = JSON.parse(req.query.search);
      tutor.find(query, function(err, docs){
      for(var i=0; i < docs.length; i+= chunkSize){
          tutorChunks.push(docs.slice(i, i+chunkSize));
          console.log(tutorChunks);
      }
      res.json({tutors:tutorChunks});

  });
}else{

    tutor.find({ }, function(err, docs){
    for(var i=0; i < docs.length; i+= chunkSize){
        tutorChunks.push(docs.slice(i, i+chunkSize));
        console.log(tutorChunks);
    }
    res.render('find_tutor',{tutors:tutorChunks});


});
}
});


  function merge(tutorlist1, tutorlist2){
    var t;
    if (tutorlist2.length > tutorlist1.length) t = tutorlist2, tutorlist2 = tutorlist1, tutorlist1 = t; // indexOf to loop over shorter
    return tutorlist1.filter(function (e) {
        return tutorlist2.indexOf(e) > -1;
    });

  }



  module.exports = router;
