let subtasks=[]
let currentEditIndex=null;


/**
 * 
 * PRIVATE
 * 
 * instead of using IDs we find out where we are and use classes
 * 
 * we can use subtasks on different places, wehn we have no unique id
 * 
 * this function is for handling thing easiely and reducing mistakes
 * 
 * @param {element} target - the element that triggered the event 
 * @param {*} classname    - the classname
 * @returns - the element we need like id
 */
function getElement(target,classname) {
    switch(classname) {
        case "subtask-edit-input":
        case "edit-input-con":
        case "subtask-list":
        case "input-subtask":    // id subtasks
        case "subtask-icon":
        case "add-subtask-clear":
            return target.closest(".subtask-container").querySelector(`.${classname}`);

    }
    return null;
}


/**
 * 
 * PUBLIC
 * 
 * TRIGGERS: when input is made in Subtask entry field
 * 
 * INTERNAL Call from: addSubtasks()
 * 
 * CHANGES: toggleSubtaskIcon() was toggleIcon()
 * 
 */
function toggleSubtaskIcon(event) {
    const subtaskInput = getElement(event.target,"input-subtask");
    const checkIcon    = getElement(event.target,"subtask-icon");
    const clearIcon    = getElement(event.target,"add-subtask-clear");
    const src="./assets/img/desktop/add_subtask.svg";
    if (subtaskInput.value == "") {
       checkIcon.src = src; 
       clearIcon.classList.add("d-none");
       clearIcon.nextElementSibling.classList.add("d-none");
    } else {
       checkIcon.src = "./assets/img/desktop/add-subtask-check.svg";
       clearIcon.classList.remove("d-none"); 
       clearIcon.nextElementSibling.classList.remove("d-none");
    }
}
 

/**
 * 
 * PUBLIC
 * 
 * Clear the main input of subtask
 * 
 * @param {event} event - main input of subtask  
 */ 
function clearSubtaskInput(event) {
    getElement(event.currentTarget,"input-subtask").value ="";
}


/**
 * 
 * PUBLIC
 * 
 * Adding new Subtasks to the array
 * 
 * @param {event} event - event, that is triggered from Buttons  
 */
function addSubtasks(event,i) {
    let subtaskInput = getElement(event.target,"input-subtask");
    let subtaskList = getElement(event.target,"subtask-list");
    let subtaskIcon = getElement(event.target,"subtask-icon");

    const src="add_subtask.svg";   
    if (subtaskIcon.src.indexOf(src) != -1) {
       subtaskInput.focus();      
    }
 
    if (subtaskInput.value !== "") {
       subtaskList.innerHTML = "";
       if (subtasks==null) subtasks=[];
       subtasks.push({ name: subtaskInput.value, done: false });
       renderSubtasks(subtaskList);
       subtaskInput.value = "";
       toggleSubtaskIcon(event);
    }
}


/**
 * 
 * PUBLIC
 * 
 * Delete a Subtask in the Card
 * 
 * USES a Global Variable: currentEditIndex 
 * 
 * @param {event} event - event that triggers
 * @param {integer} i   - index of the array, if null use global currentEditIndex 
 */
function deleteSubtask(event,i) {
    let [subtaskEditInput,subtaskList,subtaskEditCon] = getSubtaskElements(event.currentTarget);

    if (i == null && currentEditIndex != null) {
        i=currentEditIndex;
    }
    if (i === null) return;

    subtasks.splice(i, 1);
    subtaskEditCon.classList.add("d-none");
    renderSubtasks(subtaskList);
    subtaskEditInput.value = "";
}


/**
 * 
 * PRIVATE
 * 
 * Returns a group of targets elements
 * 
 * @param {element} target - element of the triggert event 
 * @returns - Subtask- Information
 * - Elements of Classes:
 * - "subtask-edit-input"
 * - "subtask-list"
 * - "edit-input-con"
 * 
 */
