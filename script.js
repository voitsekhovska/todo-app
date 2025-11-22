"use strict";

const toggle = document.querySelector(".toggle-btn");
const newTaskForm = document.querySelector(".new-task-field");
const newTaskInput = document.querySelector(".new-todo-input");
const todoList = document.querySelector(".list");

// changing theme
const toggleTheme = () => {
  document.body.classList.toggle("dark");
  return;
};

// submit the form
const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newInputText = newTaskInput.value.trim();
  if (!newInputText) {
    return;
  }

  addItemToDOM(newInputText);
};

const addItemToDOM = (text) => {
  const li = document.createElement("li");
  li.classList.add("todo-item");

  const id = "todo-" + Date.now();

  const input = createCheckbox(id);
  const label = createLabel(id, text);
  const img = createImage();

  li.appendChild(input);
  li.appendChild(label);
  li.appendChild(img);

  todoList.appendChild(li);

  checkUI();
};

// checkbox
const createCheckbox = (id) => {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = id;
  input.classList.add("todo-checkbox");

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

  return img;
};

const checkUI = () => {
  newTaskInput.value = "";

  const todoTasks = todoList.querySelectorAll("li");
  const todoField = document.querySelector(".todo-list-field");
  const todoFieldMobile = document.querySelector(".todo-filter-mobile");
  const alert = document.querySelector(".alert-msg");

  if (todoTasks.length === 0) {
    todoField.style.display = "none";
    todoFieldMobile.classList.add("hidden");
    alert.style.display = "block";
  } else {
    todoField.style.display = "flex";
    todoFieldMobile.classList.remove("hidden");
    alert.style.display = "none";
  }
};

// initialization
const init = () => {
  toggle.addEventListener("click", toggleTheme);
  newTaskForm.addEventListener("submit", onAddItemSubmit);

  checkUI();
};

init();
