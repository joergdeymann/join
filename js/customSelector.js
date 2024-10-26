let unalowedSpace=false;


/**
 * 
 * PUBLIC
 * 
 * Init must be called, at beginning
 */
function initSelector() {
    addToggleSelectListener();    

 }


 /**
 * 
 * PRIVATE 
 * 
 * Find a Tagname in Father oder higher Level
 * i found a funcition that is similar : closest("tag/id/class")
 * @param {element} element - element to begin search
 * @param {String} tagname - classname
 * @returns - found element, else false (better would have been null)
 */
function findTag(element,tagname) {
    while(element != null) {
       if (element.nodeName == tagname.toUpperCase()) return element;
       element=element.parentElement;
    }
    return false;
}


/**
 * 
 * PRIVATE
 * 
 * reduce the amout of List of the Selector. Its a filter by typing Letters
 * 
 * @param {event} event - input Event form Selector  
 */
function filterSelector(event) {
    if (document.activeElement.tagName != "INPUT") return;
    let search=document.activeElement.value.toLowerCase();
    let names=Array.from(event.target.closest("DETAILS").querySelectorAll('.selector-name'));
    names.filter(e => {
        if (e.innerHTML.toLowerCase().includes(search)) {
            e.closest(".selector").classList.remove("d-none");
        } else {
            e.closest(".selector").classList.add("d-none");
        }
        return true;
    });
} 


/**
 * 
 * PRIVATE EVENT
 * 
 * Disables the Window Toggle via Space Key
 * 
 * @param {event} event - keydown Event - Close window on Click outside
 */
function detailsEventKey(event) {
    if (event.code === 'Space') {
        unalowedSpace = true; 
    }
    if (event.code === "Escape") {
        event.target.closest("details").open=false;
    }
}


/**
 * 
 * PRIVATE EVENT
 * 
 * Closes the details-Window when clicked outside
 * 
 * @param {event} event - click event - Close window on Click outside
 */
function detailsEventCloseWindow(event) {
    let element=findTag(event.target,"details");
    if (!element) {
        for (let element of document.querySelectorAll('details')) {
            element.open=false;
        };
    }        
}


/**
 * 
 * PRIVATE EVENT
 * 
 * Main Click Event, a summery of Events
 * If Space key was pressed and input is focused, prevent toggle
 * 
 * @param {*} event - Click Event
 */
function detailsEventClick(event) {
    const activeElement = document.activeElement;
    if (unalowedSpace && activeElement.tagName.toLowerCase() === 'input' && activeElement.type === 'text') {
        event.preventDefault();  
        unalowedSpace = false;  
    }
}


/**
 * 
 * PRIVATE EVENT
 * 
 * Updates the Selected Monogramlist, when closed
 * Focus the Input field of details when Opened
 * 
 * @param {event} event - Toggle Event 
 */
function detailsEventToggle(event) {
    let root=event.target;
    if (!root.open) {
        displaySelectorMonograms(event);
    } else {
        event.currentTarget.querySelector("INPUT").focus();
    }
}


/**
 * 
 * PRIVATE EVENT
 * 
 * Opens the Options of details
 * 
 * @param {event} event - Click Event 
 */
function detailsToggle(event) {
    let root=event.target.closest("details");
    if (!root.open) {
        root.open=true;
    } else {
        root.open=false;
    }
}


/**
 * 
 * PRIVATE EVENT
 * 
 * Closes details Window when ESC is pressed autside the Inputfield
 * 
 * @param {event} event keydown Event   
 */
function checkEscapeKey(event) {
    if (event.code === "Escape") {
        detailsEventCloseWindow(event);
    }
}


/**
 * 
 * PUBLIC
 * 
 * Add all Listener for Select Input
 * 
 * @param {string} rootId - The ID given to details if you have onle one, it can be empty 
 */
function addToggleSelectListener(rootId) {
    let root=document.querySelector('details');
    if (rootId != null) {
        root=document.getElementById(rootId);
    }
    let input=root.querySelector("INPUT");

    root.addEventListener('click', detailsEventClick);
    root.addEventListener('toggle', detailsEventToggle);
    input.addEventListener('input', filterSelector);
    input.addEventListener('keydown',detailsEventKey);
    input.addEventListener('click',detailsToggle);
    window.addEventListener('click',detailsEventCloseWindow); // Close Window on click outside
    window.addEventListener("keydown",checkEscapeKey);        // Close Window on ESC Key
}


/**
 * 
 * PRIVATE 
 * 
 * Displays all activated monograms in one Row
 * 
 * Changes in sibling from details selector
 * This is used when closing the selector 
 *  
 * @param {event} event - Displays all activated monograms  in a row
 */
function displaySelectorMonograms(event) {
    let checkboxes=Array.from(event.currentTarget.querySelectorAll('input[name="assign"]'));
    let checked=checkboxes.filter(e => e.checked);
    let monogramList=event.currentTarget.parentElement.nextElementSibling; 
    monogramList.innerHTML="";
    for (let i=0;i<Math.min(checked.length,5);i++) {
        let monogram=checked[i].parentElement.querySelector("SPAN").cloneNode(true);
        monogramList.appendChild(monogram);
    }
    if (checked.length>5){
        monogramList.innerHTML+=`<span style="margin-left:1em">+ ${checked.length-5}</span>`;
    }
}