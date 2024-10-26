/**
 * 
 * @param {element} targetElement 
 * @param {element} query 
 * @returns - the id iunder main tadk-edit-card
 */
function getElementEdit(targetElement,query) {
    let father=targetElement.closest(".task-edit-card");
    return father.querySelector(query);     
}

/**
 * 
 * Checks all Contacts we need
 * 
 * @param {object} assignedList 
 * @returns - html output
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
 * Checks one Contacts we need
 * 
 * @param {object} contact 
 * @param {*} checked 
 * @returns html - code
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

/**
 * 
 * PUBLIC
 * 
 * Render Task List (all Categorys)
 * 
 * @param {array} json 
 * @returns - html output
 */  
function kanbanEditRenderTask(json) {
    let cat = getCategoryText(json);
    let mindate=getTaskDateMin(json.dueDate);

    return /*html*/ `
        <div class="top">
            <div class="${json.category}">${cat}</div>
            <img class="exit" onclick="closeTaskEdit()" src="./assets/img/desktop/close.svg">
        </div>
            <div class="center">
                <div>
                    <strong>Title</strong>
                    <div class="input-container invalid">
                        <input class="edit-title" type="text"  required placeholder="Title" value="${json.title}">
                        <span class="error-msg visible"></span>
                    </div>
                </div>
                <div>
                    <strong>Description</strong>
                    <div class="input-container invalid">
                        <textarea class="edit-description" type="text" required rows="4"  placeholder="Description">${json.description}</textarea>
                        <span class="error-msg visible"></span>
                    </div>
                </div>
                <div>
                    <strong>Due date</strong>
                    <div class="input-container invalid">
                        <input class="edit-date" type="date"  required placeholder="Title" width="100%" value="${json.dueDate}" min="${mindate}">
                        <span class="error-msg visible"></span>
                    </div>
                </div>
                <div>
                    <strong>Priority</strong>
                    <div class="flex-row gap16 priority">
                        <label>
                            <input type="radio" name="edit-prio" value="urgent" ${json.prio=="urgent"?"checked":""}>
                            <div class="button-label urgent">
                                Urgent
                                <img src="./assets/img/desktop/prio_urgent_red.svg">
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="edit-medium" name="edit-prio" value="medium" ${json.prio=="medium"?"checked":""}>
                            <div class="button-label medium">
                                Medium
                                <img src="./assets/img/desktop/prio_medium_yellow.svg">
                            </div>
                        </label>
                        <label>
                            <input type="radio" id="edit-low" name="edit-prio" value="low" ${json.prio=="low"?"checked":""}>
                            <div for="edit-low" class="button-label low">
                                Low 
                                <img src="./assets/img/desktop/prio_low_green.svg">
                            </div>
                        </label>
                    </div>
                </div>
                <div class="relative mb32" >
                    <strong>Assigned to</strong>
                    <details class="absolute" style="width:100%;">
                        <summary><input type="text" placeholder="Select contacts to assign"></summary>
                        <div class="selectors">
                            ${kanbanEditSelectors(json.assignedTo)}
                        </div>
                    </details>
                </div>
                <div class="monogramlist flex-row gap8">
                    ${getTaskEditAssigns(json.assignedTo)}
                </div>
                <div class="subtask-container label-input-con">
                    <label>Subtasks</label>
                    <input class="input-subtask" oninput="toggleSubtaskIcon(event)" type="text" id="subtasks" placeholder="Add new subtask">
                    <button type="button" id="add-subtask" class="btn-add-subtask">
                        <img 
                            onclick="clearSubtaskInput(event)" class="add-subtask-clear d-none"
                            src="./assets/img/desktop/add-subtask-clear.svg" alt="">
                        <div class="h-line24"></div>    
                        <img onclick="addSubtasks(event)" class="subtask-icon"
                            src="./assets/img/desktop/add_subtask.svg">
                    </button>
                    <ul class="subtask-list">
                    </ul>
                    <div class="edit-input-con d-none">
                        <input type="text" class="subtask-edit-input">
                        <div>
                            <img class="edit-delete" onclick="deleteSubtask(event)"
                                src="./assets/img/desktop/subtask-delete.svg" alt="">                            
                            <div class="h-line24"></div>                                
                            <img class="edit-check" onclick="saveEditedSubtask(event)"
                                src="./assets/img/desktop/add-subtask-check.svg" alt="">                   
                        </div>
                    </div>
                </div>
            </div>    
            <div class="bottom">
                <div class="darkbutton" onclick="saveEditTask(${json.id})">
                    Ok
                    <img class="invert" src="./assets/img/desktop/add-subtask-check.svg">
                </div>
            </div>

    `;
}


