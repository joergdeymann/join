/**
 * 
 * is executed when the page loads, checks whether and which user is logged in, generates the user monogram, the welcome text and updates the dashboard
 * 
 */
function init() {
   if (isLogged()) {
      logedUserMonogram();
      mobileGreeting();

      greetingUser();
      updateDashboard();
   }
}

 
/**
 * 
 * checks which user is logged in and generates the personal greeting
 * 
 */
function greetingUser() {
   salutation();
   let data= JSON.parse(sessionStorage.getItem(PROJECT));  
   let userName = data.username; 
   if (userName == "guest") {
      document.getElementById('greetingSalutation').innerHTML+="!";
   } else {
      document.getElementById('greetingSalutation').innerHTML+=",";
      document.getElementById('userName').innerHTML = userName;
   }
}


/**
 * 
 * generates different greetings depending on the time of day
 * 
 */
function salutation() {
   let hello = getGreeting();
   document.getElementById('greetingSalutation').innerHTML = hello;
}


/**
 * 
 * creates and updates each tile, will give an error if loading is not possible
 * 
 */
async function updateDashboard() {
   try { // AUA: do you know what you are doing here ?
      createToDoCount();
      createDoneCount();
      createUrgentCount();
      createInProgressCount();
      createAwaitingFeedbackCount();
      createTotalCount();
      createNextDeadline();
      const deadlineElement = document.querySelector('.urgentDate');
   } catch (error) {
      console.error('Fehler beim Laden des Dashboards:', error);
   }
}


/**
 * 
 * creates the ToDo tasks counter value HTML
 * 
 */
async function createToDoCount() {
   const todoCount = await countTasksByStatus('to-do');
   document.getElementById('todo-count').innerText = todoCount;
}


/**
 * 
 * creates the Done tasks counter value HTML
 * 
 */
async function createDoneCount() {
   const doneCount = await countTasksByStatus('done');
   document.getElementById('done-count').innerText = doneCount;
}


/**
 * 
 * creates the urgent tasks counter value HTML
 * 
 */
async function createUrgentCount() {
   const urgentCount = await countTasksByPrio('urgent');
   document.getElementById('urgent-count').innerText = urgentCount;
}


/**
 * 
 * creates the on progress tasks counter value HTML
 * 
 */
async function createInProgressCount() {
   const inProgressCount = await countTasksByStatus('in-progress');
   document.getElementById('in-progress-count').innerText = inProgressCount;
}


/**
 * 
 * creates the awaiting feedback tasks counter value HTML
 * 
 */
async function createAwaitingFeedbackCount() {
   const awaitingFeedbackCount = await countTasksByStatus('await-feedback');
   document.getElementById('awaiting-feedback-count').innerText = awaitingFeedbackCount;
}


/**
 * 
 * creates the total number of tasks counter value HTML
 * 
 */
async function createTotalCount() {
   const totalCount = await countAllTasks();
   document.getElementById('total-count').innerText = totalCount;
}


/**
 * 
 * creates the next deadline value HTML
 * 
 */
async function createNextDeadline() {
   const nextDeadline = await findNextDeadline();
   const deadlineElement = document.getElementById('deadline'); 
   deadlineElement.innerText = nextDeadline || 'No upcoming deadlines';
}

/**
 * redirects the user to the kanban board when clicked
 * 
 */

function forwardingToBoard() {
   window.location.href = './kanbanboard.html';
}

/**
 * 
 * filters tasks by status and returns the amount per status
 * 
 * @param {string} status 
 * @returns amount of tasks per status 
 */
async function countTasksByStatus(status) {
   const tasks = await loadData('taskstorage');
   if (!tasks) {
      return 0;
   }
   const taskArray = Object.values(tasks);
   return taskArray.filter((task) => task && task.status === status).length;
}


/**
 * 
 * filters tasks by priority status and returns the amount per status
 * 
 * @param {string} prio 
 * @returns amount of tasks per status
 */
async function countTasksByPrio(prio) {
   const tasks = await loadData('taskstorage');
   if (!tasks) {
      return 0;
   }
   const taskArray = Object.values(tasks);
   return taskArray.filter((task) => task && task.prio === prio).length;
}


/**
 * 
 * count all tasks in kanbanbord
 * 
 * @returns number of tasks
 */
async function countAllTasks() {
   const tasks = await loadData('taskstorage');
   if (!tasks || Object.keys(tasks).length === 0) {
      return 0;
   }
   const taskArray = Object.values(tasks).filter((task) => task !== null);
   return taskArray.length;
}


/**
 * 
 * Finds and returns the next upcoming task deadline or null
 *
 * @returns next task deadline or null
 */
async function findNextDeadline() {
   const tasks = await loadObjectData('taskstorage');
   if (!tasks) return null;
   const today = new Date();
   const upcomingTask = Object.values(tasks)
      .filter(hasValidDueDate)
      .map(convertDueDate)
      .filter((task) => task.dueDate >= today)
      .sort((a, b) => a.dueDate - b.dueDate)[0];
   return formatDueDate(upcomingTask);
}


/**
 * 
 * Checks if a task has a valid due date
 * 
 * @param {Object} task - The task object to check
 * @param {string|Date} task.dueDate - The due date of the task
 * @returns {boolean} - Returns true if the task and its due date are valid, otherwise false
 */
function hasValidDueDate(task) {
   return task && task.dueDate;
}


/**
 * Converts the task's due date to a Date object.
 * 
 * @param {Object} task - The task object to convert.
 * @param {string|Date} task.dueDate - The due date of the task, which may be a string or a Date object.
 * @returns {Object} - Returns a new task object with the due date as a Date object.
 */
function convertDueDate(task) {
   return {
      ...task,
      dueDate: new Date(task.dueDate),
   };
}


/**
 * Formats the task's due date as a localized string.
 * 
 * @param {Object} task - The task object containing the due date
 * @param {Date} task.dueDate - The due date of the task
 * @returns {string|null} - Returns the formatted due date string in 'en-US' format, or null if no task is provided
 */
function formatDueDate(task) {
   return task 
      ? task.dueDate.toLocaleDateString('en-US', {
           year: 'numeric',
           month: 'long',
           day: 'numeric',
        })
      : null;
}


/**
 * 
 * PRIVATE
 * 
 * Checks if Phone is in Landscape
 * Checks if User comes from login page
 * 
 * @returns 
 * - true if: 
 *    Phone is in landsacpe
 *    AND
 *    User comes from Login
 */
function mustShowMobileGreeting() {
   let firstlogin=(new URLSearchParams(window.location.search)).get('login') != null
   let width = +window.innerWidth;

   return firstlogin && width<=450;

}


/**
 * 
 * PRIVATE
 * 
 * Sets a greeting on a Mobile Phone, 
 * sleeps a while and
 * then open then hides the message 
 */
async function showMobileGreeting() {
   const greeting = document.querySelector(".mobile-greeting");
   const welcome=getGreeting();
   const   user=getUsername();
   if (user=="guest") {
      greeting.innerHTML=`<span>${welcome}!</span><span></span>`;
   } else {
      greeting.innerHTML=`<span>${welcome},</span><span>${user}</span>`;      
   }
   greeting.style.opacity=0;
   await new Promise(e => setTimeout(e,2000));
   greeting.style.display="none";
}


/**
 * 
 * PUBLIC
 * 
 * If we are on Mobile Phone we send a greeting , before we continue
 */
async function mobileGreeting() {
   if (mustShowMobileGreeting() ) {
      showMobileGreeting();
   } else {
      document.querySelector(".mobile-greeting").style.display="none";
   }
}
