---
layout: post
title:  "Maestro detalle en ASP.Net MVC 4"
date:   2013-04-22 12:46
categories : posts
summary: "En este post voy a explicar como poder manejar una estructura de Maestro-Detalle en una aplicación **ASP.Net MVC4** pero sin la necesidad de trabajar con extensiones de **JavaScript** ni nada por el estilo."
---

En el desarrollo de aplicaciones, a menudo nos vemos en la necesidad de trabajar con estructuras en las que se solicitan colecciones de elementos (algo como un maestro detalle). El ejemplo típico es con una "Factura" o una "Orden de compra", en la que se cuenta con un encabezado (maestro) de la Factura que contiene número, fecha, datos del cliente, etc. y el detalle de la factura contiene *n* elementos que corresponden a los datos del producto: cantidad, precio, sub-total, etc.

En este post voy a explicar como poder manejar este tipo de situaciones en una aplicación web (específicamente en una aplicación de [ASP.Net MVC4][1]) pero sin la necesidad de trabajar con extensiones de [JavaScript][2] ni nada por el estilo.

<div class="alert alert-info">
    <h4>C&oacute;digo Fuente</h4>
    <p>El c&oacute;digo fuente de ejemplo que muestro en este post estar&aacute; disponible
        en mi <a href="https://github.com/miguelerm/samples" title="Repositorio de Miguel Roman en github">repositorio de ejemplos en github</a> en la ruta <a href="https://github.com/miguelerm/samples/tree/master/dotNet/MaestroDetalleMVC4-01" title="Ejemplo de maestro detalle en mvc">/dotNet/MaestroDetalleMVC4-01</a>.</p>
</div>

## El Modelo ##

Para las entidades (en este caso en particular nuestros modelos) que corresponden al dominio de nuestra aplicación contaremos con las siguientes:

{% highlight csharp %}

    public class Factura
    {
        public int Id { get; set; }

        public DateTime Fecha { get; set; }

        public string Nit { get; set; }

        public string ClienteNombre { get; set; }

        public ICollection<Detalle> Detalle { get; set; }

        public Factura()
        {
            this.Detalle = new HashSet<Detalle>();
        }
    }

{% endhighlight %}

{% highlight csharp %}

    public class Detalle
    {
        public int FacturaId { get; set; }

        public int ProductoId { get; set; }

        public decimal Precio { get; set; }

        public decimal Cantidad { get; set; }
    }

{% endhighlight %}

{% highlight csharp %}

    public class Producto
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public decimal Precio { get; set; }
    }

{% endhighlight %}

La representación de estas entidades en nuestro modelo relacional de base de datos podría verse de la siguiente forma:

<!-- http://ditaa.sourceforge.net/ -->
<!-- http://www.asciiflow.com/ -->
{% highlight text %}

+-----------------+       +--------------+         +-------------+
|    Facturas     |       |   Detalles   |         |  Productos  |
|-----------------|       |--------------|         |-------------|
| * Id            |<------+ * FacturaId  |    +--->|  * Id       |
|   Fecha         |       | * ProductoId +----+    |    Nombre   |
|   ClienteNit    |       |   Cantidad   |         |    Precio   |
|   ClienteNombre |       |   Precio     |         +-------------+
+-----------------+       +--------------+

{% endhighlight %}


## El controlador ##

Trabajemos en nuestro controlador:

Basicamente lo que hacemos en el `Action Create`  es solicitar un parámetro `accion` que nos va a indicar si hay que eliminar un detalle en base a su indice (`eliminar-detalle-idx`), agregar uno nuevo (`agregar-detalle`) o si viene `null` es porque hay que intentar crear la factura con la información indicada.

> **Nota:** en `eliminar-detalle-idx` el `idx` es el indice o posición del detalle que se quiere eliminar por ejemplo si queremos eliminar el tercer detalle de la lista, como `accion` se enviará `eliminar-detalle-2`.

