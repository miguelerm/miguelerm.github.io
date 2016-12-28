---
layout: post
title: "Angular 1.x ngRoutes"
date: 2016-12-28 12:13
categories: posts
author: "Miguel Román"
summary: "Continuando con nuestra serie de Angular, ahora configuraremos las rutas."
image: 2016/12/visual-studio-code-controller.png
---

En una aplicación regularmente contaremos con multiples "pantallas" cada una
con su propia funcionalidad, por ejemplo: crear usuarios, buscar productos,
etcétera. Pero al igual que cualquier otra aplicación web, la forma más
práctica para que los usuarios accedan a estas pantallas es por medio de rutas
e hipervínculos. En este post crearemos una aplicación angular con multiples
controladores y rutas especificas para cada uno de ellos.

Para empezar crearemos una aplicación con la dependencia de angular tal y como
lo mencionamos en el post "[iniciando con angular 1.x]({% post_url 2016-12-24-iniciando-con-angular-1 %})".

Una vez tengamos la aplicación configurada y funcionando procederemos a
realizar los siguientes pasos para configurar las rutas:

### Instalar angular-route

Debemos instalar la librería `angular-route` para poder definir rutas dentro de
angular:

```sh
npm install --save angular-route
```

En nuestro archivo `index.html` incluimos el script de `angular-route.js` justo
después del script de `angular.js`:

```html
<script src="/node_modules/angular/angular.js"></script>
<script src="/node_modules/angular-route/angular-route.js"></script>
```

En el archivo `app.js` modificamos la definición de nuestra aplicación para que
ahora cargue el módulo `ngRoute`:

```js
angular.module('angular-demo', ['ngRoute']);
```

Por ultimo debemos indicar en el `index.html` en que sección queremos que se
carguen las vistas de cada una de las rutas, en otras palabras que región del
html será la que cambia cuando cambia de ruta y que regiones son estáticas.

Para eso tenemos que agregar el atributo ng-view en alguna region de nuestro
html, para este ejemplo el `body` del `index.html` quedará como esto:

```html
<body>
    <div ng-view></div>
</body>
```
> Más adelante agregaremos un menú y otros elementos que estarán estáticos en
> nuestro index.html pero por el momento solo dejémos este `div`.

