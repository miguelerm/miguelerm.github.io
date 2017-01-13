---
layout: post
title: "Asp.Net Core corriendo en .Net Framework 4.5"
date: 2017-01-13 14:20
categories: posts
author: "Miguel Román"
summary: "Combinando todo el poder de .Net Framework 4.5 con la elegancia de Asp.Net Core."
image: 2016/12/visual-studio-code-controller.png
---

Con el lanzamiento de .Net Core y Asp.Net Core surgieron muchas dudas y se
generó mucha confusión, pero una de las preguntas que más seguido me hacen es:
¿Si hago una aplicación en Asp.Net Core podré utilizar librerías desarrolladas
para el .Net Framework?

Para responder esta pregunta hay que aclarar un par de conceptos antes:

* **.Net Core**: Es un conjunto de librerias, herramientas para compilar, ejecutar y
  desarrollar aplicaciones para *múltiples plataformas*.
* **Asp.Net Core**: Es el nuevo framework para desarrollo de aplicaciones web
  que puedan ejecutarse en multiples plataformas (esto incluye el runtime de
  .Net Core y el runtime de .Net Framework).
* **.Net Framework**: Similar a .Net Core es un conjunto de librerias y herramientas
  para compilar, ejecutar y desarrollar aplicaciones en *Windows* (aquí una de las diferencias).
* **.Net Standard Library**: (Este es el factor clave aquí) es le especificación formal
  de las APIS de .Net que deberían de estar disponibles en todas las plataformas.

Ok, Esto no ayuda en nada a responder la pregunta al inicio del post :) pero, ya tenemos un punto de partida.

El asunto es que cuando desarrollamos una aplicación con .Net Core podemos indicar la (o las)
plataformas que queremos que nuestra aplicación soporte (https://docs.microsoft.com/en-us/dotnet/articles/standard/library#net-platforms-support) 



