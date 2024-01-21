// all required elements
const inputField = document.querySelector(".input-field textarea"),
todoLists = document.querySelector(".todoLists"),
pendingNum = document.querySelector(".pending-num"),
clearButton = document.querySelector(".clear-button"),
addBtn = document.getElementById("addBtn");

let tasksList = [];

if (localStorage.getItem("doList") !== null) {
    tasksList = JSON.parse(localStorage.getItem("doList"));
    display();
}


function addTask() {
    let task = {
        name: inputField.value.trim(),
        checked: false,
        pending: true
    }
    if (task.name.length > 0) {
        tasksList.push(task);
        inputField.value = "";
        localStorage.setItem("doList", JSON.stringify(tasksList));
        localStorage.setItem("pendingNum", tasksList.length);
        display();
    }
}


/* function display() {
    let liTag = ``;
    for(let i = 0; i < tasksList.length; i++) {
        let checked = tasksList[i].checked;
        let pending = tasksList[i].pending;
    liTag += ` <li class="list ${pending ? "pending" : ""}" onclick="handleStatus(this)">
    <input type="checkbox" ${checked ? "checked" : ""}/>
    <span class="task">${tasksList[i].name}</span>
    <i class="fa-solid fa-trash text-danger" onclick="deleteTask(${i})"></i>
    </li>`;
    }
    todoLists.innerHTML = liTag;
    pendingNum.textContent = localStorage.getItem("pendingNum") || "no";
    if (tasksList.length > 0) {
        clearButton.style.pointerEvents = "auto";
        
    }else {
        clearButton.style.pointerEvents = "none";
    }
} */



// drag and drop

// dragstart => event occurs when the user starts to drag a selection.
// dataTransfer => object is used to hold the data that is being dragged during a drag and drop operation
// setData() method allows you to store any data you want in the dataTransfer object, which can be accessed by the drop target element.
// dataTransfer.setData(format, data);
// format => representing the type of the data, such as “text/plain” or “text/uri-list”
// data => representing the data value, such as the id of the dragged element or a URL.
//dragover event occurs when a draggable selection is dragged over a target.
//preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
// drop event occurs when a draggable selection is dropped on a target.


function display() {
    let liTag = ``;
    for(let i = 0; i < tasksList.length; i++) {
        let checked = tasksList[i].checked;
        let pending = tasksList[i].pending;
        // add draggable attribute and id to the list items
        liTag += ` <li class="list ${pending ? "pending" : ""}" onclick="handleStatus(this)" draggable="true" id="item-${i}">
        <input type="checkbox" ${checked ? "checked" : ""}/>
        <span class="task d-flex">${tasksList[i].name}</span>
        <i class="fa-solid fa-trash text-danger" onclick="deleteTask(${i})"></i>
        </li>`;
    }
    todoLists.innerHTML = liTag;
    pendingNum.textContent = localStorage.getItem("pendingNum") || "no";
    if (tasksList.length > 0) {
        clearButton.style.pointerEvents = "auto";
        
    }else {
        clearButton.style.pointerEvents = "none";
    }
    // add event listeners to the list items and the list container
    let items = document.querySelectorAll(".list");
    for (let item of items) {
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragend", dragEnd);
    }
    todoLists.addEventListener("dragover", dragOver);
    todoLists.addEventListener("drop", drop);
    allTasks();
}


// array.find(function(currentValue, index Optional, arr Optional),thisValue Optional)
// function() Required. => A function to run for each array element.
// currentValue Required. => The value of the current element.

/* The find() method returns the value of the first element that passes a test.
The find() method executes a function for each array element.
The find() method returns undefined if no elements are found. */

function handleStatus(e) {
    const checkbox = e.querySelector("input");
    // console.log(checkbox)
    if (checkbox.checked) {
        checkbox.checked = false;
    } else {
        checkbox.checked = true;
    }
    e.classList.toggle("pending");
    if (tasksList.length > 0) {
        const taskText = e.querySelector(".task").textContent;
        // find the object in the tasksList array by the text
    const task = tasksList.find(function (t) {
        return t.name === taskText;
    });
    // console.log(task)
        // update the checked and pending properties of the task object
        if (tasksList.includes(task)) {
            task.checked = checkbox.checked;
            task.pending = e.classList.contains("pending");
        }
        // save the updated tasksList array in local storage
    localStorage.setItem("doList", JSON.stringify(tasksList));
    allTasks()
    }
}

// call this function while adding, deleting and checking-unchecking the task
function allTasks() {
    let tasks = document.querySelectorAll(".pending");
    // console.log(tasks);
    // Set the text content of a node:
    // element.textContent = text
    pendingNum.textContent = tasks.length === 0 ? "no" : tasks.length;
}


//deleting task while we click on the delete icon.
//parentElement property returns the parent element of the specified element
function deleteTask(index) {
    tasksList.splice(index, 1)
    localStorage.setItem("doList", JSON.stringify(tasksList));
    localStorage.setItem("pendingNum", tasksList.length);
    display();
    allTasks();
}

function deleteAll() {
    tasksList.splice(0, tasksList.length);
    localStorage.clear();
    display();
}


function dragStart(e) {
    // set the data type and value of the dragged data
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.style.opacity = 0.5;
}

function dragEnd(e) {
    e.target.style.opacity = 1;
}

function dragOver(e) {
    // prevent the default behavior of the drop target
    e.preventDefault();
}

function drop(e) {
    // prevent the default behavior of the drop target
    e.preventDefault();
    // get the data value of the dragged item
    let id = e.dataTransfer.getData("text/plain");
    // get the dragged and dropped elements
    let dragged = document.getElementById(id);
    let dropped = e.target;
    // check if the dropped element is a list item
    if (dropped.classList.contains("list")) {
        // get the index of the dragged and dropped items
        let draggedIndex = getIndex(dragged);
        let droppedIndex = getIndex(dropped);
        // swap the position of the items in the tasksList array
        swapItems(draggedIndex, droppedIndex);
        // update the local storage
        localStorage.setItem("doList", JSON.stringify(tasksList));
        // update the UI
        display();
    }
}

// define a helper function to get the index of an item
function getIndex(item) {
    // get the id of the item
    let id = item.id;
    // get the index from the id
    let index = id.split("-")[1];
    // return the index as a number
    return Number(index);
}

// define a helper function to swap the position of two items in an array
function swapItems(i, j) {
    // get the items at the given indexes
    let item1 = tasksList[i];
    let item2 = tasksList[j];
    // swap the items
    tasksList[i] = item2;
    tasksList[j] = item1;
}



//Event
inputField.addEventListener("keyup", (e) => {
    if (e.key === "Enter"){
        addTask();
    }
});

clearButton.addEventListener("click", function () {
    deleteAll();
});

inputField.addEventListener("keyup", function () {
    if(inputField.value.trim().length > 0) {
        addBtn.style.pointerEvents = "auto";
    }else {
        addBtn.style.pointerEvents = "none";
    }
});

addBtn.addEventListener("click", addTask);