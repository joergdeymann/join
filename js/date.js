/**
 * 
 * Gived Back the Text of Greeting generated from hour of day
 *      0 = "hello", wrong hour
 *      1 = "Good Morning" 5 - 11
 *      2 = "Good Afternoon 12 - 17
 *      3 = "Good Evening" 18-21
 *      4 = "Good Night" 22-4
 *  
 * @param {int} greetingPos - Returns the Greeting Text
 * @returns - The Greeting Text of the Time we have 
 */
function getGreeting(greetingPos=getGreetingPos()) {
    let text=[
        "Hello",
        "Good Morning",
        "Good Afternoon",
        "Good Evening",
        "Good Night"
    ];
    if (greetingPos<0 || greetingPos>4) greetingPos=0;
    return text[greetingPos];
}


/**
 * 
 * Get the  time position for greeting of the hour we have
 * Yes, some oversized check is in here
 * 
 * @returns - time position  
 *      0 = "hello", wrong hour
 *      1 = "Good Morning" 5 - 11
 *      2 = "Good Afternoon 12 - 17
 *      3 = "Good Evening" 18-21
 *      4 = "Good Night" 22-4
 */
function getGreetingPos() {
    let heute = new Date();
    let d=heute.getHours();    
    switch (true) {
        case (d>23):
            return 0; // Hello
        case (d<=4):
        case (d>=22):
            return 4; // Good Night
        case (d<12):  
            return 1; // Good Morning
        case (d<18): 
            return 2; // Good Afternoon
        case (d<22): 
            return 3; // Good Evening
        default:
            return 0; //Hello
    }
}


/**
 * 
 * PUBLIC
 * 
 * Disable to select a Date before today
 * 
 * changes the Element 
 * 
 * @param {element} element HTML - Element to set the min Date
 */
function setMinDate(element) {
    let today = new Date().toISOString().split('T')[0];
    element.setAttribute('min', today);
}