//references to HTML elements
const timeDisplay=document.getElementById('time-display');
const startBtn=document.getElementById('start-btn');
const pauseBtn=document.getElementById('pause-btn');
const resetBtn=document.getElementById('reset-btn');
const shortBreakBtn=document.getElementById('short-break-btn');
const longBreakBtn=document.getElementById('long-break-btn');
const messageDisplay=document.getElementById('message');

const newTaskInput=document.getElementById('new-task-input');
const addTaskBtn=document.getElementById('add-task-btn');
const taskList=document.getElementById('task-list');

//Global variables for our timer state
let countdown;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isPaused = true;
let currentMode = 'pomodoro'; // 'pomodoro', 'short-break', 'long-break'

//durations for each mode (in seconds)
const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK_TIME = 5 * 60; // 5 minutes
const LONG_BREAK_TIME = 15 * 60; // 15 minutes

// storage
let tasks = [];

// Helper functions 

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Updates time
    function updateDisplay() {
        timeDisplay.textContent= formatTime(timeLeft);
    }

    // saves to storage
    function saveTasks(){
        localStorage.setItem('pomodoroTasks', JSON.stringify(tasks));
    }

    // loads tasks to local storage
    function loadTasks() {
        const savedTasks = localStorage.getItem('pomodoroTasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        renderTasks();
    }

// Timer functions

   //Starts the countdown
   function startTimer() {
    if(!isPaused) {
        return;
    }

    isPaused = false;
    messageDisplay.textContent = 'LOCK IN!!!!';
    timeDisplay.style.color = '#4CAF50'
    
    // intervals
    countdown = setInterval(() => {
        if (timeLeft <=0){
            clearInterval(countdown);
            isPaused = true;
            messageDisplay.textContent = 'Time\'s up! KABOOM!!!'
            return;
        }

        timeLeft--;
        updateDisplay();
    }, 1000);
}


   // Pauses the countdown
    function pauseTimer() {
        clearInterval(countdown);
        isPaused = true;
        messageDisplay.textContent = 'Explosion pending... (paused)';
    }

   // Resets the countdown
     function resetTimer() {
        pauseTimer();
        if (currentMode === 'pomodoro') {
            timeLeft = POMODORO_TIME;
        }
        else if (currentMode === 'short-break'){
            timeLeft = SHORT_BREAK_TIME;
        }
        else if (currentMode === 'long-break'){
            timeLeft = LONG_BREAK_TIME;
        }
        updateDisplay();
        messageDisplay.textContent = 'Ready to (explode) start!';
     }

    // Changes the mode of the timer
     function setMode(mode) {
        currentMode = mode;
        resetTimer();
        if (mode === 'pomodoro'){
            messageDisplay.textContext = 'LOCK IN!!!';
            timeDisplay.style.color = '#4CAF50'
        }
        else if (mode === 'short-break') {
            messageDisplay.textContent = 'Enjoy your break....';
            timeDisplay.style.color = '#FFC107';
        }
        else if(mode === 'long-break') {
            messageDisplay.textContent = 'Time for a long break!';
            timeDisplay.style.color = "#2196F3";
        }
     }



// Task Management

// tasks array into the html list
function renderTasks() {
    taskList.innerHTML = ''; 
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li'); 
        if (task.completed) {
            listItem.classList.add('completed');
        }

        // identify which task is being clicked
        listItem.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
            <span>${task.text}</span>
            <button data-index="${index}">Delete</button>
        `;
        taskList.appendChild(listItem);
    });
    saveTasks(); // save tasks
}



// adds a new task to  array and re-renders the list
function addTask() {
    const taskText = newTaskInput.value.trim(); 
    if (taskText !== '') {
        tasks.push({ text: taskText, completed: false }); 
        newTaskInput.value = ''; 
        renderTasks(); 
    }
}


// clicks within the task list (for checkboxes and delete buttons), * @param {Event} event - The click event object.
function handleTaskClick(event) {
    const clickedElement = event.target; 
    const index = clickedElement.dataset.index; 

    if (clickedElement.tagName === 'BUTTON' && index !== undefined) {
        tasks.splice(index, 1); 
        renderTasks(); 
    }
    // If a checkbox was clicked and it has an index
    else if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && index !== undefined) {
        tasks[index].completed = clickedElement.checked;
        renderTasks();
    }
}




// Event Listeners

// timer control buttons
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
shortBreakBtn.addEventListener('click', () => setMode('short-break'));
longBreakBtn.addEventListener('click', () => setMode('long-break'));



// task management buttons and input
addTaskBtn.addEventListener('click', addTask);



// allow adding a task by pressing Enter 
newTaskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});



// use event delegation on the task list to handle clicks on checkboxes and delete buttons
taskList.addEventListener('click', handleTaskClick);




// initial setup
window.onload = function() {
    updateDisplay(); 
    loadTasks(); 
};
