let addButton = document.querySelector(".add-button");
let todoInput = document.querySelector(".todo-input");
let addIcon = document.querySelector(".add-icon");
let inputContainer = document.querySelector(".input-container");
let contentContainer = document.querySelector(".content-container");
let icon1 = document.querySelector('.icon1');
let icon2 = document.querySelector('.icon2');
let closeIconForInput = document.querySelector(".input-container .close-icon");

let todos = []
let isDescending = true

icon1.addEventListener('click', toggleIcons)
icon2.addEventListener('click', toggleIcons)

closeIconForInput.addEventListener("click", (e) => {
    e.preventDefault()
    todoInput.value = ""
})

function toggleIcons() {
    icon1.classList.toggle('hidden')
    icon2.classList.toggle('hidden')
    isDescending = !isDescending
    sortTodos()
    renderTodos()
}

addIcon.addEventListener("click", (e) => {
    e.preventDefault()
    inputContainer.style.display = "flex"
});

addButton.addEventListener("click", (e) => {
    e.preventDefault()
    addTodo(todoInput.value)
    renderTodos()
});

function addTodo(content) {
    if (content) {
        todos.push(content)
        todoInput.value = ""
        inputContainer.style.display = "none"
        contentContainer.style.display = "block"
    } else {
        alert("Please enter a todo")
    }
}

function sortTodos() {
    if (isDescending) {
        todos.sort((a, b) => b.localeCompare(a))
    } else {
        todos.sort((a, b) => a.localeCompare(b))
    }
}

function renderTodos() {
    let todosList = document.querySelector(".todos-list")
    todosList.innerHTML = ""

    todos.forEach((todo, index) => {
        let li = document.createElement("li")
        li.setAttribute("draggable", "true")
        li.dataset.index = index

        if (todo.length >= 20) {
            li.innerHTML = `
            ${index + 1} ${todo.slice(0, 20) + '...'}
            <svg class="close-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#C4C4C4" />
            <path d="M6 6L14 14" stroke="#C4C4C4" />
            <path d="M6 14L14 6" stroke="#C4C4C4" />
            </svg>
            `
        }
        else {
            li.innerHTML = `
            ${index + 1} ${todo}
            <svg class="close-icon" width="20" height="20" viewBox="0 0 20 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#C4C4C4" />
            <path d="M6 6L14 14" stroke="#C4C4C4" />
            <path d="M6 14L14 6" stroke="#C4C4C4" />
            </svg>
            `
        }

        li.querySelector(".close-icon").addEventListener("click", () => {
            deleteTodo(index)
        })


        li.addEventListener("dragstart", handleDragStart)
        li.addEventListener("dragover", handleDragOver)
        li.addEventListener("drop", handleDrop)

        todosList.appendChild(li)
    })
}

function deleteTodo(index) {
    todos.splice(index, 1)
    renderTodos()
}

let draggedIndex = null

function handleDragStart(event) {
    draggedIndex = event.target.dataset.index
    event.dataTransfer.effectAllowed = "move"
    event.target.style.opacity = "0.5"
}

function handleDragOver(event) {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
}

function handleDrop(event) {
    event.preventDefault()
    event.target.style.opacity = "1"

    const droppedIndex = event.target.dataset.index;
    if (draggedIndex !== null && draggedIndex !== droppedIndex) {
        const temp = todos[draggedIndex]
        todos[draggedIndex] = todos[droppedIndex]
        todos[droppedIndex] = temp

        renderTodos()
    }
}
