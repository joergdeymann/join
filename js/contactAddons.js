/**
 * 
 * PUBLIC
 * 
 * Generates a full name of the Object contact
 * 
 * @param {object} contact - one Contact
 * @returns - the Full name as string
 */
function getFullNameInContact(contact) {
    let name=contact.name + " " + contact.lastname;
    if (name == getUsername()) name+=" (You)";
    return name;
}


/**
 * 
 * prevent close dialog by click buttons or input fields
 * 
 * @param {click} event 
 */
function dontClose(event) {
    event.stopPropagation();
}


/**
 * opens a little pop up on mobile view
 */
function openPopUpEdit() {
    document.getElementById('popUpWarpper').style.display = 'flex';
}


/**
 * closes the little pop up on mobile view
 */
function closeMobileEditPopUp() {
    document.getElementById('popUpWarpper').style.display = 'none';
}


/**
 * 
 * load contact array from Firebase
 * 
 */
async function loadContacts(table = 'Contacts') {
    let loadedContacts = await loadData(table);
    if (!loadedContacts) {
        return [];
    }
    if (Array.isArray(loadedContacts)) {
        return loadedContacts.filter((contact) => contact !== null);
    } else if (typeof loadedContacts === 'object' && loadedContacts !== null) {
        return Object.values(loadedContacts).filter(
            (contact) => contact !== null
        );
    }
    return [];
}


/**
 *
 * creates a contact form to add a new contact for mobile version
 */
function openMobileContactDetail(singleContactArray, id) {
    document.getElementById('contactBook').style.display = 'none';
    document.getElementById('workingArea').style.display = 'none';
    document.getElementById('contactDetail').innerHTML = '';
    document.getElementById('contactDetail').innerHTML = createSingleContactMobileHTML(singleContactArray, id);
}


/**
  * 
  * close dialog window
  */
function closeContactCreation() {
    document.getElementById('dialogBackground').classList.add('displayNone');
    document.getElementById('dialogBackground').classList.remove('displayFlex');
    document.getElementById('body').classList.remove('overflowHidden');
}