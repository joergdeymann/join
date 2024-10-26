/**
 *
 * Initiates Dawn and logo Movement
 * Loads the User from local Storage
 * adds all needed Listeners for the Inputfields
 *
 */
function init2() {
   document.getElementById('login-card').classList.add('dawn');
   document.getElementById('login-master').classList.add('dawn');
   document.getElementById('main-logo').classList.add('logo-position');
   loadUserFromLocalStorage();
   addFormListener('#login-card');
}


/**
 * if checked save user data to the local storage, get it back later
 * else we clear the loclstorage
 */
function rememberMe() {
   if (document.getElementById('remember-me').checked) {
      saveUserToLocalStorage();
   } else {
      clearLocalStorage();
   }
}


/**
 *
 * Guest Login no need to enter user or Password
 * Some Data is also prepared
 */
function guestLogin(event) {
   event.preventDefault();
   event.stopPropagation();
   putLoginToValue('donotrespond@nodomain.tld', '');
   document.getElementById('remember-me').checked = false;
   login();
}


/**
 * put in Mask to have it later again, do we need it ?
 *
 * @param {string} email
 * @param {password} pw
 */
function putLoginToValue(email, pw) {
   document.getElementById('password').value = pw;
   document.getElementById('email').value = email;
}


/**
 * Clear all Login fields ?
 */
function clearLogin() {
   document.getElementById('password').value = '';
   document.getElementById('email').value = '';
   document.getElementById('remember-me').checked = false;
}


/**
 * run this after given user and password
 *
 * login()
 * input form HTML input field
 * output err to HTML output field
 */
async function login() {
   let password = document.getElementById('password');
   let email = document.getElementById('email');
   user = await isLoginCorrect(email.value, password.value);
   if (user != false) {
      let obj = {
         email: user.email,
         password: user.password,
         username: user.user,
         id: user.id,
      };
      sessionSave(PROJECT, obj);
      rememberMe();
      openDashboard("?login=1");
   }
}


/**
 * 
 * takes the data of the logged in user and saves it in the locla storage to enable the “remind me” function
 * 
 * @param {object} user - data of the logged in user
 */
function saveUserToLocalStorage(user) {
   localStorage.setItem('currentUserEmail', user.email);
   localStorage.setItem('currentUserName', user.username);
}
