# Contact2web

# Conect2web

Plugin JavaScript para añadir un botón flotante de contacto con QR y formulario dinámico para WhatsApp.

## Instalación

Incluye estas líneas **antes** de cerrar tu `<body>`:

```html
<!-- 1) (Opcional) Personaliza los valores por defecto -->
<script>
  window.Conect2webConfig = {
    whatsappNumber: '506123456789',               // tu número de WhatsApp
    qrSize: 180,                                 // tamaño del QR
    position: { bottom: '30px', right: '30px' }, // posición del botón
    colors: {
      buttonBg: '#25D366',   // verde WhatsApp
      buttonIcon: '#ffffff', // icono blanco
      panelBg: '#ffffff'     // fondo del panel
    },
    infoText: 'Escribe tus dudas aquí y te responderemos pronto.' 
  };
</script>

<!-- 2) Carga el bundle -->
<script src="dist/contact2web.js"></script>


Todos los valores que puedes sobreescribir están en window.Conect2webConfig:

| Opción              | Descripción                                                | Valor por defecto                                                              |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `whatsappNumber`    | Número de WhatsApp (código país + número, sin `+`)         | `"50625116680"`                                                                |
| `qrSize`            | Tamaño del QR generado (px)                                | `200`                                                                          |
| `position`          | Posición del botón flotante                                | `{ bottom: '20px', right: '20px' }`                                            |
| `colors.buttonBg`   | Color de fondo del botón y del botón “Enviar por WhatsApp” | `"#25D366"`                                                                    |
| `colors.buttonIcon` | Color del icono del botón flotante                         | `"#ffffff"`                                                                    |
| `colors.panelBg`    | Color de fondo del panel desplegable                       | `"#ffffff"`                                                                    |
| `infoText`          | Texto que aparece entre el QR y el formulario              | `"Si tienes dudas sobre nuestros sistemas puedes escribir y te resolveremos."` |
