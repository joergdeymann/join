/**
 * Design the Submit button 
 * and give it the possiblility of Press or not (enable/disable)
 * 
 * @param {bool} submit - input is changed to false or tru (elemnt form interface)
 */
function disableCheck(submit, id = "submit") {
    let button = document.getElementById(id)
    if (button == null) return
    if (submit) {
        enableButton(button);
    } else
        if (!button.disabled) {
            disableButton(button);
        }
}


/**
 * 
 * PUBLIC 
 * 
 * Disables the Button
 * 
 * @param {element} button - elementof the button to disable/enable
 */
function disableButton(button) {
    button.disabled = true;
    button.classList.add("disable");
    button.style.cursor = "not-allowed";
    button.style.backgroundColor = "#A0A0A0";
}


/**
 * 
 * PUBLIC 
 * 
 * Enable the Button
 * 
 * @param {element} button - elementof the button to disable/enable
 */
function enableButton(button) {
    button.disabled = false;
    button.classList.remove("disable");
    button.style.color = "";
    button.style.filter = "";
    button.style.cursor = "pointer";
    button.style.backgroundColor = "";
}


/**
 * 1. check if all fields are valid
 * 2. if valid Submit Button is enabled otherwise disabled an greyed out
 * 
 * @param {array} list - List of ids in the interface 
 */
function sendButton(event, list) {
    let submit = inputFilled(list);
    disableCheck(submit);
    addValidationMessage(event.target);
}


