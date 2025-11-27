// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInput;


// Funções
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn);

    // Utilizando dados 
    if(done) {
        todo.classList.add("done");
    }

    if(save) {
        saveTodoLocal({text, done});
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
}

const toggleForm = () => {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

const updateTodo = (text) => {
    const Alltodo = document.querySelectorAll(".todo")

    Alltodo.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if(todoTitle.innerText === oldInput){
            todoTitle.innerText = text;

            updateTodoLocal(oldInput, text);
        }
    })

}

const getSearch = (search) => {

    const todoList = document.querySelectorAll(".todo")

    todoList.forEach((todo) => {

    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

    const normalSearch = search.toLowerCase();

    todo.style.display = "flex";

    if(!todoTitle.includes(search)) {
        todo.style.display = "none"
    }
});
};

const filterList = (filterValue) => {
    const todoList = document.querySelectorAll(".todo")

    switch(filterValue) {
        case "all":
            todoList.forEach((todo) => (todo.style.display = "flex"));
            break;

        case "done":
        todoList.forEach((todo) => 
            todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none"));
            break;

        case "todo":
        todoList.forEach((todo) => 
            !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none"));
            break;

        default:
            break;
    }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const inputValue = todoInput.value;

    if(inputValue){
        saveTodo(inputValue);
    }
})

document.addEventListener("click", (e) => {
    const targetElement = e.target;
    const parentElement = targetElement.closest("div");
    let todoTitle;

    if(parentElement && parentElement.querySelector("h3")) {
        todoTitle = parentElement.querySelector("h3").innerText;
    }

    if(targetElement.classList.contains("finish-todo")){
        parentElement.classList.toggle("done");

        updateTodoStatusLocal(todoTitle);
    }

    if(targetElement.classList.contains("remove-todo")){
        parentElement.remove();

        removeTodoLocal(todoTitle);
    }
    if(targetElement.classList.contains("edit-todo")){
        toggleForm();

        editInput.value = todoTitle;
        oldInput = todoTitle;
    }
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();

    toggleForm();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editInputValue = editInput.value

    if(editInputValue){
        updateTodo(editInputValue);
    }

    toggleForm();
});

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;

    getSearch(search);
});

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;

    filterList(filterValue);
});

// Local Storage
const getTodosLocal = () => {
    const todo = JSON.parse(localStorage.getItem("todos")) || [];

    return todo;
};

const loadTodo = () => {
    const todos = getTodosLocal();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0);
    });
};

const saveTodoLocal = (todo) => {

    const todoList = getTodosLocal();

    todoList.push(todo);

    localStorage.setItem("todos", JSON.stringify(todoList));

};

const removeTodoLocal = (todoText) => {
    const todoList = getTodosLocal();

    const filterTodo = todoList.filter((todo) => todo.text !== todoText);

    localStorage.setItem("todos", JSON.stringify(filterTodo));
};

const updateTodoStatusLocal = (todoText) => {
    const todoList = getTodosLocal();

    todoList.map((todo) => todo.text === todoText ? todo.done = !todo.done : null);

    localStorage.setItem("todos", JSON.stringify(todoList));
};

const updateTodoLocal = (todoOldText, todoNewText) => {
    const todoList = getTodosLocal();

    todoList.map((todo) => todo.text === todoOldText ? (todo.text = todoNewText): null);

    localStorage.setItem("todos", JSON.stringify(todoList));
};

loadTodo();