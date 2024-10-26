/**
 * Check fields if they could be sent, 
 * so all flields ust be valid
 * 
 * @param {array} list - List of ids of the interface 
 * @returns - true if all fields are valid and ready to work width
 */
function inputFilled(list) {
    for (let item of list) {
        let d = document.getElementById(item);
        if (d.type == "checkbox" && d.checked == false) {
            return false;
        }
        if (!d.validity.valid) {
            return false;
        }
    }
    return true;
}


/**
 * 
 * Pust out message that the field iis invalid
 * 
 * @param {element} element - from inputfield the message
 */
function addValidationMessage(element) {
    let msg = document.getElementById(element.id + "-msg");
    if (msg) {
        if (!element.checkValidity()) {
            msg.innerHTML = element.validationMessage;
        } else {
            msg.innerHTML = "";
        }
    }
}


/**
 * 
 * PUBLIC
 * 
 * Disable some FormEvents
 * 
 * @param {text} formid - the name ginven th the FORM Tag
 */
function disableFormEvents(formid) {
    let form = document.getElementById(formid);
    inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(element => {
        element.addEventListener("invalid", e => e.preventDefault());
        element.addEventListener("submit", e => e.preventDefault());
    });
}


/**
* 
* PUBLIC
* 
* Add some Listeners for the input
* 
* @param {element} formSelector - The FORM we want to analyse
* @param {object} styleObject   - givin style for the Errors
*/
function addFormListener(formSelector, styleObject) {
    let form = document.querySelector(formSelector);
    if (!form) return false;

    let inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        styleElement(input, styleObject);
        input.addEventListener('input', eventErrorMsg);
        input.addEventListener("focusin", e => removeCustomErrorCode(input)); // to be able te re Submit ohne ALL
        input.addEventListener("blur", e => removeCustomMsg(input)); // to be able te re Submit ohne ALL
    });
}


/**
 * 
 * Find the Form TAG of the inputfield we are in
 * private - called from:
 * -  eventErrorMsg
 * 
 * @param {elment} element - inputfield we use  
 * @returns - false if no FORM Tag is found, otherwise the tagName of the Forrm
 * 
 */
function getFormId(element) {
    let e = element;
    while ((e = e.parentElement) !== null) {
        if (e.tagName == "FORM") return e.id;
    }
    return false;
}


/**
 * 
 * PUBLIC
 * 
 * Finds the Form ID of Code starting by the given element
 * Returns the found element as ID QUERY TAG
 * 
 * @param {element} element 
 * @returns -id as Queryselöector
 */
function getFormQs(element) {
    return "#" + (getFormId(element) || "login-card");
}


/**
 * 
 * PUBLIC EVENT
 * 
 * Checks if the Form is allowed to send an error to each field
 * 
 * @param {event} event - input event 
 */
function eventErrorMsg(event) {
    let formquery = getFormQs(event.target);
    customMessage(event.target);
    setErrorMsg(event.target);
    let valid = isFormValid(formquery);
    disableCheck(valid);
    event.preventDefault();
}


/**
 * 
 * PRIVATE
 * 
 * Displays the error message
 * 
 * @param {element} element - set the Errormessage to the nearest SPAN TAG 
 * @returns element we search for
 */
function setErrorMsg(element) {
    sibling = element;
    while (sibling.nextElementSibling && sibling.nextElementSibling.tagName == 'SPAN') {
        sibling = sibling.nextElementSibling;
    }
    sibling.innerHTML = element.validity.valid ? "" : element.validationMessage;
    return sibling;
}


/**
 * 
 * shows the ser waht Password ist entered
 * 
 * @param {*} event - mouse event that triggered
 * @param {*} container  - No fnuction
 * @returns - nothing
 */
function togglePasswordView(event, container) {
    let passwordContainer = event.target.parentElement;
    let passwordInput = event.target.previousElementSibling;
    if (document.activeElement !== passwordInput) {
        return;
    }
    let isVisible = passwordContainer.classList.toggle("visible");
    passwordInput.type = isVisible ? "text" : "password";
    passwordInput.focus();

    event.preventDefault();
    event.stopPropagation();
}



/**
 * 
 * PUBLIC
 * 
 * Marks all Fields text or input 
 * 
 * @param {string} formid - id for the FORM tag 
 * @returns -nothing
 */
function markAllFieds(formid) {
    let form = document.querySelector(formid);
    if (!form) return false;

    let inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        customMessage(input);
        setErrorMsg(input);
    })
}


/**
 * 
 * PUBLIC
 * 
 * Checks if all Fields in the form are valid
 * 
 * @param {string} formqs - gets the nearest TAG / ID / Class
 * 
 * @returns - elemet of the form
 */
function isFormValid(formqs) {
    let form = document.querySelector(formqs);
    if (!form) return false;

    let inputs = form.querySelectorAll('input, textarea');
    let status = Array.from(inputs).findIndex(input => !input.checkValidity()) == -1;
    return status;
} 


/**
 * 
 * PRIVATE
 * 
 * Enables the Red Border on wrong input fields
 * @param {string} formqs - Query Selector like #test or .test 
 */
function enableRedBorder(formqs) {
    let form = document.querySelector(formqs);
    if (!form) return;
    let inputs = form.querySelectorAll('input-container');    
    for (let input of inputs) {
        input.classList.add("invalid");
    }     
}


/**
 * 
 * PRIVATE
 * 
 * Disables the Red Border on wrong input fields
 * @param {string} formqs - Query Selector like #test or .test 
 */
function disableRedBorder(formqs) {
    let form = document.querySelector(formqs);
    if (!form) return;
    let inputs = form.querySelectorAll('input-container');    
    for (let input of inputs) {
        input.classList.remove("invalid");
    }     
}


/**
 * 
 * private 
 * - called form handleErrors
 * 
 * Activates Errors while in input field and red border
 * @param {*} formid - the id of the form we want no to errors and border live 
 */
function activateFormErrors(formid) {
    let form=document.getElementById(formid);
    inputs = form.querySelectorAll('input');
    inputs.forEach(element => {
       element.parentElement.classList.add("invalid");
    });
    disableFormEvents(formid);
 }

 
/**
 * 
 * PUBLIC
 * 
 * Validates all inputs of a given Form
 * 
 * @param {string} formid - id of the form Tag
 */
function validateForm(formid) {
    activateFormErrors(formid);
    markAllFieds("#"+formid);
}