Con estos pasos nuestra aplicación queda lista para definir y utilizar rutas, a
continuación crearemos unos controllers, servicios y vistas con el fin de
ejemplificar una aplicación sencilla y tener algo que mostrar en cada ruta, pero
si ya cuentas con esta parte puedes saltarte hasta el final donde se muestra
[la configuración de las rutas](#configurando-rutas).

> **NOTA:** Para muchos casos yo utilizo el módulo [ui-router](https://ui-router.github.io/)
> pero para fines de esta aplicación creo que el módulo [ngRoute](https://docs.angularjs.org/api/ngRoute)
> es más que suficiente.

### Creando Servicio empleados

Un servicio en angular, es un componente que permite encapsular lógica de
nuestra aplicación. Yo utilizo los servicios, por ejemplo, para colocar ahí la
lógica necesaria para ir a obtener datos al servidor o para guardar los datos
en el servidor, algunas validaciones, etcétera. La idea principal es que los
controllers queden únicamente con lógica de presentación (responder a clics,
mostrar información, etc.).

**Servicio Empleados:** crear un archivo `empleados.servicio.js` con:

```js
angular.module('angular-demo').service('empleados', EmpleadosServicio);

function EmpleadosServicio() {

    var empleados = [];
    var siguienteId = 1;

    var svc = this;
    svc.todos = todos;
    svc.unico = unico;
    svc.agregar = agregar;
    svc.eliminar = eliminar;
    svc.modificar = modificar;
    
    function todos() {
        return empleados;
    }

    function unico(id) {
        for(var i = 0; i < empleados.length; i++) {
            var emp = empleados[i];
            if (emp.id === id) return emp;
        }

        return null;
    }

    function agregar(datos) {
        // TODO: validar datos;

        var id = siguienteId++;
        empleados.push({
            id: id,
            nombre: datos.nombre,
            edad: datos.edad,
            // Etcétera
        });
    }

    function eliminar(id) {
        var emp = unico(id);
        if (emp === null)
            throw Error("El empleado no existe");

        var idx = empleados.indexOf(emp);
        empleados.splice(idx, 1);
    }

    function modificar(id, datos) {

        // TODO: validar datos
        
        var emp = unico(id);
        if (emp === null)
            throw Error("El empleado no existe");
        
        emp.nombre = datos.nombre;
        emp.edad = datos.edad;
    }

}
```

### Creando Controllers

Vamos a crear tres controllers sencillos, uno que mostrará el listado de
empleado, otro permitirá crear nuevos empleados y un último que solamente
permitirá ver los detalles del empleado, el resto de acciones implementadas en
el servicio (`modificar` y `eliminar`) quedan como ejercicio para el lector :).

**Controller Listar Empleados:** crear el archivo `empleados-listar.controller.js`
con el siguiente contenido:

```js
angular
    .module('angular-demo')
    .controller('EmpleadosListarController', EmpleadosListarController);

function EmpleadosListarController(empleados) {
    var ctrl = this;
    ctrl.empleados = [];

    (function init() {
        ctrl.empleados = empleados.todos();
    })();
}
```

**Controller Crear Empleados:** crear el archivo `empleados-crear.controller.js`
con el siguiente contenido:

```js
angular
    .module('angular-demo')
    .controller('EmpleadosCrearController', EmpleadosCrearController);

function EmpleadosCrearController(empleados, $location) {
    var ctrl = this;

    ctrl.crear = crear;
    ctrl.modelo = {
        nombre: '',
        edad: 18
    };


    function crear() {
        empleados.agregar(ctrl.modelo);
        $location.path('/empleados');
    }
}
```

**Controller Detalle Empleados:** crear el archivo `empleados-detalle.controller.js`
con el siguiente contenido:

```js
angular
    .module('angular-demo')
    .controller('EmpleadosDetalleController', EmpleadosDetalleController);

function EmpleadosDetalleController(empleados, $routeParams) {
    var ctrl = this;
    ctrl.empleado = null;

    (function init() {
        var id = parseInt($routeParams.id, 10);
        ctrl.empleado = empleados.unico(id);
    })();
}
```

### Creando Vistas

Ahora para completar debemos crear una vista para cada uno de los controladores
para eso crearemos los siguientes archivos:

**Vista Empleados Listar:** crear el archivo `empleados-listar.template.html` con
el siguiente contenido:

```html
<p><a ng-href="/empleados/crear" title="Crear">Crear un nuevo empleado</a></p>
<table>
    <thead>
        <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Edad</th>
        </tr>
    </thead>
    <tbody>
        <tr ng-repeat="item in vm.empleados track by item.id">
            <td>
                <a ng-href="/empleados/{{ ::item.id }}" title="ver detalles" ng-bind="::item.id"></a>
            </td>
            <td ng-bind="::item.nombre"></td>
            <td ng-bind="::item.edad"></td>
        </tr>
    </tbody>
</table>
```

**Vista Empleados Crear:** crear el archivo `empleados-crear.template.html` con
el siguiente contenido:

```html
<form name="frm" ng-submit="vm.crear()" novalidate>
    <div>
        <label>Name</label>
        <input type="text" name="nombre" ng-model="vm.modelo.nombre" required minlength="2" maxlength="50">
        <div ng-if="frm.nombre.$invalid && frm.nombre.$dirty">
            <p ng-show="frm.nombre.$error.required">El nombre es un dato requerido.</p>
            <p ng-show="frm.nombre.$error.minlength">El nombre debe tener al menos dos letras.</p>
            <p ng-show="frm.nombre.$error.maxlength">El nombre no puede tener mas de 50 letras.</p>
        </div>
    </div>
    <div>
        <label>Edad</label>
        <input type="number" name="edad" ng-model="vm.modelo.edad" required max="99" min="18">
        <div ng-if="frm.edad.$invalid && frm.edad.$dirty">
            <p ng-show="frm.edad.$error.required">La edad es un dato requerido.</p>
            <p ng-show="frm.edad.$error.max">La edad no puede ser mayor a 99.</p>
            <p ng-show="frm.edad.$error.min">La edad debe ser mayour o igual a 18.</p>
        </div>
        <p ng-show="">La edad es requerida.</p>
    </div>
    <div>
        <button type="submit" ng-disabled="frm.$invalid">Crear</button>
        <a ng-href="/empleados" title="regresar al listado">Cancelar</a>
    </div>
</form>
```

**Vista Empleados Detalle**: crear el archivo `empleados-detalle.template.html` con
el siguiente contenido:


```html
<form>
    <div>
        <label>Nombre</label>
        <input type="text" ng-model="vm.empleado.nombre" disabled="disabled">
    </div>
    <div>
        <label>Edad</label>
        <input type="number" ng-model="vm.empleado.edad">
    </div>
    <div>
        <a ng-href="/empleados" title="regresar al listado">Regresar</a>
    </div>
</form>
```

### Configurando rutas

Ok por último lo que en realidad nos importa, configurar las rutas de nuestra
aplicación, para esto creamos el archivo `app.routes.js` con el siguiente
contenido:

```js
angular.module('angular-demo').config(rutas);

function rutas($routeProvider, $locationProvider) {
    $routeProvider
        .when('/empleados', {
            templateUrl: 'empleados-listar.template.html',
            controller: 'EmpleadosListarController as vm'
        })
        .when('/empleados/crear', {
            templateUrl: 'empleados-crear.template.html',
            controller: 'EmpleadosCrearController as vm'
        })
        .when('/empleados/:id', {
            templateUrl: 'empleados-detalle.template.html',
            controller: 'EmpleadosDetalleController as vm'
        });
    
    $locationProvider.html5Mode(true);
}
```

En esta configuración el orden en el que definamos las rutas importa, por
ejemplo: la ruta `/empleados/crear` tiene que declararse antes de la ruta
`empleados/:id` ya que `:id` es un patron que coincidirá con todo aquello
que se coloque despues de la diagonal, si se colocara antes esta ruta, angular
podría interpretar la ruta `/empleados/crear` como si el id del empleado fuese
`crear`, por esta razón las rutas mas específicas van antes y las rutas con
variables se definen despues.

Adicionalmente pueden observar que en la configuración de las rutas se
establece **html5mode**, esto permite a que las rutas se vean como si fuesen
rutas de una aplicación que se está renderizando del lado del servidor, por
ejemplo:

* http://localhost:3000/empleados
* http://localhost:3000/empleados/crear
* http://localhost:3000/empleados/1

Si se coloca **html5mode** igual a `false` las rutas se generarían como estas:

* http://localhost:3000/#!/empleados
* http://localhost:3000/#!/empleados/crear
* http://localhost:3000/#!/empleados/1

El único inconveniente es que todos nuestros links y referencias al `$location.path('/');`
como el que tenemos en el `EmpleadosAgregarController` deben llevar el prefijo `#!` tambien
en la ruta.

> Esto es algo que nos facilita el módulo [ui-router](https://ui-router.github.io/) ya
> que la configuración y el formato de las rutas es independiente porque se definen
> estados en lugar de rutas. por lo que los cambios en la configuración no requiren
> siempre de cambios en los controllers o en las vistas.

Por último para que tengan la referencia completa, el `index.html` debe lucir
algo como esto:

```html
<!doctype html>
<html ng-app="angular-demo">
  <head>
    <script src="/node_modules/angular/angular.js"></script>
    <script src="/node_modules/angular-route/angular-route.js"></script>
    <script src="/app.js"></script>
    <script src="/app.routes.js"></script>
    <script src="/empleados.servicio.js"></script>
    <script src="/empleados-listar.controller.js"></script>
    <script src="/empleados-detalle.controller.js"></script>
    <script src="/empleados-crear.controller.js"></script>
  </head>
  <body>
    <aside>
        <h3>Menu</h3>
        <ul>
            <li><a ng-href="/empleados">Empleados</a></li>
            <li><a ng-href="/empleados/crear">Crear Empleado</a></li>
        </ul>
    </aside>
    
    <div ng-view>
    </div>
  </body>
</html>
```

Esto es todo, espero que el ejemplo sirva para iniciar con las rutas en angular
y que no sea muy enredado para poderlo comprender.

Siempre cualquier duda estoy al tanto de los comentarios.

Saludos,

Mike