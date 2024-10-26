let initialX, initialY, offsetX, offsetY;
let draggingItem = null;
let originalItem = null;
let touchHighlight = null;
let touch = {
    time: null,
}


/**
 * PRIVATE
 * 
 * Saves the time 
 * - we pressed the first Time
 * - and when wie move the touch bevor 200ms left
 * 
 */
function setTouchTime() {
    touch.time=Date.now();
}


/**
 * PRIVATE
 * 
 * Get the Different between now and the saved Time from setTouch()
 * 
 */
function getTouchDelay() {
    return Date.now()-touch.time;
}


/**
 * PRIVATE
 * 
 * TouchMove will be only available, when already 200ms left
 * 
 */
function isTouchMoveAvailable() {
    return getTouchDelay()>200;
}


/**
 * 
 * PRIVATE
 * 
 * Clone the Card we want to move
 * and save the orgiginal Card
 * 
 * @param {*} event 
 */
function startTouchSetup(event) {
    originalItem=event.target.closest(".card");
    let cloneItem = originalItem.cloneNode(true);
    document.getElementById("touch-card").replaceChildren(cloneItem);
    draggingItem=document.getElementById("touch-card");
}


/**
 * 
 * PRIVATE
 * 
 * Find out the Positions and save them for the Movement
 * 
 * @param {*} event 
 */
function startTouchSetPosition(event) {
    initialX = event.touches[0].clientX;
    initialY = event.touches[0].clientY;

    offsetX=originalItem.getBoundingClientRect().x; 
    offsetY=originalItem.getBoundingClientRect().y; 
    draggingItem.style.top=offsetY+"px";
    draggingItem.style.left=offsetX+"px";
}


/**
 * 
 * PUBLIC
 * 
 * Initialises the Movement of a card
 * 
 * @param {event} event -starttouch event 
 */
function startTouch(event) {  
    setTouchTime();
    startTouchSetup(event);
    startTouchSetPosition(event);
}



/**
 * PRIVATE
 * 
 * Moves the Card width the touched finger
 * 
 * @param event - event ontouchmove
 */
function moveTouchPosition(event) {
    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const deltaX = currentX - initialX;
    const deltaY = currentY - initialY;
    document.body.style.overflow = 'hidden'; 
    draggingItem.style.left = (offsetX + deltaX) + "px";  
    draggingItem.style.top = (offsetY + deltaY) + "px";
}


/**
 * 
 * PUBLIC
 * 
 * Moves the Card, 
 * looks for teh Main Container where it can move to and marks it
 * 
 * @param {event} event - ontouchmove event
 */
function moveTouch(event) {
  if (!draggingItem) return;

  if (!isTouchMoveAvailable()) {
    setTouchTime();
    return;
  }
  document.getElementById("touch-card").classList.remove("d-none");
  document.getElementById("touch-overflow").style.zIndex=2;
  moveTouchPosition(event);
  markTouchedContainer(event);
}


/**
 * 
 * PRIVATE
 * 
 * Mak the overtouched Container and disable that scrolling
 * 
 * @param {event} event - touchmove  
 */
function markTouchedContainer(event) {
    if (event == null) {
        touchHighlight.classList.toggle("task-border",false)
        touchHighlight=null;
        return;
    }
    let container=getTargetElement(event);
    if (container) {
        touchHighlight=container;
        container.classList.toggle("task-border",true)
    } else if (touchHighlight != null) {
        touchHighlight.classList.toggle("task-border",false)
        touchHighlight=null;
    }
}


/**
 * 
 * PRIVATE
 * 
 * gets the Container of the Card the event is triggert
 * 
 * @param {event} event touchend - Release Touch screen 
 * @returns - targetElemen . Container of all Cards
 */
function getTargetElement(event) {
    const touch = event.changedTouches[0];
    draggingItem.style.pointerEvents = "none";
    let targetElement=document.elementFromPoint(touch.clientX, touch.clientY);
    draggingItem.style.pointerEvents = "auto";
    if (targetElement != null && !targetElement.classList.contains("containers")) targetElement=targetElement.closest(".containers");    
    return targetElement;
}


/**
 * 
 * PRIVATE
 * 
 * Saves the New status in the database
 * shows the Task on the correct position
 * 
 * @param {element} target - element of the target - container
 */
async function refreshTask(target) {
    let status=target.id.replace("-container","");
    let id=+originalItem.id.replace("task-","");
    tasks=await loadData("taskstorage");
    let index=tasks.findIndex(e=> e.id==id);
    if (index != -1){
        tasks[index].status=status;
        saveData("taskstorage",tasks);
    }
}


/**
 * 
 * PUBLIC
 * 
 * Touch has been released
 * Set the card to the target location
 * Reset touching values
 * 
 * @param {event} event - endtouch   
 */
function endTouch(event) {
    let targetElement=getTargetElement(event);
    let orgElement=originalItem.closest(".containers");
    
    if (targetElement != orgElement) {
        if (targetElement != null && orgElement != null) {
            targetElement.appendChild(originalItem);
            refreshTask(targetElement);
        }
    } 
    document.getElementById("touch-card").innerHTML="";
    document.getElementById("touch-card").classList.add("d-none");
    draggingItem = null;
    originalItem = null;
}