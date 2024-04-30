function createTodoElement(todo) {
  const todoElement = document.createElement('li');
  todoElement.classList.add('todo-item', 'flex', 'items-center', 'p-4', 'rounded-md', 'mb-4', 'bg-white', 'shadow-md');
  todoElement.id = todo.id;
  todoElement.innerHTML = `
    <input type="checkbox" class="todo-checkbox h-5 w-5 mr-4" ${todo.completed ? 'checked' : ''}>
    <span class="${todo.completed ? 'line-through text-gray-400' : 'text-black'}">${todo.text}</span>
    <span class="ml-auto text-gray-500">${todo.date}</span>
    <button class="delete-btn ml-4 text-red-500">Delete</button>
  `;
  todoList.appendChild(todoElement);
}

// Get elements
const todoList = document.querySelector('.todo-list');
const todoInput = document.querySelector('.todo-input');
const addBtn = document.querySelector('.add-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedButton = document.querySelector('.clear-completed-btn');

// Event listeners
document.addEventListener('DOMContentLoaded', getTodos);
addBtn.addEventListener('click', addTodo);
todoList.addEventListener('click', toggleTodo);
filterButtons.forEach(button => button.addEventListener('click', filterTodos));
clearCompletedButton.addEventListener('click', clearCompletedTodos);

// Functions
function addTodo() {
  const text = todoInput.value.trim();
  if (text !== '') {
    const todo = {
      id: Date.now(),
      text,
      completed: false,
    };
    saveTodoToLocalStorage(todo);
    createTodoElement(todo);
    todoInput.value = '';
  }
}

function createTodoElement(todo) {
  const todoElement = document.createElement('li');
  todoElement.classList.add('todo-item', 'flex', 'items-center', 'p-4', 'rounded-md', 'mb-4', 'bg-white', 'shadow-md');
  todoElement.id = todo.id;
  todoElement.innerHTML = `
    <input type="checkbox" class="todo-checkbox h-5 w-5 mr-4" ${todo.completed ? 'checked' : ''}>
    <span class="${todo.completed ? 'line-through text-gray-400' : 'text-black'}">${todo.text}</span>
    <button class="delete-btn ml-auto text-red-500">Delete</button>
  `;
  todoList.appendChild(todoElement);
}

function toggleTodo(event) {
  const targetElement = event.target;
  if (targetElement.classList.contains('todo-checkbox')) {
    const todoItem = targetElement.closest('.todo-item');
    const todoId = parseInt(todoItem.id);
    const todos = getTodosFromLocalStorage();
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    todos[todoIndex].completed = !todos[todoIndex].completed;
    saveTodosToLocalStorage(todos);
    updateTodoElement(todoItem, todos[todoIndex]);
  } else if (targetElement.classList.contains('delete-btn')) {
    const todoItem = targetElement.closest('.todo-item');
    const todoId = parseInt(todoItem.id);
    removeTodoFromLocalStorage(todoId);
    todoItem.remove();
  }
}

function updateTodoElement(todoElement, todo) {
  todoElement.querySelector('.todo-checkbox').checked = todo.completed;
  const todoText = todoElement.querySelector('span');
  todoText.textContent = todo.text;
  todoText.classList.toggle('line-through', todo.completed);
}

function filterTodos(event) {
  const filter = event.target.dataset.filter;
  const todos = getTodosFromLocalStorage();
  todoList.innerHTML = '';
  if (filter === 'active') {
    todos.filter(todo => !todo.completed).forEach(createTodoElement);
  } else if (filter === 'completed') {
    todos.filter(todo => todo.completed).forEach(createTodoElement);
  } else {
    todos.forEach(createTodoElement);
  }
}

function clearCompletedTodos() {
  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.filter(todo => !todo.completed);
  saveTodosToLocalStorage(updatedTodos);
  filterTodos({ target: { dataset: { filter: 'all' } } });
}

function saveTodoToLocalStorage(todo) {
  const todos = getTodosFromLocalStorage();
  todos.push(todo);
  saveTodosToLocalStorage(todos);
}

function getTodosFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}

function saveTodosToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function removeTodoFromLocalStorage(todoId) {
  const todos = getTodosFromLocalStorage();
  const updatedTodos = todos.filter(todo => todo.id !== todoId);
  saveTodosToLocalStorage(updatedTodos);
}

function getTodos() {
  const todos = getTodosFromLocalStorage();
  todos.forEach(createTodoElement);
}
