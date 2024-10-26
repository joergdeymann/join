let statusList=[
   "to-do",
   "in-progress",
   "await-feedback",
   "done"];


/**
 * 
 * PUBLIC
 * 
 * Init, when open Kanbanboard
 * load Contacts 
 * display monogram
 */
async function init() {
   if (isLogged()) {

      contacts = await loadData('Contacts');
      fetchTasks();
      logedUserMonogram();
      //initSelector();
   }
}


/**
 * 
 * PRIVATE 
 * 
 * Organise Tasks in each category
 * 
 * @param {object} tasks - List of Tasks
 */
function displayTasks(tasks) {
   for(let status of statusList) {
      addContainerData(tasks,status);
   }
   resizeContainer();
}


/**
 * 
 * PRIVATE
 * 
 * Load Tasks from Firebase
 * save them in a global Variable 
 */
async function fetchTasks() {
   // tasks = await loadData('taskstorage');
   tasks = await loadObjectData('taskstorage');

   if (tasks) {
      displayTasks(tasks);
   } 
}


/**
 * 
 * PUBLIC
 * 
 * Filter Tasks by given Input Field
 */
function filterTasks() {
   let search=document.getElementById("find").value.toLowerCase();
   let filteredTasks=tasks.filter(e => e.title.toLowerCase().includes(search) || e.description.toLowerCase().includes(search) )
   displayTasks(filteredTasks);
}


/**
 * 
 * PRIVATE
 * 
 * Prepares the Contact Icons in one Card
 * - Creates a List of overlayed Contact Icons
 * - Maximum 5 Contacts will be shown
 *  
 * @param {array} assigns - array of Object: contacts 
 * @returns - html output
 */
function getContacts(assigns) {
   if (assigns == null) return "";
   let html=``;
   for(i=0;i<Math.min(assigns.length,5);i++) {
      let contact=contacts.find(e => e.id == assigns[i]);
      if (contact == null) continue;
      let monogram=getMonogram(contact.name + " " + contact.lastname);
      html+=`<div style="background-color: ${contact.color};">${monogram}</div>`;
   }
   if (assigns.length>5) {
      html+=`<div class="count">+${(assigns.length-5)}</div>`;
   }
   return html;
}


/**
 * 
 * PRIVATE
 * 
 * creates a classnaame from the Catrgory given
 * 
 * @param {array} category - a list of Categorys 
 * @returns - classname for the given Headline/Category
 */
function getCategoryClass(category) {
   return category.toLowerCase().replace(" ","-");
}


/**
 * PRIVATE
 * 
 * Creates HTML Code for teh Progressbar
 * 
 * @param {object} task - one Task that we want to analyse  
 * @returns -  html output
 */
function getSubBar(task) {
   let subbar="";
   if (task.subtasks != null ) {
      let done=task.subtasks.filter(e => e.done).length;
      subbar=/*html*/`
         <div class="progress-container">
            <div class="progress-bar">
               <div id="progress" class="progress" style="width:${done*100/task.subtasks.length}%"></div>
            </div>
            <span>${done}/${task.subtasks.length} Subtasks</span>
         </div>
      `;
   }
   return subbar;
}


/**
 * 
 * PRIVATE
 * 
 * Creates a HTML Code for one Task Card
 * 
 * @param {object} task - one task for teh card 
 * @returns - html output
 */


function getTaskOutput(task) {
   let contacts=getContacts(task.assignedTo);
   let categoryClass=getCategoryClass(task.category);
   let subbar=getSubBar(task);
   let cat = getCategoryText(task);

   return /*html*/`
      <div class="card ${categoryClass}" id="task-${task.id}" 
      draggable="true" 
      ondragstart="drag(event)"
      ondragenter="toggleBorder(event,true)"
      onmouseup="openTask(event)"      
      ontouchstart="startTouch(event)" 
      ontouchmove="moveTouch(event)" 
      ontouchend="endTouch(event)"
     >
         <h1>${cat}</h1>
         <div class="mbb-text">
            <h1>${task.title}</h1>
            <span>${task.description}</span>
         </div>
         ${subbar}
         <div class="mbb-icons">
            <div class="monogram">
               ${contacts}
            </div>
            <div class="icon-prio-${task.prio}">
            </div>
         </div>
      </div>
   `;

}


/**
 *
 * PRIVATE
 * 
 * Creates A Container width Tasks for each status
 * 
 * @param {array} tasks - array of tasks - ful tasklist 
 * @param {*} status - status of the task as category
 * 
 */
