/**
 * 
 * changes the visibility of the popup menu when clicking on the usermongram
 * 
 */
function openUserMenu() {
    document.getElementById('popUpUser').classList.toggle('dFlex');
}


/**
 * 
 * logs the user out by emptying the session storage and local storage and then checks whether the user is logged in
 * 
 */
function logOut() {
    localStorage.removeItem(PROJECT);
    sessionStorage.removeItem(PROJECT);
    isLogged();
}


/**
 * 
 * creates the user monogram in the header by checking which user is logged in
 * 
 */
function initSessionMonogram() {
    isLogged();
    logedUserMonogram();
}


/**
 *
 * returns the monogram of a Name
 *
 * @param {string} name first name and last name split by " "
 * @returns the first characters of the 2 first Names in uppercase
 */
function getMonogram(name) {
    let na = name.replace(/\s+/g, ' ').toUpperCase().trim().split(' ', 2);
    if (na.length == 1) {
        return na[0][0];
    } else {
        return na[0][0] + na[1][0];
    }
}