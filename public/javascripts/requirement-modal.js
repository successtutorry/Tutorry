var currentTab = 0; // Current tab is set to be the first tab (0)
var progressdisplay = 1;
var checked = 0;
showTab(currentTab); // Display the current tab

function showTab(n) {

document.getElementById('error').style = 'display:none;';
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
//  alert('displaying tab'+ n);
  x[n].style.display = "block";
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }

}

function nextPrev(n) {

if(n=='1'){
//alert('clicked next , moved to shownext function');
shownext(1);
}

else{

//alert('clicked prev , move to showprev function');
showprev(-1);

}

}

function shownext(n){
//alert('inside shownext');
//alert('checked value is'+ checked);
if ($('input[type=radio]:checked').length > checked) {
    // do something here
	//alert('something is selected');
	// This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
   var progress = document.getElementById('progress');

  // Hide the current tab:
  //alert('hiding current tab' + currentTab);
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:

  currentTab = currentTab + n;
  //alert('getting ready to display next tab', currentTab);
 /* progressdisplay = progressdisplay + 1;
  progress.style.width = 6.6666*progressdisplay + "%";*/
  progress.style.width = 6.6666*(currentTab+1) + "%";

  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:

  showTab(currentTab);
  checked = checked + 1;

}else{
document.getElementById('error').style = 'text-align:center; display:block;  color:red;';

}
}


function showprev(n){
//alert('inside previous function');
 var x = document.getElementsByClassName("tab");
   var progress = document.getElementById('progress');

  // Hide the current tab:
 //alert('hiding current tab' + currentTab);
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:

  currentTab = currentTab + n;
  //alert('getting ready to display next tab', currentTab);
 /* progressdisplay = progressdisplay + 1;
  progress.style.width = 6.6666*progressdisplay + "%";*/
  progress.style.width = 6.6666*(currentTab+1) + "%";

  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:

 checked = checked - 1;
 //alert('reducing value of checked' + checked);

  showTab(currentTab);
}

function alertuser(){
//alert('inside alertuser');
var header = document.getElementsByClassName("modal-body-title");
header[currentTab].innerHTML = 'Are you sure you want to quit?<br><a style="text-decoration:none; font-size:18px; color:blue; cursor:pointer;" href="" data-dismiss="modal">Cancel Request?</a><br><a style="text-decoration:none;font-size:18px; color:blue; cursor:pointer;" href="#"  onclick="javascript:showTab(currentTab)">Continue Request?</a>';

}
