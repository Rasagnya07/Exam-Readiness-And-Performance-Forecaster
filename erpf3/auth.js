// ============================================================
// auth.js — EduPulse Login & Signup Logic
// CO COVERAGE:
//   CO3 — Functions, conditions, objects, arrow functions
//   CO4 — DOM manipulation, event handling, localStorage
//   CO5 — Form validation with JavaScript
// ============================================================


// ── CO4: DOM Manipulation — run code when page fully loads ──
// 'DOMContentLoaded' fires after all HTML is parsed
document.addEventListener('DOMContentLoaded', function() {

  // CO4: localStorage — check if user is already logged in
  // If yes, redirect them straight to the dashboard
  var isLoggedIn = localStorage.getItem('edupulse_loggedin');
  if (isLoggedIn === 'true') {
    window.location.href = 'dashboard.html';
  }

});


// ── CO3: Function — switch between Login and Signup tabs ────
// This function takes one parameter: which tab to show
function showTab(tabName) {

  // CO4: DOM manipulation — get references to HTML elements by ID
  var loginForm  = document.getElementById('loginForm');
  var signupForm = document.getElementById('signupForm');
  var loginTab   = document.getElementById('loginTab');
  var signupTab  = document.getElementById('signupTab');

  // CO3: if/else condition — decide which form to show
  if (tabName === 'login') {
    // Show login form, hide signup form
    loginForm.classList.remove('hidden');   // CO4: DOM classList manipulation
    signupForm.classList.add('hidden');

    // Update tab button styles
    loginTab.classList.add('active');
    signupTab.classList.remove('active');

  } else {
    // Show signup form, hide login form
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');

    signupTab.classList.add('active');
    loginTab.classList.remove('active');
  }
}


// ── CO5: Form Validation + CO3: Function — handle login ─────
// Runs when the login form is submitted
// 'event' parameter is the form submit event object
function handleLogin(event) {

  // CO5: Prevent the form from reloading the page (default behavior)
  event.preventDefault();

  // CO4: DOM manipulation — get the input values the user typed
  var email    = document.getElementById('loginEmail').value.trim();
  var password = document.getElementById('loginPassword').value.trim();
  var errorEl  = document.getElementById('loginError');

  // CO5: Form validation — check all fields are filled
  if (email === '' || password === '') {
    errorEl.textContent = 'Please fill in all fields.';
    return; // CO3: early return stops the function here
  }

  // CO5: Validate email format using a basic check
  if (!email.includes('@') || !email.includes('.')) {
    errorEl.textContent = 'Please enter a valid email address.';
    return;
  }

  // CO4: localStorage — retrieve all saved users as a JSON string
  // JSON.parse converts the string back into a JavaScript array
  var usersJSON = localStorage.getItem('edupulse_users');
  var users     = usersJSON ? JSON.parse(usersJSON) : [];  // CO3: ternary (short if/else)

  // CO3: Array method — find() searches through the array
  // Arrow function: each 'u' is a user object, check if email+password match
  var matchedUser = users.find(function(u) {
    return u.email === email && u.password === password;
  });

  // CO3: if/else — did we find a matching user?
  if (matchedUser) {

    // CO4: localStorage — save login state and user name
    localStorage.setItem('edupulse_loggedin', 'true');
    localStorage.setItem('edupulse_currentUser', matchedUser.name);

    // CO4: DOM — redirect to dashboard page
    window.location.href = 'dashboard.html';

  } else {
    // Show error message to the user
    errorEl.textContent = 'Incorrect email or password. Please try again.';
  }
}


// ── CO5: Form Validation + CO3: Function — handle signup ────
// Runs when the signup form is submitted
function handleSignup(event) {

  // CO5: Stop page reload
  event.preventDefault();

  // CO4: Get all form input values
  var name     = document.getElementById('signupName').value.trim();
  var email    = document.getElementById('signupEmail').value.trim();
  var password = document.getElementById('signupPassword').value.trim();
  var errorEl  = document.getElementById('signupError');

  // CO5: Validate — check nothing is empty
  if (name === '' || email === '' || password === '') {
    errorEl.textContent = 'Please fill in all fields.';
    return;
  }

  // CO5: Validate name length (at least 2 characters)
  if (name.length < 2) {
    errorEl.textContent = 'Name must be at least 2 characters.';
    return;
  }

  // CO5: Validate email format
  if (!email.includes('@') || !email.includes('.')) {
    errorEl.textContent = 'Please enter a valid email address.';
    return;
  }

  // CO5: Validate password length
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters.';
    return;
  }

  // CO4: localStorage — get existing users array
  var usersJSON = localStorage.getItem('edupulse_users');
  var users     = usersJSON ? JSON.parse(usersJSON) : [];

  // CO3: Array method — check if this email is already registered
  var alreadyExists = users.find(function(u) {
    return u.email === email;
  });

  if (alreadyExists) {
    errorEl.textContent = 'An account with this email already exists.';
    return;
  }

  // CO3: Object — create a new user object with name, email, password
  var newUser = {
    name:     name,
    email:    email,
    password: password
  };

  // CO3: Array method — push adds the new user to the array
  users.push(newUser);

  // CO4: localStorage — save updated users array back as JSON string
  // JSON.stringify converts the JS array into a string for storage
  localStorage.setItem('edupulse_users', JSON.stringify(users));

  // CO4: Automatically log the new user in
  localStorage.setItem('edupulse_loggedin', 'true');
  localStorage.setItem('edupulse_currentUser', name);

  // CO4: Redirect to dashboard
  window.location.href = 'dashboard.html';
}
