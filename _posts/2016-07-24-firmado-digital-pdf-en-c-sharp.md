---
layout: post
title: "Firmado digital de documentos PDF en C# con certificados SSL"
date: 2016-07-24 17:28
categories: posts
summary: "En este post mostraré un poco de código en C# para firmar digitalmente documentos PDF con certificados SSL."
---

# Firmado digital de documentos PDF en C# con certificados SSL

Hace unos días mi hermana me consultaba al respecto de verificar si un reporte fue efectivamente generado por el sistema y si el contenido de este se encuentra inalterado. Hasta el momento creo que la mejor forma de hacerlo, sin necesidad de almacenar una copia del documento para compararlas en el futuro, es firmando digitalmente el documento.

En muchos casos se podría simplemente generar un HASH (con [sal][salt-wikipedia]) del documento e incrustárselo como metadata al documento; sin embargo, creo que la firma digital está hecha específicamente para el escenario que mencioné anteriormente (principalmente porque al tener un HASH la verificacion de la validez del documento podrá hacerse únicamente por el mismo sistema que generó el documento, pero con la forma electrónica la verificación de identidad y de integridad del documento la podrán hacer los usuarios utilizando el lector de documentos PDF).

[salt-wikipedia]: https://es.wikipedia.org/wiki/Sal_(criptograf%C3%ADa)

## ¿Qué es la firma electrónica y su diferencia con la firma digital?

La firma electrónica, como dice wikipedia, es un concepto jurídico que busca darle validez legal a un documento electrónico. Mientras que la firma digital es la técnica o método criptográfico que se implementa para garantizar la vigencia e integridad de un documento; estos algoritmos generalmente se basan en la aplicación de una función HASH al documento y luego aplicar un algoritmo de firma que puede estar basado en llaves privadas y públicas.

Este post está basado en la aplicación de firma digital de un documento, pero aplica fácilmente para procesos de firma electrónica (si se cuenta con los certificados autorizados en cada país).

