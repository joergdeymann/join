
function reset() {
    document.getElementById("msg").innerHTML=`        
        <li>Create a new User List (overwrite the old one) ... done</li>
        <li>Create a new Tasklist for the Guest User ... done</li>
        <li>Create a ContactList for the Guest User ...done</li>
    `
    saveUser();
    saveContacts();
    //saveTasks();
}

function saveUser() {
    let ul = [
        {user:"guest",password:"",email:"donotrespond@nodomain.tld"},
        {user:"Joerg",password:"abc",email:"mail@joergdeymann.de"}
    ]; // Create Guest User 1
    saveData("user",ul); //Create Userlist
}

async function saveContacts() {
        let contacts = [
        { color : "rgb(255,122,0)" , id: 1, name: "Zoe", lastname: "Zimmerman", email: "zoe.zimmerman@gmail.com", phone: "016167986534" },
        { color : "rgb(255,94,179)" , id: 2, name: "Anna", lastname: "Anderson", email: "anna.anderson@example.com", phone: "014367986534" },
        { color : "rgb(110,82,255)" , id: 3, name: "Zora", lastname: "Baker", email: "zora.baker@example.com", phone: "015867986534" },
        { color : "rgb(147,39,255)" , id: 4, name: "Firat", lastname: "Carter", email: "firat.carter@web.de", phone: "055567986534" },
        { color : "rgb(0,190,232)" , id: 5, name: "Carl", lastname: "Dawson", email: "carl.dawson@example.com", phone: "056967986534" },
        { color : "rgb(31,215,193)" , id: 6, name: "Alwin", lastname: "Evans", email: "emma.evans@example.com", phone: "014767986534" },
        { color : "rgb(255,116,94)" , id: 7, name: "Joerg", lastname: "Foster", email: "joerg.foster@example.com", phone: "014967986534" },
        { color : "rgb(0,56,255)" , id: 8, name: "Greta", lastname: "Gibson", email: "greta.gibson@example.com", phone: "035767986534" },
        { color : "rgb(255,187,43)" , id: 9, name: "Karlotta", lastname: "Hansen", email: "hans.hansen@example.com", phone: "04067986534" },
        { color : "rgb(255,70,70)" , id: 10, name: "Alex", lastname: "Irving", email: "alex.irving@example.com", phone: "014367988934" },
        { color : "rgb(255,199,1)" , id: 11, name: "Julia", lastname: "Jones", email: "julia.jones@example.com", phone: "014367986534" },
    ];
    
    await saveData("Contacts",contacts); //Create Userlist
    setHighestId("contact", 12);
}

function saveTasks() {
    let tasks = [
        {
            "id": 0,
            "title": "User Login Feature",
            "assignedTo": [1, 3],
            "category": "user-story",
            "description": "As a user, I want to log into my account using email and password",
            "dueDate": "2024-11-01",
            "prio": "urgent",
            "status": "in-progress",
            "subtasks": [
              { "name": "Design login page", "done": true },
              { "name": "Set up authentication service", "done": false },
              { "name": "Integrate with backend", "done": true }
            ]
          },
          {
            "id": 1,
            "title": "Optimize Database Performance",
            "assignedTo": [2, 5, 6],
            "category": "technical-task",
            "description": "Database optimization for better query performance",
            "dueDate": "2024-11-15",
            "prio": "medium",
            "status": "await-feedback",
            "subtasks": [
              { "name": "Analyze slow queries", "done": true },
              { "name": "Optimize indexing", "done": true },
              { "name": "Update schema", "done": true }
            ]
          },
          {
            "id": 2,
            "title": "Fix Payment Module Bugs",
            "assignedTo": [1, 4],
            "category": "technical-task",
            "description": "Bug fixing for payment module to resolve failed transactions",
            "dueDate": "2024-10-25",
            "prio": "urgent",
            "status": "done",
            "subtasks": [
              { "name": "Identify payment errors", "done": true },
              { "name": "Fix validation issues", "done": true },
              { "name": "Test payment flows", "done": true }
            ]
          },
          {
            "id": 3,
            "title": "Set Up CI/CD Pipeline",
            "assignedTo": [3],
            "category": "technical-task",
            "description": "Set up CI/CD pipeline for automated deployments",
            "dueDate": "2024-11-10",
            "prio": "medium",
            "status": "to-do",
            "subtasks": [
              { "name": "Configure build server", "done": false },
              { "name": "Write deployment scripts", "done": false },
              { "name": "Integrate with version control", "done": false }
            ]
          },
          {
            "id": 4,
            "title": "Improve Dashboard Loading Time",
            "assignedTo": [2, 4, 5],
            "category": "user-story",
            "description": "As a user, I want a faster loading dashboard",
            "dueDate": "2024-10-30",
            "prio": "urgent",
            "status": "await-feedback",
            "subtasks": [
              { "name": "Optimize API calls", "done": true },
              { "name": "Reduce dashboard assets size", "done": true },
              { "name": "Test performance improvements", "done": true }
            ]
          },
          {
            "id": 5,
            "title": "Write API Documentation",
            "assignedTo": [1, 2],
            "category": "technical-task",
            "description": "Write and publish API documentation",
            "dueDate": "2024-12-05",
            "prio": "low",
            "status": "to-do",
            "subtasks": [
              { "name": "Write REST API documentation", "done": false },
              { "name": "Review API endpoints", "done": false },
              { "name": "Publish docs to API portal", "done": false }
            ]
          },
          {
            "id": 6,
            "title": "Security Audit Preparation",
            "assignedTo": [3, 7],
            "category": "user-story",
            "description": "As a security officer, I want the application to pass a full security audit",
            "dueDate": "2024-11-20",
            "prio": "urgent",
            "status": "in-progress",
            "subtasks": [
              { "name": "Review security policies", "done": true },
              { "name": "Perform code analysis", "done": false },
              { "name": "Fix vulnerabilities", "done": false }
            ]
          },
          {
            "id": 7,
            "title": "Mobile Accessibility Enhancements",
            "assignedTo": [2, 4],
            "category": "user-story",
            "description": "As a user, I want the app to be more accessible on mobile devices",
            "dueDate": "2024-11-05",
            "prio": "medium",
            "status": "done",
            "subtasks": [
              { "name": "Redesign navigation menu for mobile", "done": true },
              { "name": "Enhance mobile responsiveness", "done": true },
              { "name": "Improve accessibility features", "done": true }
            ]
          },
          {
            "id": 8,
            "title": "Server Infrastructure Upgrade",
            "assignedTo": [4],
            "category": "technical-task",
            "description": "Upgrade server infrastructure for higher scalability",
            "dueDate": "2024-12-01",
            "prio": "urgent",
            "status": "to-do",
            "subtasks": [
              { "name": "Set up new servers", "done": false },
              { "name": "Migrate databases", "done": false },
              { "name": "Test load balancing", "done": false }
            ]
          },
          {
            "id": 9,
            "title": "Create Unit Tests",
            "assignedTo": [1, 2, 3],
            "category": "technical-task",
            "description": "Create unit tests for newly implemented features",
            "dueDate": "2024-11-10",
            "prio": "medium",
            "status": "await-feedback",
            "subtasks": [
              { "name": "Write unit tests for API endpoints", "done": true },
              { "name": "Run tests locally", "done": true },
              { "name": "Integrate with CI/CD", "done": true }
            ]
          } 
    ];
    
    //saveData("Tasks",tasks); //Create Userlist
    saveData("taskstorage",tasks); //Create Userlist
}