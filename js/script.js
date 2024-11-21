//INTERAÇÃO DO DIALOG
const dialog = document.querySelector(".dialog");
const newTaskButton = document.querySelectorAll(".add-task #add-task");
const closeDialog = document.querySelector(".dialog-button #cancelar");
const completedButton = document.querySelector(".dialog-button #finalizar");

//ABRIR E FECHAR O DIALOG
newTaskButton[0].addEventListener("click", () => {
  dialog.showModal();
});
//FECHAR O DIALOG
closeDialog.addEventListener("click", () => {
  dialog.close();
});

//ADICIONAR TAREFAS
const addTask = document.querySelector(".dialog-button #salvar");
const taskTitle = document.querySelector(".dialog-input input");
const taskDescription = document.querySelector(".dialog-input textarea");

//ADICIONAR TAREFAS NO ARRAY
const tasks = [];
function updateTasks() {
  const task = {
    title: taskTitle.value,
    description: taskDescription.value,
  };
  tasks.push(task);
  dialog.close();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

//RETORNAR TAREFAS DO LOCAL STORAGE
const storedTasks = localStorage.getItem("tasks");
if (storedTasks) {
  tasks.push(...JSON.parse(storedTasks));
}

//ADICIONAR/ATUALIZAR TAREFAS NO HTML
const tasksList = document.querySelector(".tasks-list-item .task-itens");
function renderTasks() {
  tasksList.innerHTML = "";
  //tasks é o array com as tarefas
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.innerHTML = `
      <p>${task.title}</p>
      <i><i class="fa-solid fa-trash-can"></i></i>
    `;
    tasksList.appendChild(taskItem);
  });
}
renderTasks();
//EVENTO DE ADICIONAR TAREFAS
addTask.addEventListener("click", () => {
  if (addTask.innerHTML === "Salvar") {
    //adicionar tarefa ao array
    updateTasks();
    //atualizar a lista
    renderTasks();
  }

  //console.log(tasks[2]);
});

//DELETAR TAREFAS
tasksList.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-trash-can")) {
    const taskItem = event.target.closest(".task-item");
    const taskIndex = Array.from(tasksList.children).indexOf(taskItem);
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    //atualizar a lista
    renderTasks();
  }
});

let task;
//DETALHES DA TAREFA
tasksList.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    const taskItem = event.target.closest(".task-item");
    const taskIndex = Array.from(tasksList.children).indexOf(taskItem);
    task = tasks[taskIndex];

    // Exibir detalhes da tarefa
    dialog.showModal();
    taskTitle.value = task.title;
    taskDescription.value = task.description;
  }
});

// Editar tarefa
addTask.innerHTML = "Alterar";

addTask.addEventListener("click", () => {
  task.title = taskTitle.value;
  task.description = taskDescription.value;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //atualizar a lista
  renderTasks();
  //fechar o dialog
  dialog.close();
});

// Marcar tarefa como concluida
completedButton.style.display = "block";

completedButton.addEventListener("click", () => {
  task.completed = !task.completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //atualizar a lista
  renderTasks();
  //fechar o dialog
  dialog.close();

  console.log(task);
});