function getSubtaskElements(target) {
    let subtaskEditInput = getElement(target,"subtask-edit-input");
    let subtaskList = getElement(target,"subtask-list");
    let subtaskEditCon = getElement(target,"edit-input-con");

    return [subtaskEditInput,subtaskList,subtaskEditCon]
}


/**
 * 
 * PUBLIC
 * 
 * save changes to the array
 * returns to the normal view
 * 
 * @param {event} event - triggert from subtasks
 */
function saveEditedSubtask(event,i) {
    let [subtaskEditInput,subtaskList,subtaskEditCon] = getSubtaskElements(event.currentTarget);

    if (currentEditIndex !== null && subtaskEditInput.value !== "") {
       subtasks[currentEditIndex].name = subtaskEditInput.value;
       subtaskEditCon.classList.add("d-none");
       renderSubtasks(subtaskList);
       currentEditIndex = null;
       subtaskEditInput.value = "";
    } else {
        deleteSubtask(event, i)
        subtaskEditInput.value = "";
        subtaskEditCon.classList.add("d-none");
    }
    setSubtaskScrollBar(subtaskEditCon);
}


/**
 *
 * PRIVATE
 * 
 * Moves the Selectet Content to a new Inputfield
 *  
 * @param {element} target    - The emlement we want to analyse
 * @param {integer} index     - index of the subtask in array
 */
function fillSubtaskInput(target,index) {
    let container  = target.closest(".subtask-container").querySelector(".edit-input-con");
    let input      = container.querySelector("INPUT");
    input.value = subtasks[index].name;
    currentEditIndex = index;
}

/**
 * 
 * PRIVATE 
 * 
 * Toggles Scrollbar at Subtask
 * 
 * @param {element} element - element of the container width d-none (edit-input-con)
 */
function setSubtaskScrollBar(element) {
    scrollContainer = element.closest(".subtask-container").querySelector("ul")
    if (element.classList.contains("d-none")) {
        scrollContainer.style.overflow="";
    } else {
        scrollContainer.style.overflow="hidden";
    }
}


/**
 *
 * PRIVATE
 * 
 * Displays the Inputfiled at the correct Position
 *  
 * @param {element} target  - The emlement we want to analyse
 */
function displaySubtaskInput(element) {
    let container  = element.closest(".subtask-container").querySelector(".edit-input-con");
    let target     = element.closest(".list-item");
    let input      = container.querySelector("INPUT");
    
    container.classList.remove("d-none");
    container.style.marginTop=0;
    setSubtaskScrollBar(container);

    let rectTarget    = target.getBoundingClientRect();
    let rectContainer = container.getBoundingClientRect(); // Hier Ok
    container.style.marginTop=`${(rectTarget.top - rectContainer.top)}px`;
    input.focus();
}


/**
 *
 * PUBLIC
 * 
 * UI: give the Option to edit a Subtask
 *  
 * @param {event} event       - Doubleclick/click event 
 * @param {integer} index     - index of the subtask in array
 */
function editSubtask(event,index) {
    fillSubtaskInput(event.currentTarget,index);
    displaySubtaskInput(event.currentTarget);
}


/**
 * 
 * PRIVATE
 * 
 * Renders the List of Subtasks, and abels it to do any action
 * 
 * @param {elemen} subtaskList - Target to fill the data
 */
function renderSubtasks(subtaskList) {
    if (subtasks== null) return;
    subtaskList.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        subtaskList.innerHTML +=/*html*/ `
            <div class="list-item relative">
                <li ondblclick="editSubtask(event,${i})">
                    <input type="text" value="${subtasks[i].name}">
                </li>
                <div class="subtask-icon">
                    <img onclick="editSubtask(event,${i})" src="./assets/img/desktop/subtask-edit.svg" alt="">
                    <div class="h-line24"></div>    
                    <img onclick="deleteSubtask(event,${i})" src="./assets/img/desktop/subtask-delete.svg" alt="">
                </div>
                <div class="subtask-change d-none"></div>
            </div>
        `;
    }
 }
 