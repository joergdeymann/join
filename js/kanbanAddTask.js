/*
    This is used instead of addtask, because there would be losts of double ids
*/
let doNotSubmit= false;
let tasks= [];


/**
 * 
 * PUBLIC
 * 
 * Initiation of the Add Task in the board
 * 
 * Clears all input fields, t have a clean start
 * Adds some Eventlistenerss 
 * 
 */
function initAddTask() {
    clearTaskInputs();
    initAssignSelector("subtaskPopup");
}


/**
 * 
 * PUBLIC
 * 
 * Closes the PopUp AddTask from Bord
 */
function closeAddTask() {
    document.getElementById("add-task").classList.remove("go");
}


/**
 * 
 * PUBLIC
 * 
 * Opens the PopUp AddTask from Bord
 * Inits the Listener and so on
 */
function openAddTask(status="to-do") {
    document.getElementById("add-task").classList.add("go");
    initAddTask();
    setStatus(status);

}


/**
 * PUBLIC
 * 
 * Clears all inputfields of the PopUp AddTask
 * 
 */
function clearTaskInputs() {
    let card=document.getElementById("add-task-form");
    card.querySelector(".input-subtask").value="";
    card.querySelector("textarea").value="";
    card.querySelector("input[type=date]").value="";
    card.querySelector("#title").value="";
    card.querySelector(".assigned-to-input").value="";
    card.querySelectorAll('input[name="assign"]').forEach(checkbox => checkbox.checked = false);
    card.querySelector(".monogramlist").innerHTML = "";  
    card.querySelector(".category").selectedIndex = 0;
    card.querySelector(".subtask-list").innerHTML = "";
    subtasks = [];
    card.querySelectorAll('input[name="prio"]').forEach(radio => radio.checked = radio.id == "medium" ? true:false)
    setMinDate(card.querySelector("input[type=date]"));
}


/**
 * 
 * PRIVATE
 * 
 * Displays "status"
 * 
 * @param {string} status  - id of column
 */
function setStatus(status="to-do") {
    let card=document.getElementById("add-task-form");
    card.querySelector('input[name="status"]').value=status;
}

/**
 * 
 * PRIVATE
 * 
 * Prepares effective a new Dataset for the new Task
 * 
 * @returns prepared Dataset
 */
function prepareTaskData() {
    let card=document.getElementById("add-task-form");
    return {
        id:          getNewId(tasks), 
        title:       card.querySelector("#title").value,
        description: card.querySelector("textarea").value,
        assignedTo:  Array.from(card.querySelectorAll('input[name="assign"]:checked')).map(checkbox => +checkbox.value),
        dueDate:     card.querySelector("input[type=date]").value,
        prio:        card.querySelector('input[name="prio"]:checked').value,
        category:    card.querySelector(".category").value,
        status:      card.querySelector('input[name="status"]').value,
        subtasks:    subtasks,
     };
}


/**
 * 
 * PUBLIC
 * 
 * Saves a new Task to the Database, after Validation Check passed
 * We refresh the Database so that we 
 * do not overwrite other users changes inbetween  
 * 
 * - Referes tom the Board 
 * 
 * @returns nothing
 */
async function addNewTask() {
    if (doNotSubmit) return;
    if (!showRequiredText()) return;
    tasks = await loadData("taskstorage");
    if (tasks === null) tasks = [];
    tasks.push(prepareTaskData());
    await saveData("taskstorage", tasks);
    clearTaskInputs();
    addContainerData(tasks,tasks[tasks.length-1].status);
    closeAddTask();
}
 

/**
 * 
 * PRIVATE
 * 
 * Displays an Error and Highlights teh fField red if something is wrong
 * returns true if we have errors else false
 * 
 * @param {element} field  - input field for value can also be border 
 * @param {element} msg    - the error message area when wrong input given
 * @param {element} border - border to red field
 * @returns -  true = worng input  or false all correct
 */
function faultDisplay(field,msg,border) {
    if (border == null) border=field;

    if (field.value) {
        border.style.border = "";
        msg.classList.add("d-none"); 
    } else {
        border.style.border = "1px solid red";
        msg.classList.remove("d-none");     
    }
    return !field.value
}


/**
 * 
 * PUBLIC
 * 
 * Prepares Fields for Error analysis
 * 
 * @returns - true if no error happens
 */
function showRequiredText() {
    let card=document.getElementById("add-task-form");
    let field,msg;
    let err=false;

    field = card.querySelector(".input-title");
    msg   = card.querySelector(".input-title-msg");
    err   = faultDisplay(field,msg) || err;
    field = card.querySelector(".input-date");
    msg   = card.querySelector(".input-date-msg");
    err   = faultDisplay(field,msg) || err;
    field = card.querySelector(".input-category");
    msg   = card.querySelector(".input-category-msg");
    border= card.querySelector(".input-category-border");
    err   = faultDisplay(field,msg,border) || err;
    return !err;
 }
 

 /**
 * 
 * PUBLIC EVENT 
 * 
 * Prevent in forms that Form ist submitten when pressing Enter key
 * Handels Subtask via Enter Key
 * Where ist it called: 
 * BUG: inned a reset doNotSubmit when leaving the Input
 * 
 * @param {*} event - keydown event that triggers
 * @param {*} key   - key to disable/action
 */
function noSubmit(event,key) {
    doNotSubmit=false
    if (event.code == key && event.target.tagName== "INPUT") {
       if (event.target.classList.contains("input-subtask")) {
          addSubtasks(event);
          doNotSubmit=true;
       } 
       event.preventDefault();
    }
 }


 /**
  * 
  * PUBLIC EVENT
  * 
  * Deletes the preventation that we submit, when we loose the focus auf any field
  * it was set because ENTER Key, see noSuBmit, was hit at entree of add Submit 
  * 
  */
 document.addEventListener("focusout",() => {
    doNotSubmit=false;
 })
 