{% highlight csharp %}

    public class FacturasController : Controller
    {
        // .. se omiten varias lineas .. //

        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(Factura modelo, string operacion = null)
        {
            if (modelo == null)
            {
                modelo = new Factura();
            }

            if (operacion == null)
            {
                if (CrearFactura(modelo))
                {
                    return RedirectToAction("Index");
                }
            }
            else if (operacion == "agregar-detalle")
            {
                modelo.Detalle.Add(new Detalle());
            }
            else if (operacion.StartsWith("eliminar-detalle-"))
            {
                EliminarDetallePorIndice(modelo, operacion);
            }

            ViewBag.Productos = productos;
            return View(modelo);
        }

        private static void EliminarDetallePorIndice(Factura factura, string operacion)
        {
            // se asume que en el parametro 'operacion' viene el index del detalle a eliminar.
            string indexStr = operacion.Replace("eliminar-detalle-", "");
            int index = 0;

            if (int.TryParse(indexStr, out index) && index >= 0 && index < factura.Detalle.Count)
            {
                var item = factura.Detalle.ToArray()[index];
                factura.Detalle.Remove(item);
            }
        }

        private bool CrearFactura(Factura factura)
        {
            if (ModelState.IsValid)
            {
                if (factura.Detalle != null && factura.Detalle.Count > 0)
                {
                    // este id posiblemente lo asigne tu base de datos.
                    factura.Id = facturas.Count > 0 ? facturas.Max(x => x.Id) + 1 : 1;
                    return true;
                }
                else
                {
                    ModelState.AddModelError("", "No puede guardar facturas sin detalle");
                }
            }

            return false;
        }
    }

{% endhighlight %}


## Las vistas ##

Aquí es en realidad donde se tiene que trabajar con cuidado, ya que [ASP.Net MVC4][1] cuenta con varias *convenciones* para realizar el *binding* entre nuestros modelos y la información enviada por el usuario por medio del POST de HTTP.

La primer convención que podemos notar en la vista, convención que quizás ya conozcan, es la que indica que el valor que se coloque en el atributo `name` de nuestros items corresponde a los nombres de las propiedades de nuestro modelo. por ejemplo:

Si yo tengo un formulario que posee un input similar a este:

{% highlight html %}

    <input type="text" name="edad" />

{% endhighlight %}

y tengo una clase que tiene la propiedad:

{% highlight csharp %}

    public int Edad { get; set; }

{% endhighlight %}

Entonces, cuando el usuario haga `submit` del formulario, MVC asignara el valor ingresado en el `input[name=edad]` a la propiedad `Edad` de nuestro modelo.

Otra convención indica que si mi propiedad es de un tipo complejo, el nombre de mi input debe indicar la ruta completa de la propiedad a la que queremos hacer *binding*, por ejemplo:

Si yo tengo una clase que tiene una propiead de un tipo complejo:

{% highlight csharp %}

    public Direccion DireccionDeCasa { get; set; }

{% endhighlight %}

Y nuestra clase `Direccion` es algo como esto:

{% highlight csharp %}

    public class Direccion {
    	public string Pais { get; set; }
    	public string Estado { get; set; }
    }

{% endhighlight %}

y si en nuestro formulario queremos solicitar el valor de la propiedad `Pais` de la propiead `DireccionDeCasa` de nuestro modelo, nuestro input tendría que ser algo como esto:

{% highlight html %}

    <input type="text" name="direcciondecasa.pais" />

{% endhighlight %}

Entonces al hacer el *submit* de nuestro formulario, MVC creará una instancia nueva de `Direccion` en la propiedad `DireccionDeCasa` de nuestro modelo, con el valor del `input[name=direcciondecasa.pais]` en la propiedad `Pais` de esa instancia.

> Excelente! verdad? olvidemonos ya de los `Request.QueryString["pais"]` o de los `Request.Post["edad"]` o de los `Request["algo"]`, [ASP.Net MVC4][1] nos ayudó mucho con este trabajo de **autómatas**.

Ok, ahora ¿qué pasa con las colecciones `Arrays`, `List`, `Collection`, `Enumerable`?

Bueno, para esto existe otra convención que me dice que si yo tengo una propiedad que representa a un conjunto de datos, por ejemplo:

{% highlight csharp %}

    public int[] Calificaciones { get; set; }

{% endhighlight %}

entonces yo puedo asignarle valores a ese arreglo simplemente asegurandome de que el input, aparte de tener el mismo nombre que la propiedad, tenga el índice encerrado entre corchetes `[]`. Por ejemplo:

{% highlight html %}

    <input type="text" name="calificaciones[0]" />
    <input type="text" name="calificaciones[1]" />
    <input type="text" name="calificaciones[2]" />
    <input type="text" name="calificaciones[3]" />

{% endhighlight %}

En este ejemplo específico tenemos cuatro `inputs` con `name="calificaciones[]"` por lo que MVC creara una array de enteros de 4 posiciones con los valores de cada input colocados en cada una de las posiciones; esto quiere decir que si el usuario ingresa en el primer input el valor `1`, en el segundo el valor `2`, etc, al final recibiriamos en la propiedad `Calificaciones` de nuestro modelo un array como este:

{% highlight csharp %}

    int[] valores = new int [] { 1, 2, 3, 4 }

{% endhighlight %}

Pero... ¿y si mi propiedad es un conjunto de datos de tipos complejos, cómo le hago?

Pues... combinamos ambas convenciones, veamos la siguiente propiedad:

