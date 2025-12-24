const INIT_DATA = {
    name: "",
    level: 1,
    exp: 0,
    expToLevel: 100,
};
const BONUS_EXP = 20;

let userData = JSON.parse(localStorage.getItem('td_user_data')) || { ...INIT_DATA };
const currentName = localStorage.getItem('td_user');

if (!currentName) {
    window.location.href = "login.html";
}
if (!userData.name) userData.name = currentName;

let tareas = [];
try {
    tareas = JSON.parse(localStorage.getItem('td_tareas')) || [];
} catch {
    tareas = [];
}

const userNameEl = document.getElementById('userName');
const userLevelEl = document.getElementById('userLevel');
const userExpEl = document.getElementById('userExp');
const expToLevelEl = document.getElementById('expToLevel');
const expFillEl = document.getElementById('expFill');
const taskListEl = document.getElementById('taskList');
const bonusExpEl = document.getElementById('bonusExp');
const bonusExpValueEl = document.getElementById('bonusExpValue');
const finalizarBtn = document.getElementById('finalizarBtn');
const resultadoDiaEl = document.getElementById('resultadoDia');

function renderUser() {
    userNameEl.textContent = userData.name;
    userLevelEl.textContent = userData.level;
    userExpEl.textContent = userData.exp;
    expToLevelEl.textContent = userData.expToLevel;

    let pct = Math.min(100, Math.floor((userData.exp / userData.expToLevel) * 100));
    expFillEl.style.width = pct + '%';
}

function renderTareas() {
    taskListEl.innerHTML = '';
    tareas.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completada ? ' checked' : '');
        const left = document.createElement('span');
        left.className = 'task-left';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.tabIndex = 0;
        checkbox.className = 'task-checkbox';
        checkbox.checked = !!task.completada;
        checkbox.disabled = finalizarBtn.disabled; 
        checkbox.addEventListener('change', () => {
            if (!finalizarBtn.disabled) {
                tareas[idx].completada = checkbox.checked;
                renderTareas();
                renderBonus();
            }
        });
        const text = document.createElement('span');
        text.textContent = task.desc;

        left.appendChild(checkbox);
        left.appendChild(text);

        const exp = document.createElement('span');
        exp.className = 'task-exp';
        exp.textContent = `+${task.exp} XP`;

        li.appendChild(left);
        li.appendChild(exp);

        if (task.completada) li.classList.add('checked');
        taskListEl.appendChild(li);
    });
    renderBonus();
}

function renderBonus() {
    const allDone = tareas.length > 0 && tareas.every(t => t.completada);
    bonusExpEl.style.display = allDone ? 'block' : 'none';
    bonusExpValueEl.textContent = `+${BONUS_EXP}`;
}

function finalizarDia() {
    finalizarBtn.disabled = true;
    renderTareas();

    let expGanada = 0;
    let allDone = tareas.length > 0 && tareas.every(t => t.completada);
    tareas.forEach(t => {
        if (t.completada) expGanada += t.exp;
    });
    if (allDone) expGanada += BONUS_EXP;

    addExp(expGanada);

    if (allDone) {
        resultadoDiaEl.textContent = `¡Excelente! Completa todas las tareas y obtuviste un bonus de ${BONUS_EXP} XP.`;
    } else {
        resultadoDiaEl.textContent = `Has completado ${tareas.filter(t => t.completada).length} de ${tareas.length} tareas. ¡Sigue esforzándote!`;
    }
    localStorage.removeItem('td_tareas');
}

function addExp(cant) {
    if (!cant || cant <= 0) return;
    userData.exp += cant;

    while (userData.exp >= userData.expToLevel) {
        userData.exp -= userData.expToLevel;
        userData.level += 1;
        userData.expToLevel = calcExpToNext(userData.level);
    }

    localStorage.setItem('td_user_data', JSON.stringify(userData));
    renderUser();
}

function calcExpToNext(level) {
    return 100 + (level - 1) * 30;
}

finalizarBtn.addEventListener('click', finalizarDia);

renderUser();
renderTareas();