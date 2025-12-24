const loginForm = document.querySelector('.login-form');
const usernameInput = document.getElementById('login-username');

function handleLogin(event) {
    event.preventDefault();

    const username = usernameInput.value.trim();

    if (!username) {
        usernameInput.classList.add('input-error');
        usernameInput.focus();
        return;
    }
    usernameInput.classList.remove('input-error');

    localStorage.setItem('td_user', username);

    window.location.href = "bienvenida.html";
    }

loginForm.addEventListener('submit', handleLogin);

usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim()) {
        usernameInput.classList.remove('input-error');
    }
});