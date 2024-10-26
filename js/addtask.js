let doNotSubmit= false;
let tasks= [];


/**
 * 
 * PRIVATE
 * 
 * Prepares effective a new Dataset for the new Task
 * 
 * @returns prepared Dataset
 */
function prepareDataset() {
   return {
      id: getNewId(tasks), 
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      assignedTo: Array.from(
         document.querySelectorAll('input[name="assign"]:checked')
      ).map((checkbox) => +checkbox.value),
      dueDate: document.getElementById("due-date").value,
      prio: document.querySelector('input[name="prio"]:checked').value,
      category: document.getElementById("category").value,
      status: "to-do",
      subtasks: subtasks
   }
}


/**
 * 
 * PUBLIC
 * 
 * Adds a new Task to the database
 * - checks the input fields before and returns before end if something wrong
 * - clears the Inputfields
 * 
 * @returns -nothing
 */
async function addNewTask() {
   if (doNotSubmit) return;
   if (!showRequiredText()) return;   
   tasks = await loadData("taskstorage");
   if (tasks === null) tasks = [];
   tasks.push(prepareDataset());
   await saveData("taskstorage", tasks);
   clearTaskInputs();
   openKanbanboard();
}


/**
 * 
 * PUBLIC
 * 
 * Clears all Input Fields AddTask
 *  
 * @returns - nothing
 */
function clearTaskInputs() {
   document.getElementById("title").value = "";
   document.getElementById("description").value = "";
   document
      .querySelectorAll('input[name="assign"]')
      .forEach((checkbox) => (checkbox.checked = false));
   document.getElementById("due-date").value = "";
   document.getElementById('addtask-monogramlist').innerHTML="";
   document.querySelectorAll('input[name="prio"]').forEach((radio) => {
      if (radio.id == "medium") {
         radio.checked = true;
      } else {
         radio.checked = false;
      }
   });
   document.getElementById("category").selectedIndex = 0;
   subtasks = [];
   document.getElementById("subtasks").value = "";
   document.getElementById("addtask-monogramlist").innerHTML = "";
   document.getElementById("subtask-list").innerHTML = "";
}


/**
 * 
 * Display Checkboxes
 */
let expanded = false;
function showCheckboxes() {
   let checkboxes = document.getElementById("checkboxes");
   if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
   } else {
      checkboxes.style.display = "none";
      expanded = false;
   }
}


/**
 * 
 * First Initialisation
 * - Checks Login
 * - Load Contactlist
 * - Displays Monogram at Header
 * - Inits AssignSelector/Contacts Events
 */
async function init() {
   if (isLogged()) {
      contacts=await loadSortedContactList();
      logedUserMonogram();
      date = new Date().toISOString().split('T')[0];
      document.getElementById('due-date').setAttribute('min', date);
      initAssignSelector();

   }
}


/**
 * 
 * PRIVATE
 * 
 * Renders The Subtask Edit and Display Section
 * 
 * @param {array} subtaskList - List of all Subtasks of the Task
 */
function renderSubtasks(subtaskList) {
   subtaskList.innerHTML = "";

   for (let i = 0; i < subtasks.length; i++) {
      subtaskList.innerHTML += `
      <div id="subtask-con" class="list-item">
           <li ondblclick="editSubtask(${i})">
               <input type="text" value="${subtasks[i].name}">
           </li>
           <div class="subtask-icon">
               <img onclick="editSubtask(${i})" src="./assets/img/desktop/subtask-edit.svg" alt="">
               <img onclick="deleteSubtask(${i})" src="./assets/img/desktop/subtask-delete.svg" alt="">
           </div>
       </div>`;
   }
}


/**
 * 
 * PUBLIC
 * 
 * Delete Subtask from Array
 */
function deleteSubtask(i) {
   let subtaskList = document.getElementById("subtask-list");
   let subtaskEditInput = document.getElementById("subtask-edit-input");
   let subtaskEditCon = document.getElementById("edit-input-con");

   subtasks.splice(i, 1);
   subtaskEditCon.classList.add("d-none");
   renderSubtasks(subtaskList);
   subtaskEditInput.value = "";
}


/**
 * 
 * PUBLIC
 * 
 * Open the Subtask input areae area
 */
function editSubtask(index) {
   let subtaskEditInput = document.getElementById("subtask-edit-input");
   let subtaskEditCon = document.getElementById("edit-input-con");

   subtaskEditCon.classList.remove("d-none");
   subtaskEditInput.value = subtasks[index].name;
   currentEditIndex = index;
}


/**
 * 
 * PUBLIC
 * 
 * Save the Subtask we added to array
 */
function saveEditedSubtask() {
   let subtaskEditInput = document.getElementById("subtask-edit-input");
   let subtaskList = document.getElementById("subtask-list");
   let subtaskEditCon = document.getElementById("edit-input-con");

   if (currentEditIndex !== null && subtaskEditInput.value !== "") {
      subtasks[currentEditIndex].name = subtaskEditInput.value;
      subtaskEditCon.classList.add("d-none");
      renderSubtasks(subtaskList);
      currentEditIndex = null;
      subtaskEditInput.value = "";
   }
}


/**
 * 
 * PUBLIC
 * 
 * Open Kanbanboard after Moving an Msg
 */
async function openKanbanboard() {
   await msgfly();
   window.location = "./kanbanboard.html";
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
 * @returns - true if there is an error
 */
function showRequiredText() {
   let field,msg;
   let err=false;

   field = document.getElementById("title");
   msg = document.getElementById("title-span");
   err   = faultDisplay(field,msg) || err;
   field = document.getElementById("due-date");
   msg = document.getElementById("due-date-span");
   err   = faultDisplay(field,msg) || err;
   field = document.getElementById("category");
   border = document.getElementById("select-box");
   msg = document.getElementById("category-span");
   err   = faultDisplay(field,msg,border) || err;
   return !err;
}


/**
 * 
 * PUBLIC EVENT 
 * 
 * Prevent in forms that Form ist submitten when pressing Enter key
 * Handels Subtask via Enter Key
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
 * Deletes the preventation that we submit, when we loose the focus f any field
 * it was set because ENTER Key, see noSuBmit, was hit at entree of add Submit 
 * 
 */
document.addEventListener("focusout",() => {
   doNotSubmit=false;
})
