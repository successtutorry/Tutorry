var express = require('express');
var router = express.Router();
const Joi = require('joi');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const mailer = require('../misc/mailer');
const url = require('url');
const bodyParser = require('body-parser');
const messageForm = require('../models/message');
const requirementForm = require('../models/requirement');
const tutor = require('../models/tutorregistration');
//const tutor = require('../models/tutors');
const request = require('request');
const User = require('../models/user');
//const Profile = require('../models/profile');
const passport = require('passport');
const randomstring = require('randomstring');
const springedge = require('springedge');
var email ='';
var username = '';

//if user is trying to access his home page without login then he is restricted
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error', 'Sorry, but you must be registered or logged in  first!');
    res.redirect('/');
  }
};
// if user is already logged in and still wants to access something which can be
// accessed only when the user is logged in then a message prompts that he is
// already logged in
const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('error', 'Sorry, but you are already logged in!');
    res.redirect('/');
  } else {
    return next();
  }
};


const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required(),
  usertype: Joi.string().required()
});

router.route('/register')
  .post(isNotAuthenticated, async (req, res, next) => {
    try {
      const result = Joi.validate(req.body, userSchema);
      if (result.error) {
        console.log(result.error);
        req.flash('error', 'Data is not valid. Please try again.');
        res.redirect('/');
        return;
      }

      // When new user is registering , the email he puts is checked if
      // that email is registered with some other user.
      const user = await User.findOne({ 'email': result.value.email });
      console.log(user);
      if (user) {
        req.flash('error', 'Email is already in use. Please check your email');
        res.redirect('/');
        return;
      }

      // password is hashed so that is not visible to anyone the way the user inputs
      const hash = await User.hashPassword(result.value.password);
      // Generate secret token while registeration which will be used for account verification
      const secretToken = randomstring.generate();
      console.log('secretToken', secretToken);
      // secret code generated while registration is Saved to the DB
      result.value.secretToken = secretToken;
      // Flag account as inactive while registeration to restrict him from not accessing
      // without account verification, Once the account is verified it is set back to true.
      result.value.active = false;
      result.value.profilecomplete = false;
      // Save user to DB
      // We dnt need confirm password and password both to be save in the  database so it
      // deleted before entering the details in the DB
      delete result.value.confirmationPassword;
      result.value.password = hash;
      const newUser = await new User(result.value);
      console.log('newUser', newUser);
      await newUser.save();
      // Compose email After the details are saved in the database
      //this is the email which will be send to the user
      const link = "http://127.0.0.1:3000/users/verify?id="+result.value.secretToken;
      const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following token:
      <br/>
      Token: <b>${secretToken}</b>
      <br/>
       <a href="${link}">please click on the link</a>
      <br/><br/>
      Have a pleasant day.`
      // Send email
      await mailer.sendEmail('tutorry.in@gmail.com', result.value.email, '', html);
      req.flash('success', 'An email verification code has been sent to you email account, Please check your email and click on the link to complete registration');
      res.redirect('/');

    } catch(error) {
      next(error);
    }
  });

// user email verification
  router.route('/verify')
  .get(isNotAuthenticated, async (req,res)=>{
    try{
    console.log('request recieved');
    const token = req.query.id;
    await User.updateOne(
      { secretToken: token },
      {
        $set: { active: true }
      },function(err,res){
        if(err){
          throw err;
        }else{
          console.log('user verified');
          return;
        }
      }
);
  res.redirect('/');
}catch(error){
  console.log(error);
}
});

// this route is executed when the user tries to login
router.route('/login')
.post(isNotAuthenticated, passport.authenticate('local', {
    //successReturnToOrRedirect: '/',
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  }));

  router.route('/login')
  .get((req,res)=>{

    res.render('index',{value:'1'});
  });

  router.route('/dashboard')
  .get(isAuthenticated, (req, res) =>{
    req.flash('success', 'Successfully logged in');
  /*  console.log(req.sessionID);
    if(req.user.country =='student'){
      console.log('student');

    }
    else{
      console.log('tutor');
    }
    if(req.user.profilecomplete){
      console.log('your profile is complete');

    }else{

      console.log('complete your profile');
    //  res.render('student_profile');
    }
    console.log('welcome'+req.user.username);*/
    username = req.user.username;
    res.render('index', { username:req.user.username })
  });


  router.route('/logout')
  .get(isAuthenticated, (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out. Hope to see you soon!');
    res.redirect('/');
  });

  router.route('/forgotPassword')
   .get(isNotAuthenticated,(req,res)=>{
   res.render('passwordRecovery');

 }).post(async (req,res)=>{

   try{

 var emailId = req.body.email;
 const userExists = await User.findOne({'email': req.body.email});

 if(userExists){
   const link = "http://127.0.0.1:3000/users/changePassword?email="+req.body.email;
   const html = `
       Please click on the following link to reset your password
       <br/>
       <br/>
        <a href="${link}">please click this</a>
       <br/><br/>
       Have a pleasant day.`
       // Send email
       await mailer.sendEmail('tutorry.in@gmail.com', req.body.email, '', html);
       console.log('Link has been send to you on you email id.');
       res.redirect('/');

 }else{
     console.log('user does not exists or incorrect email id...');
 }
}catch(error){
 console.log(error);
}
 });

 router.route('/changePassword')
 .get((req,res)=>{
 //console.log(req.query.email);
 email = req.query.email;
   res.render('passwordRecovery_1',{email:req.query.email});

 }).post(async (req,res)=>{
   console.log("coming from email"+ email);

   try{

     if(req.body.password==req.body.confirmationPassword){
       console.log('password matched');
       const hashed = await User.hashPassword(req.body.password);
       console.log(hashed);

       const changedPassword = await User.update(
         { email: email },
         {
           $set: { password: hashed }
         }
         );

   console.log(changedPassword);
   if(changedPassword){
     email='';
     res.redirect('/');
     return;
   } else{
     console.log('some error in changing password');
   }
 }
 }catch(error){
     console.log(error);
 }
 });

 router.route('/checkAuth')
 .get((req,res)=>{
 if(req.isAuthenticated()){

   res.send('true');
 }else{
   res.send('false');
 }

 });

 /*const messageSchema = Joi.object().keys({
   name: Joi.string().required(),
   email: Joi.string().email().required(),
   phone: Joi.string().required(),
   subject: Joi.string().required(),
   message: Joi.string().required()
 });*/


 /*router.route('/message')
  .post(isAuthenticated, async (req, res) => {
    const result = Joi.validate(req.body, messageSchema);
    const contact_message = result.value.message;
    if (result.error) {
      console.log(result.error);
      res.redirect('/users/tutor_details');
    }
    const newmessage = await new messageForm(result.value);
    console.log('newmessage', newmessage);
    await newmessage.save();
    var rand = Math.floor((Math.random() * 100) + 54);
    const link = "http://127.0.0.1:3000/users/verify?id="+result.value.email;
    const html = `Hi there,
      <br/>
      Thank you for contacting us
      </br></br>
      We have recieved your message.
      </br>
      <b>${contact_message}</b>
      <br/> </br>
      <a href="${link}">${contact_message}</a>
      </br></br>
      We will reach back to you soon.
      <br/><br/>
      Have a pleasant day.`
      // Send email
      await mailer.sendEmail('tutorry.in@gmail.com', result.value.email, 'Message', html);
      res.redirect('/users/tutor_details');
});*/

router.route('/message')
.post(isAuthenticated, async (req,res) => {
try{
  console.log(req.body);
}catch(error){

  console.log(error);
}

});

router.route('/checkUserInDatabase:email')
.get(async(req,res)=>{

const user = await User.findOne({ 'email': req.params.email });
if(user){

  res.send('true');
}else{
  res.send('false');
}
});

router.route('/submitrequirement')
.post(isAuthenticated, (req,res) =>{

const newRequirement = new requirementForm({
  user:req.user,
  location:req.body.location,
  class:req.body.class
});
newRequirement.save();
res.render('find_tutor', req.user)
//res.redirect();
//  console.log(req.body);

});


/*router.route('/checkrequirementEixts')
.get(async(req,res)=>{
  console.log(req.user);

  const existingreq = await requirementForm.findOne({'user' : req.user  });
  console.log(existingreq);
  if(existingreq){

    res.send('true');
  }else{
    res.send('false');
  }
});*/

router.route('/find_tutor')
  .get((req, res) => {
    if(isAuthenticated){

    res.render('find_tutor', {username:username});
  }
  else{

      res.render('find_tutor');
  }
  });

router.route('/become_tutor')
    .get((req, res) => {
      res.render('become_tutor', {username:username});
    });

router.route('/contact')
    .get((req, res) => {
    res.render('contact', {username:username});
  });

  router.route('/tutor_details')
    .get((req, res) => {
      res.render('tutor_details');
    });

    router.route('/tutor_registration')
      .get((req, res) => {
        res.render('tutor-registration');
      });

      router.route('/tutor_registration')
      .post((req,res)=>{
        console.log(req.body);
        const newTutor = new tutor({
          image:req.body.image,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          dob: req.body.dob,
          gender: req.body.gender,
          contact: req.body.contact,
          address1: req.body.address1,
          address2: req.body.address2,
          zipcode: req.body.zipcode,
          schoolname: req.body.schoolname,
          collegename: req.body.collegename,
          degreecollegename: req.body.degreecollegename,
          postdegreecollegename: req.body.postdegreecollegename,
          schoolexp: req.body.schoolexp,
          collegeexp: req.body.collegeexp,
          instituteexp: req.body.instituteexp,
          privateexp: req.body.privateexp,
          experience: req.body.experience,
          homevisit: req.body.homevisit,
          demo: req.body.demo,
          rating:req.body.rating,
          availablearea:req.body['availablearea[]'],
          subjects:  req.body['subjects[]'],
          time: req.body['time[]'],
          days:  req.body['days[]'],
          class:  req.body['class[]'],
          rateperhour: req.body['rateperhour[]'],
          typeofstudent:  req.body['typeofstudent[]'],
          languages:  req.body['languages[]']
        });

        newTutor.save();
        res.render('tutor-registration');

      });


/*router.route('/view_tutor')
  .get((req, res) => {
  res.render('tutor_details');
});*/


  router.route('/view_tutor')
  .get((req, res) => {
    //var tutor_email = req.query.email;
    //console.log(req.query.current_tutor)
   tutor.findOne({ email:req.query.email },function(req,result){
     //console.log(result);
     //var current_tutor = result.email

     res.render('tutor_details', { firstname: result.firstname, lastname: result.lastname, subjects: result.subjects, rating: result.rating, image:result.image, price: result.rateperhour[0] });
});
});

  /*router.route('/message')
    .get((req, res) => {
    res.render('message');
  });*/




module.exports = router;
