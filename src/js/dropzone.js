let dropArea;
let clickArea;
let addedFile;
let filesArray = [];
let googleToken;
let client;

// Restart svg's animation from beggining everytime window is resized
window.onresize = function () {
    $('img').stop(true).css({ top: '50%', left: '50%' });
    moveAllSvg();
}

window.onload = function () {
    checkLogin();
    moveAllSvg();
    dragDropArea();
}

// Events for capturing the file
function dragDropArea() {
    dropArea = document.querySelector('.dropzone');
    clickArea = document.getElementById('dropzoneClick');
    dropArea.ondblclick = function () { clickArea.click() }

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
        clickArea.value = null;
    });
}

function addFile(e) {
    if (e.type == 'change' && e.target.files[0]) {
        addedFile = e.target.files[0];
        filesArray.push(addedFile);
    } else {
        addedFile = e.dataTransfer.files[0];
        filesArray.push(addedFile);
    }
    let fileReader = new FileReader();
    fileReader.onload = (result) => {
        // Pastel colors
        let randomColor = "hsl(" + 360 * Math.random() + ',' +
            (25 + 70 * Math.random()) + '%,' +
            (85 + 10 * Math.random()) + '%)'
        console.log(randomColor);
        console.log(filesArray, result);
        document.getElementsByTagName('h1')[0].innerHTML = `Archivo \n <span style="color: cyan">${addedFile.name}</span> \n listo para subir`;
        document.getElementById('filesList').innerHTML += `<li id=listobject${filesArray.length - 1}>Archivo <span style="color: ${randomColor}">${addedFile.name}</span></li>`;

    }
    fileReader.readAsDataURL(addedFile);
}

function colorPicking() {
    const colorPicked = $('#colorpicker').val();
    $('.dropzone').css('box-shadow', `0 0 60px ${colorPicked}`);
}

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
        document.getElementById('dropzoneTitle').innerHTML += `<span style="color: cyan">\n${localUserLoggedIn}</span>`;
    else
        document.getElementById('dropzoneTitle').innerHTML += `<span style="color: cyan">\n${sessionUserLoggedIn}</span>`;
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
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);

    svgMove.css({ filter: `drop-shadow(0 0 0 #${randomColor})` });
    svgMove.animate({ top: nh, left: nw }, 2500, function () {
        moveSvg(svg);
    });
}

// Render the google signin button inside a popup, client_id is provided by google cloud platform
function googleLogin() {
    client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive',
        callback: handleCredentialResponse
    }).requestAccessToken();
}

// Get google drive access from success login into google account
function handleCredentialResponse(response) {
    swal.close();

    googleToken = response.access_token;

    document.getElementById('googleAccess').innerHTML = 'Acceso garantizado a tu Google drive';
    document.getElementById('googleButtonPopup').style.display = 'none';
    document.querySelector('.googleAccessContainer').style.display = 'flex';

    Swal.fire({
        icon: 'success',
        title: `Autorizado el acceso a google drive. Inicio de sesión correcto`,
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
}

// Upload files to google drive providing the google user access token
async function uploadFiles() {
    if (filesArray.length > 0 && googleToken) {

        document.getElementById('filesList').innerHTML = '';
        document.getElementsByTagName('h1')[0].innerHTML = '';
        Swal.fire({
            title: 'Subiendo archivos...',
            showConfirmButton: false,
            allowOutsideClick: false,
            color: '#FFFFFF',
            background: 'transparent',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            didOpen: () => {
                Swal.showLoading()
            },
        });
        try {
            let allFilesUploaded = false;
            let uploadFail = true;
            for (let index = 0; index < filesArray.length; index++) {

                let fileContent = filesArray[index];
                let file = new Blob([fileContent], { type: fileContent.type });
                let metadata = {
                    'name': fileContent.name, // Filename at Google Drive
                    'mimeType': fileContent.type, // mimeType at Google Drive
                }

                let form = new FormData();
                form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                form.append('file', file);

                try {
                    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                        method: 'POST',
                        headers: { 'Authorization': 'Bearer ' + googleToken },
                        body: form,
                    }).then((response) => {
                        return response.json();
                    }).then(function (response) {
                        console.log(response);
                        if (response.kind == 'drive#file') {
                            uploadFail = false;
                            if (index == filesArray.length - 1) {
                                allFilesUploaded = true;
                            }
                        }
                    }).then(() => {
                        if (allFilesUploaded && uploadFail == false) {
                            document.getElementsByTagName('h1')[0].innerHTML = `<span style="color: #63e036">Tus archivos se han subido correctamente</span>`;
                            Swal.close();
                            setTimeout(() => {
                                resetFiles();
                            }, 1500);
                        }
                    });
                    if (uploadFail == true) {
                        throw 'fail uploading';
                    }
                } catch (error) {
                    throw 'fail uploading';
                }
            }
        }
        catch (error) {
            console.log('error', error);
            uploadFailPopup();
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: `Debes adjuntar un archivo e iniciar sesión en google para continuar con el envío`,
            showConfirmButton: false,
            heightAuto: false,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 3000
        });
    }
}

function resetFiles() {
    addedFile = '';
    filesArray = [];
    document.getElementsByTagName('h1')[0].innerHTML = 'ARRASTRA TUS ARCHIVOS AQUÍ O HAZ DOBLE CLICK PARA SELECCIONARLOS';
    Swal.fire({
        icon: 'info',
        title: `Drop Zone limpia`,
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
}

function uploadFailPopup() {
    document.getElementsByTagName('h1')[0].innerHTML = '';
    Swal.fire({
        title: 'Ups, algo ha salido mal',
        text: 'No hemos podido subir tus archivos, revisa el formato e inténtalo de nuevo ',
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
        if (result.isConfirmed) {
            resetFiles();
        }
    });
}















