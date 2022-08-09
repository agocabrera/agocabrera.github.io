document.getElementById('submit').addEventListener('click', function () {
    if ((document.getElementById('email').value != '') && (document.getElementById('password').value != '')) {
        window.location.href = 'inicio.html';
    } else {
        document.getElementById('login-error').innerHTML = 'Los campos de email y contraseña no pueden estar vacíos.';
    };
}, false);