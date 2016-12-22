# Iniciando con Angular 1.x

Existen muchas formas de iniciar con [Angular 1.x](https://angularjs.org/),
podemos empezar creando codigos de ejemplo en
[jsfiddle](https://jsfiddle.net/miguelerm/9pus3zoc/) u otros sitios, descargando
los archivos .js desde el sitio y creando archivos html y abrirlos en cualquier
navegador, etc. Pero hoy quería dejar esta pequeña guía de como crear una
aplicación angular utilizando [Node](https://nodejs.org/en/) como herramienta
para que la aplicación se ejecute en un servidor web local y usando
[npm](https://www.npmjs.com/) para gestionar las dependencias.

Para instalar **node** y **npm** basta con descargar el instalador del [sitio
oficial de node](https://nodejs.org/en/) y seguir las instrucciones.

Una vez instalado Node, debemos crear una carpeta para nuestro proyecto e
inicializarla como un proyecto de node, para eso podemos ejecutar los siguientes
comandos:

> **NOTA:** el comando `npm init` nos pedirá información básica del proyecto.

```sh
mkdir angular-demo
cd angular-demo
npm init
```

Al final en la carpeta angular-demo habrá un archivo llamado `package.json` con
un contenido similar a este:

```json
{
  "name": "angular-demo",
  "version": "1.0.0",
  "description": "Aplicacion de ejemplo de angular",
  "author": "Miguel Roman <miguelerm@gmail.com>",
  "license": "ISC",
}
```

> Pueden ver que eliminé algunas propiedades porque por el momento no las
> necesitamos aquí (ustedes pueden hacerlo tambien si lo desean).

Instalamos el servidor web que nos servirá para hacer pruebas (como una
dependencia de desarrollo) y tambien instalamos la librería de angular como una
dependencia de la aplicación:

```sh
npm install --save-dev lite-server
npm install --save angular
```

Si abrimos ahora el `package.json` veremos algo como esto:

```json
{
  "name": "angular-demo",
  "version": "1.0.0",
  "description": "Aplicacion de ejemplo de angular",
  "author": "Miguel Roman <miguelerm@gmail.com>",
  "license": "ISC",
  "devDependencies": {
    "lite-server": "^2.2.2"
  },
  "dependencies": {
    "angular": "^1.6.0"
  }
}
```

Nótese que las dependencias están en secciones distintas, la idea principal es
que las librerías que nuestra aplicación necesita para ejecutarse estén dentro
de `dependencies` y las librerias que usamos solo para desarrollar, probar o
compilar nuestra aplicación estén en `devDependencies`.

Utilizando nuestro editor favorito ([Visual Studio
Code](https://code.visualstudio.com/)) creamos un archivo `index.html` con el
siguiente contenido:

```html
<!doctype html>
<html ng-app>
  <head>
    <script src="/node_modules/angular/angular.js"></script>
  </head>
  <body>
    <div>
      <label>Name:</label>
      <input type="text" ng-model="yourName" placeholder="Enter a name here">
      <hr>
      <h1>Hello {{yourName}}!</h1>
    </div>
  </body>
</html>
```

Luego en el mismo editor agregamos los `scripts` en el `package.json`, scripts
que nos serviran para probar la aplicación:

```json
{
  "name": "angular-demo",
  "version": "1.0.0",
  "description": "Aplicacion de ejemplo de angular",
  "scripts": {
    "start": "lite-server",
    "lite-server": "lite-server"
  },
  "author": "Miguel Roman <miguelerm@gmail.com>",
  "license": "ISC",
  "devDependencies": {
    "lite-server": "^2.2.2"
  },
  "dependencies": {
    "angular": "^1.6.0"
  }
}
```

Por último iniciamos la aplicación y si todo salió bien se abrirá el navegador
apuntando hacia nuestra mini-aplicación angular.

```sh
npm start
```

Saludos, Mike