/**
 * 
 * PUBLIC
 * 
 * Edit a Task and save it back
 *  
 * @param {*} id - id of the task
 */
async function editTask(id) {
    let json = await loadObjectDataById("taskstorage",id);
    let card=document.getElementById("task-edit-card");
    subtasks=json[0].subtasks;
    card.innerHTML=kanbanEditRenderTask(json[0]);
    card.classList.add(json[0].category);
    card.classList.remove("d-none");
    initSelector();
    addFormListener("#task-edit-card");
    document.getElementById("task-view-card").style="display: none";
    card.style="";
    let subtaskElement=card.querySelector(".subtask-list");
    renderSubtasks(subtaskElement);
}


/**
 * 
 * PRIVATE 
 * 
 * Creates HTML: One monogram 
 * 
 * @param {*} a - assigned contact
 * @returns - the generatetd HTML for one contact 
 */
function getTaskEditAssign(a) {
    let contact=contacts.find(e => e.id == a);
    if (contact == null) return "";
    let name=getFullNameInContact(contact);

    return /*html*/ `
       <span class="circle-monogram" style="background-color:${contact.color}">${getMonogram(name)}</span>`;
}


/**
 * 
 * PRIVATE
 * 
 * analysese and returnd the value of the Priority
 * 
 * @param {element} element 
 * @param {string} name 
 * 
 * @returns the value medium urgent or low
 */
function getRadioValue(element,name) {
    radio = element.querySelectorAll(`input[name='${name}']`);
    for (let i=0;i<radio.length;i++) {
        if (radio[i].checked) return radio[i].value;
    }
    return "";
}


/**
 * 
 * PUBLIC
 * 
 * Retruns a List of assigned Contacts
 * 
 * @param {element} father 
 * @returns - a list of all inputfields of assinged contact s
 */
function getAssignedIdsFromUI(father) {
    let selections=father.querySelectorAll('input[name="assign"]');
    if (selections==null) return [];
    assigned=[];
    for (let i=0;i<selections.length;i++) {
        if (selections[i].checked) assigned.push(+selections[i].value);
    }
    return assigned;
};


/**
 * 
 * PUBLIC
 * 
 * Gets Task Infoirmation from Input
 * 
 * @param {object} task  - Task
 */
function taskEditToObj(task) {
    let father=document.getElementById("task-edit-card");
    task.subtasks=subtasks;
    task.title=father.querySelector(".edit-title").value;
    task.description=father.querySelector(".edit-description").value;
    task.prio=getRadioValue(father,"edit-prio");
    task.dueDate=father.querySelector(".edit-date").value
    task.assignedTo=getAssignedIdsFromUI(father);
}


/**
 * 
 * PRIVATE
 * 
 * Replaces the new generated Tags in the List for Display
 * 
 * @param {object} task - one Task Object 
 */
function updateTask(task) {
    let index=tasks.findIndex(e => e.id==task.id);
    tasks[index]=task;
    addContainerData(tasks,task.status);

}


/**
 * PUBLIC
 * 
 * Saves the Task by Id
 * 
 * @param {integer} id - Task id
 */
async function saveEditTask(id) {
    let json = await loadObjectDataById("taskstorage",id);
    taskEditToObj(json[0]);
    updateTask(json[0]);
    await saveObjectDataById("taskstorage",json);
    openTaskView(json);
}