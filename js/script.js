//INTERAÇÃO DO DIALOG
const dialog = document.querySelector(".dialog");
const newTaskButton = document.querySelectorAll(".add-task #add-task");
const closeDialog = document.querySelector(".dialog-button #cancelar");
const completedButton = document.querySelector(".dialog-button #finalizar");
const titleDialog = document.querySelector(".dialog-title h3");

//ABRIR E FECHAR O DIALOG
newTaskButton[0].addEventListener("click", () => {
  task = null;
  taskTitle.value = "";
  taskDescription.value = "";
  dialog.showModal();

  // Alterar o texto do botão
  addTask.innerHTML = "Salvar";
  // Ocultar o botão de conclusão
  completedButton.style.display = "none";
  titleDialog.innerHTML = "Nova tarefa";

  console.log(`"task: " ${task}`);
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
//VERIFICAR SE A TAREFA ESTÁ COMPLETADA E ALTERAR O LAYOUT
const updateTaskLayout = (taskItem, task) => {
  if (task.completed) {
    taskItem.classList.add("completed");
    taskItem.innerHTML = `
      <p>${task.title}</p>
      <i><i class="fa-solid fa-check"></i></i> `;
  } else {
    taskItem.innerHTML = `
      <p>${task.title}</p>
      <i><i class="fa-solid fa-trash-can"></i></i>`;
  }
};

//ADICIONAR/ATUALIZAR TAREFAS NO HTML
const tasksList = document.querySelector(".tasks-list-item .task-itens");
function renderTasks() {
  tasksList.innerHTML = "";
  //tasks é o array com as tarefas
  tasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    //VERIFICAR SE A TAREFA ESTÁ COMPLETADA E ALTERAR O LAYOUT
    updateTaskLayout(taskItem, task);

    tasksList.appendChild(taskItem);
  });
}
renderTasks();
//EVENTO DE ADICIONAR TAREFAS
addTask.addEventListener("click", () => {
  Verificar = 0;
  if (addTask.innerHTML === "Salvar") {
    //adicionar tarefa ao array
    updateTasks();
    //atualizar a lista
    renderTasks();
    //ATUALIZAR O PROGRESSO
    updateProgress();
  }
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

    //ATUALIZAR O PROGRESSO
    updateProgress();
  }
});
let task;
//DETALHES DA TAREFA
tasksList.addEventListener("click", (event) => {
  if (event.target.tagName === "P") {
    const taskItem = event.target.closest(".task-item");
    let taskIndex;
    // Verificar se há um termo de busca
    if (searchTask.value.trim() !== "" || Verificar === 1) {
      // Recuperar índice do atributo data-index (usado na busca filtrada)
      taskIndex = parseInt(taskItem.getAttribute("data-index"));
    } else {
      // Recuperar índice baseado no DOM (lista completa)
      taskIndex = Array.from(tasksList.children).indexOf(taskItem);
    }

    // Recuperar a tarefa pelo índice correto
    task = tasks[taskIndex];

    // Exibir detalhes da tarefa
    dialog.showModal();
    taskTitle.value = task.title;
    taskDescription.value = task.description;

    // Alterar o texto do botão
    addTask.innerHTML = "Alterar";
    // Exibir o botão de conclusão
    completedButton.style.display = "block";

    // Alterar o texto do botão
    completedButton.innerHTML = task.completed ? "Abrir" : "Concluir";

    titleDialog.innerHTML = "Editar tarefa";
  }
});

// EDITAR TAREFAS
addTask.addEventListener("click", () => {
  //atualiza variavel de verificação de busca tarefas concluidas e não concluidas
  Verificar = 0;
  if (addTask.innerHTML === "Alterar") {
    task.title = taskTitle.value;
    task.description = taskDescription.value;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    //atualizar a lista
    renderTasks();
    //fechar o dialog
    dialog.close();
  }
});

// MARCA TAREFAS COMPLETADAS
completedButton.addEventListener("click", () => {
  //atualiza variavel de verificação de busca tarefas concluidas e não concluidas
  Verificar = 0;

  task.completed = !task.completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));

  //atualizar a lista
  renderTasks();
  //fechar o dialog
  dialog.close();
  //ATUALIZAR O PROGRESSO
  updateProgress();
});

