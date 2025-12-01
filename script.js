"use strict";

const toggle = document.querySelector(".toggle-btn");
const newTaskForm = document.querySelector(".new-task-field");
const newTaskInput = document.querySelector(".new-todo-input");
const todoList = document.querySelector(".list");
const stats = document.querySelector(".todo-stats");
const clearBtn = document.querySelector(".clear-btn");
const filterDesktop = document.querySelector(".todo-filter");
const filterMobile = document.querySelector(".todo-filter-mobile");
const todoField = document.querySelector(".todo-list-field");
const todoFieldMobile = document.querySelector(".todo-filter-mobile");
const alert = document.querySelector(".alert-msg");

// changing theme
const toggleTheme = () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

const loadTheme = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
};

const displayTodos = () => {
  todoList.innerHTML = "";

  const todos = getTodosFromStorage();

  todos.forEach((todo) => addItemToDOM(todo));

  checkUI();
};

// submit the form
const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newInputText = newTaskInput.value.trim();
  if (!newInputText) {
    return;
  }

  const id = "todo-" + Date.now();

  addItemToDOM({ id, text: newInputText, completed: false });
  addTodosToStorage(newInputText, id);
};

const addItemToDOM = (todo) => {
  const li = document.createElement("li");
  li.classList.add("todo-item");

  const todoObj =
    typeof todo === "string"
      ? { id: "todo-" + Date.now(), text: todo, completed: false }
      : todo;

  li.dataset.id = todoObj.id;

  const input = createCheckbox(todoObj);
  const label = createLabel(todoObj.id, todoObj.text);
  const img = createImage();

  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(img);

  todoList.appendChild(li);

  checkUI();
};

// checkbox
const createCheckbox = (todo) => {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = todo.id;
  input.classList.add("todo-checkbox");
  input.checked = todo.completed;

  input.addEventListener("change", () => {
    updateTodoStatus(todo.id, input.checked);
    todosLeft();
  });

  return input;
};

const createLabel = (id, text) => {
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.textContent = text;

  return label;
};

const createImage = () => {
  const img = document.createElement("img");
  img.src = "./images/icon-cross.svg";
  img.alt = "Delete";
  img.classList.add("delete-btn");

  return img;
};

// deleting items
const removeTodo = (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const li = e.target.closest("li");
  const id = li.dataset.id;

  li.remove();
  removeTodosFromStorage(id);

  checkUI();
};

// clearing items
const clearList = () => {
  const completedTodos = todoList.querySelectorAll(
    "input[type='checkbox']:checked"
  );
  completedTodos.forEach((todo) => {
    todo.closest("li").remove();
  });

  clearCompletedFromStorage();
  checkUI();
};

// updating quantity
const todosLeft = () => {
  const todoQuantity = stats.querySelector("span");
  const activeTodos = todoList.querySelectorAll(
    "input[type='checkbox']:not(:checked)"
  );

  todoQuantity.textContent = activeTodos.length;
};

// filters
const filterTodo = (filter) => {
  const items = todoList.querySelectorAll("li");

  items.forEach((item) => {
    const checkbox = item.querySelector("input[type='checkbox']");

    const shouldShow =
      filter === "all" ||
      (filter === "active" && !checkbox.checked) ||
      (filter === "completed" && checkbox.checked);

    item.style.display = shouldShow ? "flex" : "none";
  });
};

// active button style helper
const applyActiveStyle = (wrapper, filter) => {
  const buttons = wrapper.querySelectorAll("button");

  buttons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.textContent.toLowerCase() === filter
    );
  });
};

const handleFilter = (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const filter = e.target.textContent.toLowerCase();

  filterTodo(filter);

  [filterDesktop, filterMobile].forEach((el) => {
    applyActiveStyle(el, filter);
  });
};

// storage

const getTodosFromStorage = () => {
  const data = localStorage.getItem("todos");

  return data ? JSON.parse(data) : [];
};

const saveTodosHelper = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const addTodosToStorage = (text, id) => {
  const todos = getTodosFromStorage();

  todos.push({ id, text, completed: false });

  saveTodosHelper(todos);
};

const removeTodosFromStorage = (id) => {
  const todos = getTodosFromStorage();

  const updated = todos.filter((todo) => todo.id !== id);

  saveTodosHelper(updated);
};

const clearCompletedFromStorage = () => {
  const todos = getTodosFromStorage();

  const updated = todos.filter((todo) => !todo.completed);

  saveTodosHelper(updated);
};

const updateTodoStatus = (id, completed) => {
  const todos = getTodosFromStorage();

  const updated = todos.map((todo) =>
    todo.id === id ? { ...todo, completed } : todo
  );

  saveTodosHelper(updated);
};

const checkUI = () => {
  newTaskInput.value = "";

  const todoTasks = todoList.querySelectorAll("li").length;

  if (todoTasks === 0) {
    todoField.style.display = "none";
    todoFieldMobile.classList.add("hidden");
    alert.style.display = "block";
  } else {
    todoField.style.display = "flex";
    todoFieldMobile.classList.remove("hidden");
    alert.style.display = "none";
  }

  todosLeft();
};

// initialization
const init = () => {
  loadTheme();

  toggle.addEventListener("click", toggleTheme);
  newTaskForm.addEventListener("submit", onAddItemSubmit);
  todoList.addEventListener("click", removeTodo);
  todoList.addEventListener("change", todosLeft);
  clearBtn.addEventListener("click", clearList);
  filterDesktop.addEventListener("click", handleFilter);
  filterMobile.addEventListener("click", handleFilter);

  checkUI();
};

init();
displayTodos();
