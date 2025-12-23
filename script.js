// ------ Elementos ------
const userNameEl = document.getElementById('userName');
const changeNameBtn = document.getElementById('changeNameBtn');
const userLevelEl = document.getElementById('userLevel');
const userExpEl = document.getElementById('userExp');
const expToLevelEl = document.getElementById('expToLevel');
const expFillEl = document.getElementById('expFill');
const taskInputEl = document.getElementById('taskInput');
const expInputEl = document.getElementById('expInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskListEl = document.getElementById('taskList');
const bonusExpEl = document.getElementById('bonusExp');
const bonusExpValueEl = document.getElementById('bonusExpValue');

// ------ Estado -------
let user = {
    name: 'default',
    level: 1,
    exp: 0,
    expToLevel: 100
};
let tasks = [];
let bonusExp = 20;

// ------ Funciones UI -------
function renderUser() {
    userNameEl.textContent = user.name;
    userLevelEl.textContent = user.level;
    userExpEl.textContent = user.exp;
    expToLevelEl.textContent = user.expToLevel;
    // Exp bar % (entre 0 y 100)
    let percent = Math.min(100, Math.floor((user.exp / user.expToLevel) * 100));
    expFillEl.style.width = percent + '%';
}

function renderTasks() {
    taskListEl.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const left = document.createElement('span');
        left.className = 'task-left';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = !!task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompleted(idx));

        const text = document.createElement('span');
        text.textContent = task.text;

        left.appendChild(checkbox);
        left.appendChild(text);

        const exp = document.createElement('span');
        exp.className = 'task-exp';
        exp.textContent = `+${task.exp} XP`;

        li.appendChild(left);
        li.appendChild(exp);

        taskListEl.appendChild(li);
    });
    renderBonus();
}

function renderBonus() {
  // Mostrar bonus solo si todas están completadas y hay por lo menos una tarea
    if (tasks.length > 0 && tasks.every(t => t.completed)) {
        bonusExpEl.style.display = 'block';
        bonusExpValueEl.textContent = `+${bonusExp}`;
    } else {
        bonusExpEl.style.display = 'none';
    }
}

// ------ Lógica de tareas ------
function addTask() {
    const text = taskInputEl.value.trim();
    let exp = parseInt(expInputEl.value);
    if (!text || isNaN(exp) || exp < 1) return;

    tasks.push({
        text,
        exp,
        completed: false
    });
    taskInputEl.value = '';
    expInputEl.value = 10;
    renderTasks();
}

function toggleTaskCompleted(idx) {
    const task = tasks[idx];
    task.completed = !task.completed;

    if (task.completed) {
        addExp(task.exp);
    } else {
        // Si desmarca, quita exp (pero no baja de 0)
        user.exp = Math.max(user.exp - task.exp, 0);
    }
    renderUser();

    // Si completó todas en este cambio...
    if (tasks.length > 0 && tasks.every(t => t.completed) && task.completed) {
        addExp(bonusExp);
        renderUser();
    }
    renderTasks();
}

function addExp(amount) {
    user.exp += amount;
    // Subir nivel si corresponde
    while (user.exp >= user.expToLevel) {
        user.exp -= user.expToLevel;
        user.level += 1;
        user.expToLevel = calcExpToNext(user.level);
        // Aquí podrías mostrar una animación/mensaje de "subiste de nivel"
    }
}

// Simple curva de experiencia (puedes modificarla)
function calcExpToNext(level) {
  return 100 + (level - 1) * 30;
}

// ------ Lógica de usuario ------
function changeUsername() {
    const nuevo = prompt('Ingresa tu nuevo nombre:', user.name);
    if (nuevo && nuevo.trim()) {
        user.name = nuevo.trim();
        renderUser();
    }
}

// ------ Eventos ------
addTaskBtn.addEventListener('click', addTask);
taskInputEl.addEventListener('keydown', e => {
    // Enter para agregar
    if (e.key === 'Enter') addTask();
});
changeNameBtn.addEventListener('click', changeUsername);

// ------ Inicialización ------
renderUser();
renderTasks();