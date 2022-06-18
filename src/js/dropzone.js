let dropArea;
let addedFile;
let googleToken;

// Restart svg's animation from beggining everytime window is resized
window.onresize = function () {
    $('img').stop(true).css({ top: '50%', left: '50%' });
    moveAllSvg();
};

window.onload = function () {
    checkLogin();
    moveAllSvg();
    dragDropArea();
};

// Events for capturing the file
function dragDropArea() {
    dropArea = document.querySelector('.dropzone');
    clickArea = document.getElementById('dropzoneClick');
    dropArea.onclick = function(){clickArea.click()};

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.target.classList.add('over');
    });

    dropArea.addEventListener('dragleave', (e) => {
        e.target.classList.remove('over');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.target.classList.remove('over');
        addFile(e);
    });

    clickArea.addEventListener('change', (e) => {
        e.preventDefault();
        addFile(e);
    });
};


function addFile(e){
    if (e.type == 'change') {
        addedFile = e.target.files[0];
    } else {
        addedFile = e.dataTransfer.files[0];
    }
    let fileReader = new FileReader();
    fileReader.onload = (result) => {
        console.log(addedFile, result);
        document.getElementsByTagName('h1')[0].innerHTML = `Archivo ${addedFile.name} listo para subir`;
    }
    fileReader.readAsDataURL(addedFile);
}

function colorPicking() {
    const colorPicked = $('#colorpicker').val();
    $('.dropzone').css('box-shadow', `0 0 60px ${colorPicked}`);
};

// Check if user is logged getting login items from storage, otherwise it will redirect to login page
function checkLogin() {
    const localUserLoggedIn = localStorage.getItem('dropzoneLoggedIn');
    const sessionUserLoggedIn = sessionStorage.getItem('dropzoneLoggedIn');

    if (!sessionUserLoggedIn && !localUserLoggedIn) {
        document.getElementsByTagName('body')[0].innerHTML = '<h1>Inicia sesión para ver el contenido, serás redireccionado en 3 segundos</h1>';
        setTimeout(() => {
            location.href = 'index.html';
        }, 3000);
    } else if (localUserLoggedIn)
        document.getElementById('dropzoneTitle').innerHTML += ' ' + localUserLoggedIn;
    else
        document.getElementById('dropzoneTitle').innerHTML += ' ' + sessionUserLoggedIn;
}

function logOut() {
    localStorage.removeItem('dropzoneLoggedIn');
    sessionStorage.removeItem('dropzoneLoggedIn');
    location.href = "index.html";
}

function moveAllSvg() {
    moveSvg('#svg1');
    moveSvg('#svg2');
    moveSvg('#svg3');
    moveSvg('#svg4');
    moveSvg('#svg5');
    moveSvg('#svg6');
    moveSvg('#svg7');
    moveSvg('#svg8');
    moveSvg('#svg9');
    moveSvg('#svg10');
}

// Create random moving animation and colors for Drop Zone svg's
function moveSvg(svg) {
    let svgMove = $(svg);

    let h = $(".dropzone").height() - svgMove.height();
    let w = $(".dropzone").width() - svgMove.width();

    let nh = Math.floor(Math.random() * h);
    let nw = Math.floor(Math.random() * w);
    let randomColor = Math.floor(Math.random()*16777215).toString(16);

    svgMove.css({filter: `drop-shadow(0 0 0 #${randomColor})`});
    svgMove.animate({ top: nh, left: nw }, 2500, function () {
        moveSvg(svg);
    });
};

function googleLoginPopup() {
    Swal.fire({
        title: 'Pulsa para iniciar sesión con Google',
        html: `<div style="display: flex; justify-content:center; width:100%;">
        <div id="googleButton"></div></div>`,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: `Cancelar`,
    })
    googleLogin();
}

// Render the google signin button inside a popup, client_id is provided by google cloud platform
function googleLogin() {
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "large", width: "1000px" }  // customization attributes
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
};

// Get google user info from success login into google account
function handleCredentialResponse(response) {
    swal.close();

    googleToken = response.credential;
    const responsePayload = parseJwt(googleToken);

   /*  console.log(responsePayload);
    console.log("ID: " + responsePayload.sub);
    console.log('Full Name: ' + responsePayload.name);
    console.log('Given Name: ' + responsePayload.given_name);
    console.log('Family Name: ' + responsePayload.family_name);
    console.log("Image URL: " + responsePayload.picture);
    console.log("Email: " + responsePayload.email); */

    document.getElementById('googleEmail').innerHTML = responsePayload.email;
    document.getElementById('googleImg').src = responsePayload.picture;
    document.getElementById('googleButtonPopup').style.display = 'none'
    document.querySelector('.googleUserContainer').style.display = 'flex'

    Swal.fire({
        icon: 'success',
        title: `Bienvenido ${responsePayload.name}. Inicio de sesión correcto`,
        showConfirmButton: false,
        heightAuto: false,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
        timer: 1500
    });
};

// Upload file to google drive providing the google user access token
function uploadFile() {
    var fileContent = addedFile; // As a sample, upload a text file.
    var file = new Blob([fileContent], { type: addedFile.type });
    var metadata = {
        'name': addedFile.name, // Filename at Google Drive
        'mimeType': addedFile.type, // mimeType at Google Drive
    };

    var form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    try {
        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + googleToken },
            body: form,
        }).then((response) => {
            if (response && response.status >= 200 && response.status < 300){
                document.getElementsByTagName('h1')[0].innerHTML = `Tu archivo ${addedFile.name} se ha subido correctamente`;
            } else{
               uploadFailPopup();
            }
            return response.json();
        }).then(function (val) {
            console.log('response',val);
        });
    } 
    catch (error) {
        console.log('error', error);
        uploadFailPopup();
    } 

   
};

function uploadFailPopup(){
    document.getElementsByTagName('h1')[0].style.display = 'none';
    Swal.fire({
        title: 'Ups, algo ha salido mal',
        text: 'No hemos podido subir tu archivo, revisa el formato o bien inténtalo de nuevo ',
        width: '80%',
        padding: '2em',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#4F934A',
        color: 'white',
        background: '#232730',
        target: '.dropzone',
        customClass: {
          title: 'errortitle',
          container: 'errorpopup',
          confirmButton: 'closepopup'
        },
        toast: true,
        position: 'center'
      }).then((result) => {
        if (result.isConfirmed){
            document.getElementsByTagName('h1')[0].style.display = 'inline';
        }
      });
}















