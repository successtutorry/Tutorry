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


router.route('/find_tutor')
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

    
res.render('find_tutor');

//console.log(req.query);

  });



  module.exports = router;