Por ejemplo en Guatemala existe una entidad encargada llamada [Registro de Prestadores de Servicios de Certificación](https://www.rpsc.gob.gt/) bajo la administración del Ministerio de Economía; en este registro se encuentran todos aquellos proveedores que están autorizados a emitir certificados que tengan validez legal; sin embargo los métodos mencionados en este post son igualmente válidos con los certificados emitidos por estas entidades.

## Que certificados obtener para firmar documentos

Comunmente para que una persona o un sistema puedan realizar la firma de documentos deberán de adquirir un certificado para estos propósitos, lo más estándar es que se adquiera un certificado con token (que son dispositivos generalmente USB en los que se encuentra almacenado el certificado). Pero también es posible firmar documentos con certificados SSL (Si! los mismos que utilizamos para "asegurar" las conexiones de nuestros sitios o aplicaciones web).

Para este ejemplo utilizaré un certificado autofirmado (esto quiere decir que lo emitiré desde mi computadora y no pagaré para adquirirlo) la desventaja de estos es que cuando se abra un documento firmado con este certificado el lector dirá que no confía en el emisor del certificado; para que un certificado lo muestre como válido el lector de PDFs, el certificado debe ser emitido por cualquiera de las entidades que se encuentran en el [listado de centro de confianza de Adobe](https://helpx.adobe.com/acrobat/kb/approved-trust-list1.html).

### Generar certificado autofirmado

En una computadora con linux se puede generar con la siguiente secuencia de comandos:

```shell
openssl genrsa -des3 -passout pass:FoevaGWv6TnR3gC0Kc5o -out server.pass.key 2048
openssl rsa -passin pass:FoevaGWv6TnR3gC0Kc5o -in server.pass.key -out server.key
openssl req -new -key server.key -out server.csr
openssl x509 -req -sha256 -days 1024 -in server.csr -signkey server.key -out server.crt
openssl pkcs12 -export -in server.crt -inkey server.key -out certificado.pfx
rm server.pass.key
rm server.csr
```

En una computadora con windows se puede generar utilizando el IIS tal y como lo mencionan aquí: [Create and export a self-signed certificate][selfsignedcert-iis].

En ambos casos terminaremos con un archivo .pfx que estará (o debería estarlo) protegido con una contraseña.

[selfsignedcert-iis]: https://technet.microsoft.com/en-us/library/ff710475(v=ws.10).aspx

## Show me the code!

El proceso lo separaremos en dos partes, firma y verificación. El proceso de firma se debe realizar una vez el documento ya haya sido generado en formato PDF, una posible implementación de la firma utilizando la librería [iTextSharp](https://www.nuget.org/packages/iTextSharp/) puede ser:

```csharp
using System;
using System.IO;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;

namespace FirmaElectronica
{
    public class Firmante
    {
        private readonly Certificado certificado;

        public Firmante(Certificado certificado)
        {
            this.certificado = certificado;
        }

        public void Firmar(string rutaDocumentoSinFirma, string rutaDocumentoFirmado)
        {
            using (var reader = new PdfReader(rutaDocumentoSinFirma))
            using (var writer = new FileStream(rutaDocumentoFirmado, FileMode.Create, FileAccess.Write))
            using (var stamper = PdfStamper.CreateSignature(reader, writer, '\0', null, true)) {
                var signature = stamper.SignatureAppearance;
                signature.CertificationLevel = PdfSignatureAppearance.CERTIFIED_NO_CHANGES_ALLOWED;
                signature.Reason = "Firma del sistema";
                signature.ReasonCaption = "Tipo de firma: ";

                var signatureKey = new PrivateKeySignature(certificado.Key, DigestAlgorithms.SHA256);
                var signatureChain = certificado.Chain;
                var standard = CryptoStandard.CADES;

                MakeSignature.SignDetached(signature, signatureKey, signatureChain, null, null, null, 0, standard);
            }
        }
    }
}
```

Ahora bien, la implementación para el proceso de verificación (siempre utilizando la librería [iTextSharp](https://www.nuget.org/packages/iTextSharp/)) podría ser como el siguiente:

```csharp
using System;
using System.Diagnostics;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.security;
using Org.BouncyCastle.Security;

namespace FirmaElectronica
{
    public class Notario
    {
        private readonly Certificado certificado;

        public Notario(Certificado certificado)
        {
            this.certificado = certificado;
        }

        public bool CertificarDocumento(string rutaDocumentoFirmado)
        {
            using (var reader = new PdfReader(rutaDocumentoFirmado)) {
                var campos = reader.AcroFields;
                var nombresDefirmas = campos.GetSignatureNames();
                foreach (var nombre in nombresDefirmas) {
                    if (ValidarFirma(campos, nombre)) {
                        return true;
                    }
                }
            }

            return false;
        }

        private bool ValidarFirma(AcroFields campos, string nombre)
        {
            // Solo se verificará la última revision del documento.
            
            if (campos.GetRevision(nombre) != campos.TotalRevisions)
                return false;

            // Solo se verificará si la firma es de todo el documento.
            
            if (!campos.SignatureCoversWholeDocument(nombre))
                return false;

            var firma = campos.VerifySignature(nombre);

            if (!firma.Verify())
                return false;

            foreach (var certificadoDocumento in firma.Certificates) {

                foreach (var certificadoDeConfianza in certificado.Chain) {
                    try {
                        certificadoDocumento.Verify(certificadoDeConfianza.GetPublicKey());
                        // Si llega hasta aquí, es porque la última firma fue realizada 
                        // con el certificado del sistema.
                        return true;
                    } catch (InvalidKeyException) {
                        continue;
                    } catch (Exception ex) {
                        Trace.TraceError("Error: {0}", ex);
                        continue;
                    }
                }
            }

            return false;
        }
    }
}
```

Por último, como podrán notar, ambas clases dependen de `Certificado` que es una clase que permite extraer el certificado y la llave privada del archivo .pfx que se generó al principio, la implmentación de esta clase puede quedar algo así:

```csharp
using System;
using System.IO;
using System.Linq;
using Org.BouncyCastle.Crypto;
using Org.BouncyCastle.Pkcs;
using Org.BouncyCastle.X509;

namespace FirmaElectronica
{
    public class Certificado
    {
        public AsymmetricKeyParameter Key { get; private set; }

        public X509Certificate[] Chain { get; private set; }

        public Certificado(string rutaCompletaDelPfx, string claveDelPfx = null)
        {
            using (var file = File.OpenRead(rutaCompletaDelPfx)) {
                var password = claveDelPfx?.ToCharArray() ?? new char[] { /* password en blanco */ };
                var store = new Pkcs12Store(file, password);
                var alias = GetCertificateAlias(store);

                Key = store.GetKey(alias).Key;
                Chain = store.GetCertificateChain(alias).Select(x => x.Certificate).ToArray();
            }
        }

        private static string GetCertificateAlias(Pkcs12Store store)
        {
            foreach (string currentAlias in store.Aliases) {
                if (store.IsKeyEntry(currentAlias)) {
                    return currentAlias;
                }
            }

            return null;
        }
    }
}
```

Por último, para firmar un documento con el certificado generado, el código podría verse como el siguiente:

```csharp
var certificado = new Certificado(@"c:\demos\certificado.pfx");
var firmante = new Firmante(certificado);
firmante.Firmar(@"c:\demos\documento.pdf", @"c:\demos\documento-firmado.pdf");
```

Para validar que el documento se encuentra firmado e íntegro desde que se firmó:

```csharp
var certificado = new Certificado(@"c:\demos\certificado.pfx");
var notario = new Notario(certificado);
var documentoValido = notario.CertificarDocumento(@"c:\demos\documento-firmado.pdf");

if (documentoValido)
    Console.WriteLine("Documento firmado por el sistema y no ha sufrido modificaciones");
else
    Console.WriteLine("El documento no se pudo validar");
```

Espero este post sea de utilidad. Y recuerden cualquier comentario es bienvenido, si hay algo en lo que me haya equivocado no duden en dejar su comentario y lo corregiré en cuanto pueda.

Si desean ver el código completo con un certificado generado lo pueden ver en mi [repositorio de ejemplos](https://github.com/miguelerm/samples) en el directorio [/dotnet/FirmaElectronica](https://github.com/miguelerm/samples/tree/master/dotNet/FirmaElectronica).

Saludos,
Mike
