---
layout: post
title: "Angular 1.x nuestro primer controller"
date: 2016-12-26 10:39
categories: posts
author: "Miguel Román"
summary: "Agregaremos un controller con funcionalidad básica a nuestro proyecto de Angular 1.x"
image: 2016/12/visual-studio-code-controller.png
---

En el [post anterior]({% post_url 2016-12-24-iniciando-con-angular-1 %}) creamos el proyecto base de una aplicación Angular, sin embargo, no tiene mayor funcionalidad escrita por nosotros, solamente tiene el enlace a una propiedad que actualiza el html con base en el texto que se ingresa en un `input[type=text]`. Pero un ejemplo real se requerirá funcionalidad más compleja que esta, este tipo de funcionalidad generalmente la encapsularemos en un controller.

Primero debemos preparar nuestra aplicación para poder definir controladores dentro de ella, para esto debemos definir un módulo inicial para nuestra aplicacion. Ejemplo, creemos un archivo llamado `app.js` y escribamos esto dentro de él:

```js
angular.module('angular-demo', []);
```

y tendremos que modificar el atributo `ng-app` en nuestro archivo `index.html` para que cargue este módulo e incluir el archivo `app.js`.

```html
<!doctype html>
<html ng-app="angular-demo">
  <head>
    <script src="/node_modules/angular/angular.js"></script>
    <script src="/app.js"></script>
  </head>
  ...
```

Ahora ya podemos crear un controller, creamos el archivo `todo.controller.js` con este contenido:

```js
angular.module('angular-demo').controller('TodoController', TodoController);

function TodoController() {
  var ctrl = this;

  ctrl.tarea = '';
  ctrl.tareas = [];
  ctrl.agregar = agregar;
  ctrl.completar = completar;
  ctrl.eliminar = eliminar;

  function agregar() {
    var nombre = ctrl.tarea;
    ctrl.tareas.push({
      nombre: nombre
    });
    ctrl.tarea = '';
  }

  function completar(item) {
    item.completada = !item.completada;
  }

  function eliminar(item) {
    var index = ctrl.tareas.indexOf(item);
    ctrl.tareas.splice(index, 1);
  }
}
```

> **NOTA**: para escribir controllers y otros componentes angular yo trato de seguir la [guía de John Papa para aplicaciones Angular](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md).

Incluímos el archivo `todo.controller.js` en el `index.html` y modificamos el `body` de este archivo para que la vista sea compatible con nuestro controller, lo que nos da un html como este:

```html
<!doctype html>
<html ng-app="angular-demo">
  <head>
    <script src="/node_modules/angular/angular.js"></script>
    <script src="/app.js"></script>
    <script src="/todo.controller.js"></script>
    <style type="text/css">
    .done {
      text-decoration: line-through;
    }
    </style>
  </head>
  <body>
    <div ng-controller="TodoController as vm">
      <label>Nueva Tarea:</label>
      <input type="text" ng-model="vm.tarea" placeholder="Ingresa el nombre de la tarea">
      <button type="button" ng-click="vm.agregar()" ng-disabled="!vm.tarea">Agregar</button>
      <hr>
      <ul>
        <li ng-repeat="item in vm.tareas" ng-class="{ done: item.completada }">
          <span style="display:block">{{ ::item.nombre }}</span>
          - <a href="#" ng-click="vm.completar(item)">[completar]</a>
          - <a href="#" ng-click="vm.eliminar(item)">[eliminar]</a>
        </li>
      </ul>
    </div>
  </body>
</html>
```

Y eso es todo, tenemos una pequeña aplicación con un sencillo controlador para agregar tareas, completarlas y eliminarlas (todo en memoria).

Si estamos trabajando sobre el mismo proyecto que creamos en nuestro [post anterior]({% post_url 2016-12-24-iniciando-con-angular-1 %}) ejecutamos `npm start` y podremos probar la aplicación.

![Ejemplo de la aplicación](/img/2016/12/ng-todo-app.png)

Espero que esto les de una idea mas clara de como trabajar con angular y separar el funcionamiento en controller, posteriormente veremos como administrar las rutas de la aplicación, agrupar componentes de nuestra aplicación (como el menú, el header, el footer, etc.), encapsular lógica en servicios, etc.

Hasta la próxima,

Mike.
