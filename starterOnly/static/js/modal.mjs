import Form from './form.mjs';

// when clicking the navbar stop propagation to no let the event
// hit the document. this prevents navbar from immediately closing
// when we want to open it.
const mainNavbar = document.querySelector(".main-navbar");
mainNavbar.addEventListener("click", function(ev) {
    ev.stopPropagation();
});

function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
    document.addEventListener("click", function() {
        x.className = "topnav";
    });
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

// dismiss confirmation modal
const confirmationModal = document.querySelector('#registrationConfirmed');
const closeConfirmationBtn = confirmationModal.querySelector('input');
closeConfirmationBtn.addEventListener('click', function() {
    confirmationModal.style.display = 'none';
});

// display confirmation on submit success
form.onSubmitSuccess = function() {
    modalbg.style.display = 'none';
    confirmationModal.style.display = 'block';
}