function addContainerData(tasks,status) {
   let task = tasks.filter((t) => t['status'] == status);
   let container = document.getElementById(`${status}-container`);
   container.innerHTML = '';
   for (let i = 0; i < task.length; i++) {
      container.innerHTML += getTaskOutput(task[i]);
   }
   if (task.length >0)  {
      container.classList.add("hidden");
   } else {
      container.classList.remove("hidden");
   }
}


/**
 * PUBLIC EVENT
 * 
 * Makes one Crad Dropable
 * 
 * @param {event} ev - drop event 
 */
function allowDrop(ev) {
   ev.preventDefault();
}


/**
 * 
 * PUBLIC EVENT
 * 
 * is triggered, when dragging is active
 * 
 * @param {event} ev  - drag event
 */
function drag(ev) {
   if (ev.dataTransfer == null) {
      touchdrag(ev);
   } else {
      ev.dataTransfer.setData('text', ev.target.id);    
   }
   hideNoTaskInfo(ev);
   resizeContainer();
}

function touchdrag(ev) {
   touchId=ev.target.id;
   touchContainer=ev.target;
}


/**
 * 
 * PUBLIC EVENT
 * 
 * is triggered, when we drop the dragged task
 * 
 * @param {event} ev      - drop event
 * @param {string} status - status wher the task is in
 *  
 */
function drop(ev, status) {
   let data = ev.dataTransfer.getData('text');
   saveTask(data,status);
   appendTask(ev,data);
   resizeContainer();
   toggleBorder(ev,false);
   ev.preventDefault();
}


/**
 * 
 * PRIVATE EVENT
 * 
 * put the dragged Card to the new position
 *  
 * @param {event} event - ausgelöstes Event
 * @param {string} id - position to append the card 
 */
function appendTask(event,id) {
   let t=event.currentTarget; 
   t.appendChild(document.getElementById(id));
   t.classList.add("hidden");
}


/**
 * 
 * category: local firebase storage
 * 
 * saves the new information in the database
 * 
 * @param {string} data - id of Task card 
 * @param {*} status    - category/stats of the task in the timeline 
 */
function saveTask(data,status) {
   let textid=data.split('-')
   let id = Number(textid[1]);
   let index = tasks.findIndex(e => e.id == id);

   tasks[index].status = status;
   saveData('taskstorage', tasks);
}


/**
 * 
 * PRIVATE
 * 
 * sets the new scrollheight,
 * this is not automated so e have to handle it here
 * 
 * @param {id} id - element id 
 */
function setStyle(id) {
   let psc= (document.querySelector(".mbb").scrollHeight-0)+"px";
   document.getElementById(id).style.height=psc;
}


/**
 * 
 * PRIVATE 
 * 
 * Rezize te complete DIV Container, 
 * because it is not done automated
 * 
 */
function resizeContainer() {
   let mbb=document.querySelectorAll(".mbb")[1];
   let container=mbb.querySelector(".containers");   
   let psc= (mbb.scrollHeight-0)+"px";
   let height="100%";

   if (window.getComputedStyle(container).flexDirection != "column") {
      psc="";
      height="";
   }
   mbb.height=height;
   for (let id of statusList) {
      document.getElementById(`${id}-container`).style.height=psc;
   }

}


/**
 * Hides the gray Note "no task" or displays it
 * 
 * @param {event} e - drag event
 */
function hideNoTaskInfo(e) {
   let parent=e.target.parentElement;
   if (parent.childElementCount == 1) {
      parent.classList.remove("hidden");
   } else {
      parent.classList.add("hidden");
   }
}


/** 
 * 
 * Category: Library/Classes
 * 
 * returns the net top element with the given classname
 * (this is querySelector reverse)
 *  
 * @param {element} element   - the start search element 
 * @param {string} className  - the classname to find
 * @returns                   - the found element
 */
function getTopParent(element,className) {
   let e=element;
   while (e) {
      if (e.classList.contains(className)) return e;
      e=e.parentElement;
   }
   return null;
}


/**
 * PUBLIC
 * 
 * shows possible drop ability
 * 
 * @param {event} event - dragover event   
 * @param {string} status - column status
 */
function toggleBorder(event,status=null) {
   let e=getTopParent(event.target,"containers");
   // Only if container is completly leaving
   if (event.type === "dragleave" && e.contains(event.relatedTarget)) {
      return; 
   }   
   if (status == null) {
      e.classList.toggle("task-border");
   } else {
      e.classList.toggle("task-border",status);
   }
}