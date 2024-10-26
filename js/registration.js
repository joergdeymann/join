/*
    REQUIRES: 
    events.js
    login.js
*/
/**
 * msgBox Send a messag to the Interface
 * 
 * @param {string} msg - Display message in the Password Box 
 */
function msgBox(msg) {
    // document.getElementById("msg-box").innerHTML=msg;
}


/**
 * Checks if 2 passwords of the interface are equal
 * 
 * @returns - true if passwords are the same otherwise false
 */
function isEqualPassword() {
    let password = document.getElementById("sign-password");
    let confirmPassword = document.getElementById("confirm-password");;
    if (password.value != confirmPassword.value) {
        customErrorMsg("confirm-password", "passwords are different");
    }
    return password.value == confirmPassword.value;
}


/**
 * Look if the User already exist
 * 
 * @param {object} userList - The List of the user
 * @param {string} email    - The Login email
 * @returns - true if user exist, otherwise false
 */
function existUser(userList) {
    let email = document.getElementById("email").value;
    let index = userList.findIndex(element => element.email == email);
    if (index != -1) {
        customErrorMsg("email", `E-mail already exist. Please choose another e-mail. <br>${email}, <a href="./index.html">login at your existing account ?`);
    }
    return index != -1;
}


/**
 * 
 * PUBLIC
 * 
 * Genertate an Object with seperated Info
 * 
 * @param {string} fullname 
 * @returns - seperated Name Object
 */
function getNameObj(fullname) {
    let splittedName = fullname.split(' ');
    let newFirstname = splittedName[0];
    let newLastname = splittedName.length == 1?' ':splittedName[1];
    return {
        fullname:fullname,
        firstName:newFirstname,
        lastName:newLastname
    } 
}


/**
 * 
 * PRIVATE
 * 
 * Saves the Contacts width new Contact
 * 
 * @param {array} contacts - array of Objects
 * @param {object} newContact  - one object
 */
async function saveDataContacts(contacts,newContact) {
    contacts.push(newContact);
    await saveData("Contacts",contacts);
}


/**
 * 
 * PRIVATE
 * 
 * Saves the User width new User
 * 
 * @param {array} userList - array of Objects
 * @param {object} newUser  - one object
 */
async function saveDataUser(userList,newUser) {
    userList.push(newUser);
    await saveData("user", userList);
}


/**
 * Add a User width all information to the table
 * 
 * @param {object} userList  List of Users 
 */
async function addUserToList(userList) {
    let password = document.getElementById("sign-password");
    let email = document.getElementById("email");
    let user = document.getElementById("user");
    contacts = await loadContacts();
    let id = await getIncrementedId("contact");
    let nameObj=getNameObj(user.value);
    let newContact = {
        id: id,
        name: nameObj.firstName,
        lastname: nameObj.lastName,
        email: email.value,
        phone: '0000000',
        color: generateDarkColor()
    };
    await saveDataContacts(contacts,newContact);
    await saveDataUser(userList,{ user: user.value, password: password.value, email: email.value, id: id });
}


/**
 * Register new User 
 * input: password, user, email
 */
async function register() {
    if (!isFormValid) return;
    if (!isEqualPassword()) return;
    let userList = await getUserList();
    if (existUser(userList)) return;
    await msgfly();
    await addUserToList(userList);
    openLogin(); 
}


/**
 * removeUser
 * Remove all information of a user
 * - in database, localstorage, session
 * 
 * @param {object} userList - List aof all Users
 * @param {integer} index    - the found index from index search
 */
async function removeUser(userList, index) {
    userList.splice(index, 1); // Remove User self 
    saveData("user", userList);
    clearLocalStorage();
    sessionDestroy();;
}


/**
 * passwordValidationOK
 * validate the interface with the given Password
 * 
 * @param {array} passwordOfList 
 */
function passwordValidationOK(passwordOfList) {
    let password = document.getElementById("sign-password");
    if (passwordOfList != password.value) {
        customErrorMsg("confirm-password", "The mail-password validation failed !");
    }
}


/**
 * Remove User from all permanent
 * given Information from Interface
 * redirect to Login at least
 */
async function unregister() {
    let email = document.getElementById("email");
    let userList = await getUserList();
    let index = userList.findIndex(element => element.email == email.value);
    if (index != -1) {
        if (passwordValidationOK(userList[index].password)) {
            removeTasksOf(email.value);    // Remove all Tasks of the user
            removeUser(userList, index);    // remove all Userinformation and cleanup
            openPage("./index.html");
        }
    } else {
        msgBox(`User doesn't exist`);
    }
}


/**
 * PRIVATE
 * 
 * Checks if the Registration Form is withouit wrong Entries
 * 
 * @param {string} formqs - QuerySelector ofthe used form
 * @returns - Valid (true) or invalid (false)
 */
function isFormValid(formqs) {
    let form = document.querySelector(formqs);
    if (!form) return false;
    let inputs = form.querySelectorAll('input');
    let status = Array.from(inputs).findIndex(input => !input.checkValidity()) == -1;
    let cb = form.querySelector("#remember-me").checked;
    return status && cb;
}


/**
 * 
 * PUBLIC
 * 
 * Initialation of the Register html
 * 
 */
function init() {
    loadUserFromLocalStorage();
    addFormListener('#login-card');
}
