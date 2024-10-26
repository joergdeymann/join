/**
 * 
 * PUBLIC
 * 
 * Preload the Assign Selector 
 * Add Listener for the Selector
 * Empty Monogramlist
 * 
 */
function initAssignSelector(selector) {
    let listId;
    let monogramId;
    if (selector == null) {
        listId="add-task-assignToList";
        monogramId="addtask-monogramlist";
        rootId=null;
    } else {
        listId=selector + "List";
        monogramId=selector + "Monogram";
        rootId=selector + "Root";
    }

    let list=document.getElementById(listId)
    list.innerHTML=kanbanEditSelectors();
    let monograms=document.getElementById(monogramId);
    monograms.innerHTML=""; 
    addToggleSelectListener(rootId);
}


/**
 * 
 * PRIVATE 
 * 
 * Creates HTML: One monogram 
 * contacts is a list of global contacts
 * This function finds a contact in the contact list by ID
 * the id is given from the assignTo, 
 * the assignTo was iterated by a function that calls this function
 * 
 * @param {*} a - assigned contact
 * @returns - the generatetd HTML for one contact 
 */
function getTaskEditAssign(a) {
    let contact=contacts.find(e => e.id == a); // must be contacts
    if (contact == null) return "";
    let name=getFullNameInContact(contact);

    return /*html*/ `
       <span class="circle-monogram" style="background-color:${contact.color}">${getMonogram(name)}</span>`;
}


/**
 * 
 * PUBLIC RENDER
 * 
 * Creates HTML: a row of contacts
 * 
 * @param {*} assigns  - contact.assignedTo List of assigned Contacts
 * @returns - a row of contacts in HTML  
 */
function getTaskEditAssigns(assigns) {
    if (assigns == null) return "";
    let html="";
    let count=0;
    for (let assign of assigns) {
        html+=getTaskEditAssign(assign);
        if (++count == 5) break;
    }
    if (count<assigns.length){
        html+=`<span style="margin-left:1em">+${assigns.length-count}</span>`;
    }
    return html;
}


/**
 * 
 * PRIVATE RENDER
 * 
 * Creates a HTML Output for the Assign Selector
 * 
 * @param {array} assignedList - List of contact ids 
 * @returns  -html List of Contacts
 */
function kanbanEditSelectors(assignedList) {
    let html="";    
    for (let i=0;i<contacts.length;i++) {
        let checked="";
        if (assignedList != null) {

            if (assignedList.indexOf(contacts[i].id) != -1) {
                checked="checked";
            }
        }
        html+=kanbanEditSelector(contacts[i],checked);
    };
    return html;
}


/**
 * 
 * PRIVATE RENDER
 * 
 * Creates a  row of Selectors 
 * 
 * @param {object} contact - contact we need in the Selector
 * @param {bool} checked   - is the contact adviced to the Task
 * @returns -  for the selector the row width Monogram and contact name
 */
function kanbanEditSelector(contact,checked) {
    if (contact == null) return "";
    let name=getFullNameInContact(contact);

    return /*html*/ `
        <label class="selector">
            <input type="checkbox" class="custom-checkbox" name="assign" value="${contact.id}" ${checked}>
            <div class="checkbox-design">
                <div>
                    <span class="circle-monogram" style="background-color:${contact.color}">${getMonogram(name)}</span>  
                    <span class="selector-name">${name}</span>
                </div>
                <img>
            </div>
        </label>`;
}
