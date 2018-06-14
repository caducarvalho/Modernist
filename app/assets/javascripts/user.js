// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks

ready = function() {
  if (document.getElementById('password-criteria')) {
    validatePassword();
  }
};

validatePassword = function(){
  var pswInput =   document.getElementById('user_password'),
      cnfInput =   document.getElementById('user_password_confirmation'),
      criteria =   document.getElementById('password-criteria'),
      lowerList =  document.getElementById('criteria-lower'),
      upperList =  document.getElementById('criteria-upper'),
      numberList = document.getElementById('criteria-number'),
      lengthList = document.getElementById('criteria-length'),
      lower =      false,
      upper =      false,
      number =     false,
      length =     false;

  pswInput.onfocus = function(){
    criteria.classList.remove('hide');
  }
  pswInput.onblur = function(){
    criteria.classList.add('hide');
  }

  pswInput.onkeyup = function(){
    var lowerCaseLetters = /[a-z]/g;
    if (pswInput.value.match(lowerCaseLetters)) {
      lowerList.classList.remove('invalid');
      lowerList.classList.add('valid');
      lower = true;
    } else {
      lowerList.classList.add('invalid');
      lowerList.classList.remove('valid');
      lower = false;
    }

    var upperCaseLetters = /[A-Z]/g;
    if (pswInput.value.match(upperCaseLetters)) {
      upperList.classList.remove('invalid');
      upperList.classList.add('valid');
      upper = true;
    } else {
      upperList.classList.add('invalid');
      upperList.classList.remove('valid');
      upper = false;
    }

    var numbers = /[0-9]/g;
    if (pswInput.value.match(numbers)) {
      numberList.classList.remove('invalid');
      numberList.classList.add('valid');
      number = true;
    } else {
      numberList.classList.add('invalid');
      numberList.classList.remove('valid');
      number = false;
    }

    if (pswInput.value.length > 7) {
      lengthList.classList.remove('invalid');
      lengthList.classList.add('valid');
      length = true;
    } else {
      lengthList.classList.add('invalid');
      lengthList.classList.remove('valid');
      length = false;
    }

    if (lower == true && upper == true && number == true && length == true && pswInput.value == cnfInput.value) {
      document.getElementById('user-create-submit').removeAttribute('disabled');
    } else {
      document.getElementById('user-create-submit').setAttribute('disabled', 'disabled');
    }
  }

  cnfInput.onkeyup = function(){
    if (lower == true && upper == true && number == true && length == true && pswInput.value == cnfInput.value) {
      document.getElementById('user-create-submit').removeAttribute('disabled');
    } else {
      document.getElementById('user-create-submit').setAttribute('disabled', 'disabled');
    }
  }
}

document.addEventListener('turbolinks:load', ready);
