
const login = document.querySelector('.formLogin');
const signup = document.querySelector('.formSignup');
const remember = document.getElementById('logCheck');

window.onload = function () {
    // Load particles effect
    let clause = window.innerWidth < 768;
    config.particles.number.value = clause ? 80 : 150;

    particlesJS('particle', config);
    checkRememberLogin();
    displayLogin();
}

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
}

function displaySignup() {
    login.style.display = 'none';
    signup.style.display = 'flex';
}

function displayLogin() {
    googleLogin();
    login.style.display = 'flex';
    signup.style.display = 'none';
}

// Render the google signin button inside a popup, client_id is provided by google cloud platform
function googleLogin() {
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { size: "large", width: "280px", shape: "pill", theme: "filled_black" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
}

// Decrypt the JWT for extracting useful data
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Get google user info from success login into google account
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);
    /*  console.log(responsePayload);
     console.log("ID: " + responsePayload.sub);
     console.log('Full Name: ' + responsePayload.name);
     console.log('Given Name: ' + responsePayload.given_name);
     console.log('Family Name: ' + responsePayload.family_name);
     console.log("Image URL: " + responsePayload.picture);
     console.log("Email: " + responsePayload.email); */
    const username = responsePayload.name;
    if (remember.checked) {
        localStorage.setItem('dropzoneLoggedIn', username);
    }
    sessionStorage.setItem('dropzoneLoggedIn', username);
    successLogin(username);
}

/* This login set an item imitating a cookie or JWT usecase, if remember is checked
   it will be stored in local storage to maintain the login */
function signIn() {
    const username = document.getElementById('userSignin').value;
    const password = document.getElementById('passwordSignin').value;
    const storedUsername = localStorage.getItem('dropzoneUsername');
    const storedPassword = localStorage.getItem('dropzonePassword');
    const decryptedStoredPassword = atob(storedPassword);

    if (password == decryptedStoredPassword && username == storedUsername) {
        if (remember.checked) {
            localStorage.setItem('dropzoneLoggedIn', username);
        }
        sessionStorage.setItem('dropzoneLoggedIn', username);
        successLogin(username);
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

function successLogin(username) {
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

