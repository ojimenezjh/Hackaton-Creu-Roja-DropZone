
const login = document.querySelector('.formLogin');
const signup = document.querySelector('.formSignup');

window.onload = function () {
    // Load particles effect
    let clause = window.innerWidth < 768;
    config.particles.number.value = clause ? 80 : 150;
    
    particlesJS('particle', config);
    checkRememberLogin();
    displaySignup();
};

// Check login items, if user is signed it will be redirected to Drop Zone
function checkRememberLogin() {
    const localUserLoggedIn = localStorage.getItem('dropzoneLoggedIn');
    const sessionUserLoggedIn = sessionStorage.getItem('dropzoneLoggedIn');
    if (localUserLoggedIn) {
        sessionStorage.setItem('dropzoneLoggedIn', localUserLoggedIn);
        location.href = 'dropzone.html';
    } else if (sessionUserLoggedIn) {
        location.href = 'dropzone.html';
    }
};

function displaySignup() {
    login.style.display = 'none';
    signup.style.display = 'flex';
};

function displayLogin() {
    login.style.display = 'flex';
    signup.style.display = 'none';
};

/* This login set an item imitating a cookie or JWT usecase, if remember is checked
   it will be stored in local storage to maintain the login */
function signIn() {
    const remember = document.getElementById('logCheck').checked;
    const username = document.getElementById('userSignin').value;
    const password = document.getElementById('passwordSignin').value;
    const storedUsername = localStorage.getItem('dropzoneUsername');
    const storedPassword = localStorage.getItem('dropzonePassword');
    const decryptedStoredPassword = atob(storedPassword);

    if (password == decryptedStoredPassword && username == storedUsername) {
        if (remember) {
            localStorage.setItem('dropzoneLoggedIn', username);
        }
        sessionStorage.setItem('dropzoneLoggedIn', username);
        Swal.fire({
            icon: 'success',
            title: `Bienvenido ${username}. Inicio de sesión correcto`,
            showConfirmButton: false,
            heightAuto: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 1500
        }).then(setTimeout(() => {
            location.href = 'dropzone.html'
        }, 1500));

    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Usuario y/o contraseña incorrectos, vuelve a intentarlo',
            showConfirmButton: false,
            heightAuto: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 1500
        })
    }
    return false;
}

// This signup store the username and password encrypted in local storage imitating a external database
function signUp() {
    const username = document.getElementById('userSignup').value;
    const password = document.getElementById('passwordSignup').value;
    const passwordRepeat = document.getElementById('passwordSignupRepeat').value;
    if (password == passwordRepeat) {
        const encryptedPassword = btoa(password);
        localStorage.setItem('dropzoneUsername', username)
        localStorage.setItem('dropzonePassword', encryptedPassword);
        Swal.fire({
            icon: 'success',
            title: 'Te has registrado correctamente',
            showConfirmButton: false,
            heightAuto: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 1500
        }).then(displayLogin());
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Contraseña no coincide, vuelve a intentarlo',
            showConfirmButton: false,
            heightAuto: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 1500
        })
    }

}

