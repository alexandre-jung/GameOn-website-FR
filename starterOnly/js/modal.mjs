import Form from './form.mjs';

function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
// for now make it a global variable
window.editNav = editNav;

// DOM Elements
const modalbg = document.querySelector(".bground");
const modalBtn = document.querySelectorAll(".modal-btn");

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));

const form = new Form();

// launch modal form
function launchModal() {
  modalbg.style.display = "block";
  form.initData();
}

// dismiss modal
const closeBtn = modalbg.querySelector('.close');
closeBtn.addEventListener('click', function() {
    modalbg.style.display = 'none';
});

const confirmationModal = document.querySelector('#registrationConfirmed');
const closeConfirmationBtn = confirmationModal.querySelector('input');
closeConfirmationBtn.addEventListener('click', function() {
    confirmationModal.style.display = 'none';
});

form.onSubmitSuccess = function() {
    modalbg.style.display = 'none';
    confirmationModal.style.display = 'block';
}
