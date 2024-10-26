/**
 * 
 * PRIVATE
 * 
 * Create a row of Contacts for he AssignList
 * 
 * @param {object} a - Assigned Contact
 * 
 * @returns - html ouitput
 */
function getTaskViewAssign(a) {
    let contact=contacts.find(e => e.id == a);
    if (contact == null) return "";
    let name=getFullNameInContact(contact);

    return /*html*/ `
    <div onclick="toggleActiveKanbanTask(event)">
        <div>
            <div style="background-color: ${contact.color}">${getMonogram(name)}</div>
            <span>${name}</span>
        </div>
        <div>
        </div>
    </div>
    `;
}


/**
 * 
 * PRIVATE
 * 
 * Create the Assign List for the Selector
 * 
 * @param {array} assigns 
 * @returns -html code
 */
function getTaskViewAssigns(assigns) {
    if (assigns == null) return "";
    let html="";
    for (let assign of assigns) {
        html+=getTaskViewAssign(assign);
    }
    return html;
}


/**
 * 
 * PRIVATE
 * 
 * creates output for Subtask
 * 
 * @param {object} json - array of Objects
 * @returns - html code
 */
function getTaskViewSubtasks(json) {
    if (json.subtasks == null) return "";
    let html="";
    for (subId=0;subId<json.subtasks.length;subId++) {
        let checked=""
        if (json.subtasks[subId].done == true) checked="checked";

        html+= /*html*/ `  
        <div>
            <img class="${checked}" onclick="toggleSubtaskStateEvent(event,${json.id},${subId})" src="./assets/img/desktop/checked.svg">
            <span>${json.subtasks[subId].name}</span>
        </div>
        `;
    } 
    return html;
}


/**
 * 
 * PRIVATE
 * 
 * Creates the Text for Category 
 * 
 * @param {object} json -task
 * @returns - teh category to show
 */
function getCategoryText(json) {
    let cat = "User Story";
    if (json.category == "technical-task") {
        cat="Technical Task";
    }
    return cat;
}


/**
 * 
 * Creates one Task Output
 * 
 * @param {object} json - Task 
 * @returns - html output
 */
function getTaskView(json) {
    let cat = getCategoryText(json);
    return /*html*/ `
        <div class="top">
            <div class="${json.category}">${cat}</div>
            <img class="exit" onclick="closeTaskView()" src="./assets/img/desktop/close.svg">
        </div>
        <div class="center">
            <h1>${json.title}</h1>
            <p>${json.description}</p>
            <p><strong>Due Date:</strong>${json.dueDate}</p>
            <p><strong>Priority:</strong>${json.prio}<img class="icon-prio-${json.prio}"></p>
            <div class="assign">
                <strong>Assigned to:</strong>
                ${getTaskViewAssigns(json.assignedTo)}            
            </div>
            
            <div class="subtasks"><strong>Subtasks</strong>
                ${getTaskViewSubtasks(json)}
            </div>
        </div>

        <div class="bottom">
            <a onclick="deleteTask(${json.id})">
                <img class="trash" src="./assets/img/desktop/trash.svg">
                <span>Delete</span>
            </a>
            <div></div>
            <a onclick="editTask(${json.id})">
                <img class="pencil" src="./assets/img/desktop/pencil.svg">
                <span>edit</span>
            </a>
        </div>
    `;

}


/**
 * 
 * PUBLIC
 * 
 * Opens the Task View
 * 
 * @param {object} json - Task
 */
async function openTaskView(json) {
    document.getElementById("task-edit-card").style="display: none";
    document.getElementById("task-view-card").innerHTML=getTaskView(json[0]);
    document.getElementById("task-view-card").style="";
}


/**
 * 
 * PUBLIC
 * 
 * Opens the Task View Card
 * 
 * @param {*} event 
 */
async function openTask(event) {
    if (event.type === "dragleave") {
        return
    }
    let id=event.currentTarget.id.split("-")[1];
    let json = await loadObjectDataById("taskstorage",id);
    openTaskView(json);
       
    document.getElementById("task-view").classList.add("go");

}


/**
 * 
 * PUBLIC
 * 
 * Close Task Edit Card
 */
async function closeTaskEdit() {
    closeTaskView();
    await new Promise(e=>setTimeout(e,600));    
    document.getElementById("task-view-card").style="";
    
}


/**
 * 
 * PUBLIC
 * 
 * Close Task View Card
 */
function closeTaskView() {
    document.getElementById("task-view").classList.remove("go");
}


/**
 * 
 * PRIVATE
 * 
 * make selection visible or not
 * 
 * @param {*} event 
 */
function toggleActiveKanbanTask(event) {
    event.currentTarget.classList.toggle("dark-selection");
}


/**
 * 
 * PUBLIC
 * 
 * toggles the formatation for the Subtask checkbbox
 * 
 * @param {element} element - elemenmt of the Subtask to toggle the checkbox
 * @param {*} state 
 * @returns true if checked, false if not checked
 * 
 */
function toggleSubtaskState(element,state=null) {
    if (state === null) {
        return element.classList.toggle("checked");
    } else {
        return element.classList.toggle("checked",state);
    }
}


/**
 * 
 * PUBLIC
 * 
 * Toggles the State of the Subtask done or not
 * Saves the changed values
 * 
 * @param {event} event - The event of the subtask triggered 
 * @param {integer} id - id of the task
 * @param {integer} subId - subid the index of the subtask
 */
async function toggleSubtaskStateEvent(event,id,subId) {
    let state = toggleSubtaskState(event.currentTarget);
    let json = await loadObjectDataById("taskstorage",id);
    json[0].subtasks[subId].done=state;
    saveObjectDataById("taskstorage",json);

    index=tasks.findIndex(e => e.id==id);
    tasks[index]=json[0];  // .subtasks[subId].done=state;
    addContainerData(tasks,json[0].status);
    resizeContainer();
}


/**
 * 
 * PUBLIC
 * 
 * Deletes the Task and close the window
 * 
 * @param {*} id 
 */
async function deleteTask(id) {
    await deleteData("taskstorage",id);
    let i=tasks.findIndex(e => e.id==id);
    let status=tasks[i].status;
    tasks.splice(i,1);
    addContainerData(tasks,status);
    closeTaskView();
    msgfly();
}
