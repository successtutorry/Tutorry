var password = '';

//function to do tasks related to email
function myFunction(useremail,flag) {
  var x = useremail;
  if(!x){
    document.getElementById('error').innerHTML = "Email is empty";
    alert('Email is empty');
  }else{
    var valid = emailVaild(x);
    //if email is valid then check if email exists in database
    if(valid){
    checkifEmailExists(x,flag);
    }else{
    document.getElementById('error').innerHTML = "Invalid email format";
    alert('Invalid email format')
    }
  }
}

//function which will validate the format of the email id
function emailVaild(email){
   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// function which sends email to server to check if it exisit in database or not
function checkifEmailExists(x,flag){
  $.get('/users/checkUserInDatabase'+ x , function(data, status){
   if(data=='true'&& flag=='1'){
      document.getElementById('error').innerHTML = "";
      // $('#notifyModal').modal('show');
   }
   if(data=='true'&& flag=='2'){
      document.getElementById('error').innerHTML = "";
      document.getElementById('registererror').innerHTML = "Email already existis";
      alert('Email already existis');
   }
   if(data=='false'&& flag=='1'){
     document.getElementById('error').innerHTML = "Email id does not exists";
     document.getElementById('registererror').innerHTML = "";
     alert('email does not exist');
   }

   if(data=='false'&& flag=='2'){
     document.getElementById('error').innerHTML = "Email id does not exists";
     document.getElementById('registererror').innerHTML = "";
   }
  });
}

//get password field value so that it can be used to match later with confirmpassword
function assignpasswordvalue(x){
  password = x;
}

//function to check if the password and confirmpassword is same or not
function checkconfirmpassword(){
  var confirmpassword = document.getElementById("inputConfirmPassword").value;
 if(password!=confirmpassword){
    document.getElementById('inputConfirmPassword').style = 'border-color:red';
    document.getElementById('registererror').style.color = "green";
    document.getElementById('registererror').innerHTML = "password did not match";
    alert('password did not match');
  }else{
    document.getElementById('inputConfirmPassword').style = '';
    document.getElementById('registererror').style.color = "green";
    document.getElementById('registererror').innerHTML = "password matched";
  }
}
