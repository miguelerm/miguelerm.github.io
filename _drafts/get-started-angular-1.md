# Iniciando con Angular 1.x

> Para facilitar el desarrollo y pruebas dentro de un servidor web utilizaremos [Node](https://nodejs.org/en/) como herramienta de apoyo en tiempo de desarrollo (por lo que asumo que ya está instalado en sus equipos). 

Crear una carpeta para nuestro proyecto e inicializarla como un proyecto de node.

```sh
mkdir angular-demo
cd angular-demo
npm init
```

Al final en la carpeta angular-demo habrá un archivo llamado `package.json` con un contenido similar a este:

```json
{
  "name": "angular-demo",
  "version": "1.0.0",
  "description": "Aplicacion de ejemplo de angular",
  "author": "Miguel Roman <miguelerm@gmail.com>",
  "license": "ISC",
}
```

Instalamos el servidor web que nos servirá para hacer pruebas (como una dependencia de desarrollo) y tambien instalamos la librería de angular como una dependencia de la aplicación:

```sh
npm install --save-dev lite-server
npm install --save angular
```

Utilizando nuestro editor favorito ([Visual Studio Code](https://code.visualstudio.com/)) creamos un archivo `index.html` con el siguiente contenido:

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

Luego en el mismo editor agregamos los `scripts` en el `package.json`, scripts que nos serviran para probar la aplicación:

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

Por último iniciamos la aplicación y si todo salió bien se abrirá el navegador apuntando hacia nuestra mini-aplicación angular.

```sh
npm start
```

Saludos,
Mike