{% highlight csharp %}

    public Direccion[] Direcciones { get; set; }

{% endhighlight %}

y queremos solicitarle al usuario el pais de cada direccion, solamente despues de los corchetes `[]` colocamos el nombre de la propiedad en la que queremos recibir el valor.

{% highlight html %}

    <input type="text" name="direcciones[0].pais" />
    <input type="text" name="direcciones[1].pais" />
    <input type="text" name="direcciones[2].pais" />
    <input type="text" name="direcciones[3].pais" />

{% endhighlight %}

> **Nota:** Vale la pena mencionar que todo esto lo logra el framework de [ASP.Net MVC4][1] gracias a las implementaciones de la interfaz [IModelBinder][3], espero poder hablar de ella en otro post.

Bueno!, ya habiendo explicado un poco todo este "relajo", aqui les va el codigo de las vistas, *la importante o relevante a este post es la vista Create.cshtml*.

{% highlight html %}

    @model MvcApplication.Entidades.Factura

    @using (Html.BeginForm()) {
        @Html.AntiForgeryToken()

        <fieldset>
            <legend>Factura</legend>

            <label>
                <span>@Html.DisplayNameFor(model => model.Fecha)</span>
                @Html.EditorFor(model => model.Fecha)
            </label>
            <label>
                <span>@Html.DisplayNameFor(model => model.Nit)</span>
                @Html.EditorFor(model => model.Nit)
            </label>
            <label>
                <span>@Html.DisplayNameFor(model => model.ClienteNombre)</span>
                @Html.EditorFor(model => model.ClienteNombre)
            </label>

            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th><button type="submit" name="operacion" data-val="false" value="agregar-detalle">Agregar Detalle</button></th>
                    </tr>
                </thead>
                <tbody>
                @if (Model != null && Model.Detalle != null && Model.Detalle.Count > 0)
                {
                    var i = 0;
                    foreach (var item in Model.Detalle)
                    {
                        <tr>
                            <td>@Html.DropDownList("Detalle[" + i + "].ProductoId", new SelectList(ViewBag.Productos, "Id", "Nombre", item.ProductoId))</td>
                            <td>@Html.TextBox("Detalle[" + i + "].Precio", item.Precio)</td>
                            <td>@Html.TextBox("Detalle[" + i + "].Cantidad", item.Cantidad)</td>
                            <td><button type="submit" name="operacion" value="eliminar-detalle-@i" >Eliminar</button></td>
                        </tr>
                        i++;
                    }
                }
                </tbody>
            </table>

            <p>
                <input type="submit" value="Crear" />
            </p>
        </fieldset>
    }

    <div>
        @Html.ActionLink("Volver al listado", "Index")
    </div>

{% endhighlight %}

¿Cómo sabe MVC a que boton le dimos clicsi todos son `input[type=submit]`?

Bueno, bueno, este es un principio de los formulario HTML como tal, que indica que si el input es de tipo `submit` o `button` se enviará únicamente el valor del boton al cual se le dió clic.


## Conclusiones ##

Aunque funciona con esta forma de implementar un maestro-detalle, quizás no es la mas "adecuada" ya que ignoramos cosas como las validaciones del lado del cliente por ejemplo.

Adicionalmente a esto tambien la complegidad de nuestro **Controllador** se incrementa, ya que le damos mayor responsabilidades que las que le competen. Incluso nuestro **Action Crate** hace mas que lo que dice que hace, el action create se encarga de asignar detalles a la factura, y cosas por el estilo.

La responsabilidad de mostrar los elementos que necesita el usuario para ingresar la información tendría que ser de la **Vista** y no del controlador.

El objetivo de este post no es que elaboremos un Maestro-Detalle con esta técnica, sino que solamente dar las bases de como funciona internamente el Framework de Asp.Net MVC4 en estos escenarios.

Pero no se preocupen en el siguiente POST ya vamos a involucrar un poco a nuestro buen amigo [JavaScript][2] para delegar la responsabilidad que tiene ahorita el Controlador hacia la vista.


## Despedida ##

Espero que les sea de utilidad esta información y nos vemos en el próximo artículo donde hablaremos un poco mas de este tema.

Saludos y hasta la próxima, <a title="Mike en Google+" rel="author" href="http://profiles.google.com/miguelerm?rel=author">Mike</a>.

[1]: http://www.asp.net/mvc "Sitio oficial de Asp.Net Mvc"
[2]: http://es.wikipedia.org/wiki/JavaScript "JavaScript en Wikipedia"
[3]: http://msdn.microsoft.com/en-us/library/system.web.mvc.imodelbinder(v=vs.98).aspx "Interfaz IModelBinder en MSDN"
