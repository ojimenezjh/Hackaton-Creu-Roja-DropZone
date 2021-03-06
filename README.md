# Drop Zone by Oscar Jiménez
## Link para acceder a la aplicación https://late-lab-8901.on.fleek.co/

Aplicación web con diseño moderno y responsive que nos permite hacer un registro y login utilizando *session storage* y *local storage* para subir un archivo a google drive utilizando el token de acceso facilitado por el login de Google.

## Background
Éste proyecto está basado en el diseño facilitado por https://nuwe.io --> https://www.figma.com/file/0SZrgYVwjp2mz1ohVi8WSw?node-id=51:4 para la participación en el Hackathon de *Barcelona Digital Talent*.

## Uso
Se puede ejecutar el proyecto en local simplemente clonando este repositorio y ejecutando el siguiente pluguin de visual studio code o similar:  

**Nombre: Live Server
ID: ritwickdey.LiveServer
Descripción: Launch a development local Server with live reload feature for static & dynamic pages
Versión: 5.7.5
Editor: Ritwick Dey
Vínculo de VS Marketplace: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer**
- **Leer el siguiente punto (Google API) para que la aplicación clonada sea totalmente funcional**

## Google API
Al clonar el repositorio, se debe crear una cuenta en *Google cloud platform* --> https://console.cloud.google.com/ y crear credenciales de OAuth2 en el apartado de API y servicios para obtener el ID de cliente y añadirlo en el archivo **variables.js.**

**IMPORTANTE:**
- Añadir los dominios que se vayan a utilizar en el apartado *Orígenes autorizados de JavaScript* en *Google cloud platform*. 
- Añadir el siguiente script en el html: `<script src="https://accounts.google.com/gsi/client" async defer></script>`

## Stack
Para esta aplicación se han utilizado Javascript, html y css complementados con las siguientes librerías:
- SweetAlert2: Para crear todo tipo de pop-ups personalizados.
- Animate.css: Para crear animaciones en los pop-ups.
- Particles.js: Para añadir partículas en la pantalla de registro/inicio de sesión.
- jQuery: Para simplificar algunas partes del código de Javascript.

**Todas las librerías se han implementado mediante CDN debido a la naturaleza del proyecto**

## Nota sobre el desarrollo
Se han utilizado diferentes maneras de interactuar con el DOM y diferentes maneras de capturar eventos, utilizando tanto jQuery como Vanilla JS para demostrar el uso de diferentes maneras de desarrollar las mismas operativas.

Se ha escogido una distribución simple y clara de carpetas al utilizarse pocos tipos de archivos, en la carpeta **assets** se encuentran las imágenes SVG, en la carpeta **styles** los css y en la carpeta **js** se encuentran los scripts y la configuración de las partículas dentro de otra carpeta.

## Contribución y Apoyo
Cualquier persona puede contribuir o apoyar el proyecto de la manera que quiera.

## Información de contacto
- Linkedin: www.linkedin.com/in/oscar-jimenez-hurtado
- Correo: <ojimenezjh@uoc.edu>

## CDN utilizadas
```
- <script src="//cdn.jsdelivr.net/npm/sweetalert2@11"></script>
- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
- <script src="http://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
```
## Puntuación de Codefactor
[![CodeFactor](https://www.codefactor.io/repository/github/ojimenezjh/hackaton-creu-roja-dropzone/badge)](https://www.codefactor.io/repository/github/ojimenezjh/hackaton-creu-roja-dropzone)

## Licencia
Para leer la licencia, hacer click en el siguiente link:
[MIT License](https://github.com/ojimenezjh/Hackaton-Creu-Roja-DropZone/blob/main/LICENSE)