//BUSCAR TAREFAS
const searchTask = document.querySelector(".search-task input");

searchTask.addEventListener("input", () => {
  const searchTerm = searchTask.value.toLowerCase();

  // Recuperar tarefas do LocalStorage
  const storedTasks = localStorage.getItem("tasks");
  const tasks = storedTasks ? JSON.parse(storedTasks) : [];

  // Filtrar as tarefas no LocalStorage
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm)
  );

  // Renderizar as tarefas filtradas com base no ID original
  tasksList.innerHTML = "";
  filteredTasks.forEach((task) => {
    const originalIndex = tasks.indexOf(task); // Obter o índice real
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-index", originalIndex); // Atribuir o índice original como atributo

    updateTaskLayout(taskItem, task);
    tasksList.appendChild(taskItem);
  });
});

// Configuração dos círculos de progresso
const taskProgress = document.getElementById("task-progress");
const taskSummary = document.getElementById("task-summary");
const totalTask = document.querySelector("#total-tasks");
const completedTask = document.querySelector("#completed-tasks");
const pendenteTasks = document.querySelector("#pending-tasks");

// Atualiza o círculo de progresso e o resumo
const updateProgress = () => {
  // Recuperar tarefas do LocalStorage
  const storedTasks = localStorage.getItem("tasks");
  const tasks = storedTasks ? JSON.parse(storedTasks) : [];

  // Calcular total e concluídas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  // Calcular a porcentagem
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Atualizar o estilo do círculo
  taskProgress.style.background = `conic-gradient(#4caf50 ${percentage}%, #ccc ${percentage}%)`;
  taskProgress.querySelector("span").textContent = `${Math.round(percentage)}%`;

  // Atualizar o total de tarefas
  totalTask.innerHTML = totalTasks;

  // Atualizar o total de tarefas concluídas
  completedTask.innerHTML = completedTasks;

  // Atualizar o total de tarefas pendentes
  pendenteTasks.innerHTML = totalTasks - completedTasks;
};

// Inicializar o progresso ao carregar a página
updateProgress();

//atualiza variavel de verificação de busca tarefas concluidas e não concluidas
let Verificar = 0;
// FILTAR TODAS AS TAREFAS
totalTask.addEventListener("click", () => {
  //atualiza variavel de verificação de busca tarefas concluidas e não concluidas
  Verificar = 0;

  // Recuperar tarefas do LocalStorage
  renderTasks();
});

// FILTAR TAREFAS CONCLUIDAS
completedTask.addEventListener("click", () => {
  //atualiza variavel de verificação de busca tarefas concluidas e não concluidas
  Verificar = 1;
  // Recuperar tarefas do LocalStorage
  const storedTasks = localStorage.getItem("tasks");
  const tasks = storedTasks ? JSON.parse(storedTasks) : [];

  // Filtrar as tarefas concluídas
  const completedTasks = tasks.filter((task) => task.completed);

  // Renderizar as tarefas filtradas com base no índice original
  tasksList.innerHTML = "";
  completedTasks.forEach((task) => {
    const originalIndex = tasks.indexOf(task); // Obter o índice real
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-index", originalIndex); // Atribuir o índice original como atributo

    updateTaskLayout(taskItem, task);
    tasksList.appendChild(taskItem);
  });
});

// FILTAR TAREFAS PENDENTES
pendenteTasks.addEventListener("click", () => {
  //atualiza variavel de verificação de busca tarefas concluidas e não concluidas
  Verificar = 1;

  // Filtrar as tarefas pendentes
  const pendingTasks = tasks.filter((task) => !task.completed);

  // Renderizar as tarefas filtradas com base no ID original
  tasksList.innerHTML = "";
  pendingTasks.forEach((task) => {
    const originalIndex = tasks.indexOf(task); // Obter o índice real
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    taskItem.setAttribute("data-index", originalIndex); // Atribuir o índice original como atributo

    updateTaskLayout(taskItem, task);
    tasksList.appendChild(taskItem);
  });
});
