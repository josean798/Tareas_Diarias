const username = localStorage.getItem('td_user');
if (!username) {
    window.location.href = "login.html";
}

document.getElementById('welcomeTitle').innerText = `Bienvenido ${username}`;

const tareasInputsContainer = document.getElementById('tareasInputsContainer');
const addTareaBtn = document.getElementById('addTareaBtn');
const tareasForm = document.getElementById('tareasForm');

function crearTareaRow(valor = '', imp = 1) {
    const row = document.createElement('div');
    row.className = 'tarea-input-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'tarea-input';
    input.placeholder = 'Descripción de la tarea';
    input.maxLength = 40;
    input.required = true;
    input.value = valor;

    const select = document.createElement('select');
    select.className = 'importancia-input';
    [1,2,3].forEach(i => {
        const option = document.createElement('option');
        option.value = i;
        option.innerText = `Importancia ${i}`;
        if (i === imp) option.selected = true;
        select.appendChild(option);
    });

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quitar-tarea-btn';
    btn.title = 'Quitar tarea';
    btn.innerHTML = '&times;';
    btn.onclick = () => {
        if (tareasInputsContainer.childElementCount > 1) {
        tareasInputsContainer.removeChild(row);
        }
    };

    row.appendChild(input);
    row.appendChild(select);
    row.appendChild(btn);

    return row;
}

addTareaBtn.addEventListener('click', () => {
    tareasInputsContainer.appendChild(crearTareaRow());
});


tareasForm.addEventListener('submit', e => {
    e.preventDefault();

    const tareasArr = [];
    for (const row of tareasInputsContainer.children) {
        const desc = row.querySelector('.tarea-input').value.trim();
        const imp = parseInt(row.querySelector('.importancia-input').value);
        if (desc) {
        let exp = 10;
        if (imp === 2) exp = 15;
        if (imp === 3) exp = 20;
        tareasArr.push({ desc, importancia: imp, exp, completada: false });
        }
    }

    if (!tareasArr.length) return;

    localStorage.setItem('td_tareas', JSON.stringify(tareasArr));

    window.location.href = "dia.html"; // Pagina dia, posible cambio a index.html para unificacion
});

if (!tareasInputsContainer.hasChildNodes()) {
    tareasInputsContainer.appendChild(crearTareaRow());
}