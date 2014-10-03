---
layout: post
title:  "Funcion LISTAGG de Oracle"
date:   2013-04-22 12:46
categories : posts
summary: "Ejemplo de uso de la función LISTAGG de Oracle, utilizada para concatenar registros separados por comas."
---

Esta función permite concatenar varias filas separadas por algún carácter en Oracle *(solo 11 o superior)*.

Por ejemplo, imaginemos que tenemos la tabla Facturas (perdón solo este tipo de ejemplos se me ocurren siempre), con lo siguiente:

| Factura |   Fecha    |  Nit   |
|---------|------------|--------|
|    1    | 01/01/2001 | 111111 |
|    2    | 02/02/2002 | 222222 |
|    3    | 03/03/2003 | 333333 |

Y la tabla FacturasDetalle con lo siguiente:

| Factura | Cantidad |  Producto  | Precio |
|---------|----------|------------|--------|
|    1    |    3     | Lápiz      |  1.00  |
|    1    |    3     | Borrador   |  0.50  |
|    1    |    3     | Sacapuntas |  0.25  |
|    2    |    2     | Cuaderno   |  2.50  |
|    2    |    2     | Regla      |  1.75  |
|    3    |    1     | Lapicero   |  2.00  |

Y que queremos mostrar los datos de la factura, con el total a pagar pero solo el nombre de los ítems separados por coma:

```sql

SELECT 
    FACTURA, 
    FECHA, 
    NIT, 
    SUM(CANTIDAD * PRECIO) TOTAL, 
    LISTAGG(PRODUCTO, ',') WITH GROUP (ORDER BY PRODUCTO) PRODUCTOS 
FROM 
    FACTURAS 
    INNER JOIN FACTURASDETALLE USING (FACTURA);

```

Entonces el resultado del query sería algo como esto:

|Factura |   Fecha    |   Nit  | Total |        Productos           |
|--------|------------|--------|-------|----------------------------|
|   1    | 01/01/2001 | 111111 |  7.75 | Borrador, Lápiz Sacapuntas |
|   2    | 02/02/2002 | 222222 |  8.50 | Cuaderno, Regla            |
|   3    | 03/03/2003 | 333333 |  2.00 | Lapicero                   |

> **Nota:** no sé si las sumas están bien, pero la idea es esa. Jejeje

PD.: El JOIN también se puede hacer con esta sintaxis que creo que es la que más utilizan por algunos oraclers, jejeje

```sql

SELECT 
    FACTURAS.FACTURA, 
    FECHA, 
    NIT, 
    SUM(CANTIDAD * PRECIO) TOTAL, 
    LISTAGG(PRODUCTO, ',') WITH GROUP (ORDER BY PRODUCTO) PRODUCTOS 
FROM 
    FACTURAS, 
    FACTURASDETALLE
    WHERE
    FACTURAS.FACTURA = FACTURASDETALLE.FACTURA;

```

Saludos y hasta la próxima.
