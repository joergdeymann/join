/** 
    global variables for all 
*/
const PROJECT = "join2024-326";


/**
 * Remove the content of a key in the session
 *
 * @param {string} key
 */
function sessionDestroy(key = null) {
   if (key == null) sessionStorage.clear();
   else sessionStorage.removeItem(key);
}


/**
 * load a key from session
 *
 * @param {string} key - key to load from
 * @returns - JSON array
 */
function sessionLoad(key) {
   return JSON.parse(sessionStorage.getItem(key));
}


/**
 * saves a JSON array to the key to the session
 * @param {string} key    - key
 * @param {object} value  - JSON array
 */
function sessionSave(key, value = {}) {
   sessionStorage.setItem(key, JSON.stringify(value));
}


/**
 * load next HTML, geneerell alias
 *
 * @param {url} url - open a HTML and exit from here
 */
function openPage(url) {
   window.location = url;
}


/**
 * Redirect to login, if not Logged
 * add it to every init() {isLogged()}
 * or body onload="isLogged()"
 */
function isLogged() {
   let ls;
   user=sessionLoad(PROJECT);
   if (user == null) {
      if (loadFromLocalStorage(PROJECT) == null) { 
         openPage("./index.html"); 
         return false;
      } else {
         loadUserFromLocalStorage()
      }
   }
   return true;
}


/**
 * 
 * loads the current user from the session storage
 * 
 * @returns current user
 */
function getUsername() {
   return sessionLoad(PROJECT).username;
}


/**
 * Retrieves the logged-in user's monogram and displays it in the DOM.
 * 
 * Loads the user data from the session, generates the user's monogram from their username,
 * and updates the element with the ID 'loggedUserMonogram' to display the monogram.
 * 
 * @returns {void}
 */
function logedUserMonogram() {
   let user = sessionLoad(PROJECT);
   let userMonogram = getMonogram(user.username);
   document.getElementById('loggedUserMonogram').innerHTML = `<span> ${userMonogram} </span>`;
}

