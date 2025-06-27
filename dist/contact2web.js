/*!
 * Conect2web v1.0.2
 * Plugin JavaScript para añadir un botón flotante de contacto con QR y formulario dinámico para WhatsApp.
 *
 * Configuración:
 * - whatsappNumber: número de WhatsApp (código país + número, sin '+').
 * - qrSize: tamaño del código QR en píxeles.
 * - position.bottom/right: posición del botón flotante.
 * - colors.buttonBg: color de fondo del botón y del botón enviar.
 * - colors.buttonIcon: color del icono del botón flotante.
 * - colors.panelBg: color de fondo del panel desplegable.
 * - infoText: texto informativo entre el QR y el formulario.
 *
 * Uso:
 * <script>
 *   window.Conect2webConfig = {
 *     whatsappNumber: '506123456789',
 *     infoText: 'Escribenos tus dudas aquí y responderemos pronto.'
 *   };
 * </script>
 * <script src="dist/contact2web.js"></script>
 *
 * © 2025 Esteban López – MIT License
 */
;(function(window, document) {
  'use strict';

  // === CONFIGURACIÓN INICIAL ===
  const defaults = {
    whatsappNumber: '506123456789',
    qrSize: 200,
    position: { bottom: '20px', right: '20px' },
    colors: {
      buttonBg:   '#25D366',   // verde WhatsApp
      buttonIcon: '#ffffff',   // icono blanco
      panelBg:    '#ffffff'
    },
    infoText: 'Si tienes dudas sobre nuestros sistemas puedes escribir y te resolveremos.'
  };

  // Leer configuración de usuario (window.Conect2webConfig)
  const userCfg = window.Conect2webConfig || {};
  const CONFIG = {
    ...defaults,
    ...userCfg,
    position: { ...defaults.position, ...(userCfg.position || {}) },
    colors:   { ...defaults.colors,   ...(userCfg.colors   || {}) },
    infoText: ('infoText' in userCfg) ? userCfg.infoText : defaults.infoText
  };

  // === UTILIDADES ===
  function makeEl(tag, attrs = {}, parent) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (parent) parent.appendChild(el);
    return el;
  }

  // Genera la URL base de WhatsApp
  function baseWhatsAppURL() {
    return `https://wa.me/${CONFIG.whatsappNumber}`;
  }

  // === ESTILOS DINÁMICOS ===
  const css = `
    #c2w-button {
      position: fixed;
      bottom: ${CONFIG.position.bottom};
      right:  ${CONFIG.position.right};
      width:  56px;
      height: 56px;
      border-radius: 50%;
      background: ${CONFIG.colors.buttonBg};
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 99999;
    }
    #c2w-button svg {
      width:28px; height:28px;
      fill:${CONFIG.colors.buttonIcon};
      margin:14px;
    }
    #c2w-panel {
      position: fixed;
      bottom: calc(${CONFIG.position.bottom} + 72px);
      right:  ${CONFIG.position.right};
      width:  280px;
      background: ${CONFIG.colors.panelBg};
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      display: none;
      z-index: 99999;
      font-family: sans-serif;
    }
    #c2w-panel img {
      display: block;
      margin: 0 auto 12px;
    }
    #c2w-panel p {
      margin: 12px 0;
      font-size: 14px;
      color: #333;
      line-height: 1.4;
    }
    #c2w-panel textarea,
    #c2w-panel input[type="text"],
    #c2w-panel input[type="email"] {
      width: 100%;
      margin-bottom: 8px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 14px;
    }
    #c2w-panel button {
      background: ${CONFIG.colors.buttonBg};
      color: #fff;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
    }
  `;
  makeEl('style', {}, document.head).textContent = css;

  // === CREAR BOTÓN FLOTANTE ===
  const btn = makeEl('div', { id: 'c2w-button', title: 'Contáctanos' }, document.body);
  btn.innerHTML = `
    <svg viewBox="0 0 448 512" aria-hidden="true" role="img">
      <path fill="${CONFIG.colors.buttonIcon}" d="M380.9 97.1c-37.5-37.5-87.3-58.1-140.9-58.1-53.6 0-103.4 20.6-140.9 58.1C61.6 134.6 41 184.4 41 238c0 43.7 12.1 86.7 35.1 123.2L38.7 453l93.9-37.3c34 19.1 72.2 29.2 112.4 29.2 52.3 0 102-20.6 139.5-58.1 37.5-37.5 58.1-87.2 58.1-139.5 0-53.6-20.6-103.4-58.1-140.9zm-126.5 284.1c-28.1 0-55.3-7.5-79.2-21.7l-5.7-3.4-55.7 22.1 18.7-54.2-3.7-5.9c-13.3-21-20.2-45.2-20.2-69.8 0-80.6 65.6-146.2 146.2-146.2 39 0 75.5 15.2 103.1 42.8 27.6 27.6 42.8 64.1 42.8 103.1.1 80.7-65.5 146.3-146.2 146.3zm77.3-105.1c-4.2-2.1-24.8-12.2-28.6-13.6-3.8-1.4-6.6-2.1-9.4 2.1-2.8 4.2-10.8 13.6-13.2 16.4-2.4 2.8-4.8 3.2-9 1.1-26.4-13.2-43.6-23.6-61.1-53.7-4.6-7.9 4.6-7.4 13.2-24.6 1.4-2.8.7-5.3-.3-7.4-1-2.1-9.4-22.7-12.9-31.2-3.4-8.2-7-7.1-9.4-7.2-2.4-.1-5.3-.1-8.1-.1-2.8 0-7.4 1-11.3 5.3-3.8 4.2-14.5 21.7-14.5 52.9s14.6 61.4 16.6 65.7c2.1 4.2 28.2 43 68.4 60.3 9.6 4.1 17.1 6.6 22.9 8.4 9.6 3.1 18.4 2.7 25.3 1.6 7.7-1.2 24.8-10.1 28.3-19.8 3.5-9.7 3.5-18 2.4-19.8-1.1-1.8-4.1-2.8-8.3-4.9z"/>
    </svg>
  `;

  // === CREAR PANEL DESPLEGABLE ===
  const panel = makeEl('div', { id: 'c2w-panel' }, document.body);

  // QR de WhatsApp
  makeEl('img', {
    src: `https://api.qrserver.com/v1/create-qr-code/?size=${CONFIG.qrSize}x${CONFIG.qrSize}&data=${encodeURIComponent(baseWhatsAppURL())}`,
    alt: 'QR WhatsApp'
  }, panel);

  // Texto informativo (configurable)
  const infoP = makeEl('p', {}, panel);
  infoP.textContent = CONFIG.infoText;

  // Campos del formulario
  const textarea = makeEl('textarea', { placeholder: 'Tu pregunta…' }, panel);
  const inputName = makeEl('input',    { type: 'text',  placeholder: 'Tu nombre'  }, panel);
  const inputEmail= makeEl('input',    { type: 'email', placeholder: 'Tu correo'  }, panel);
  const submitBtn = makeEl('button', {}, panel);
  submitBtn.textContent = 'Enviar por WhatsApp';

  // === EVENTOS DE INTERACCIÓN ===
  btn.addEventListener('click', () => {
   	panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  });

  submitBtn.addEventListener('click', () => {
    const pregunta = textarea.value.trim();
    const nombre   = inputName.value.trim();
    const correo   = inputEmail.value.trim();
    if (!pregunta || !nombre || !correo) {
      alert('Completa todos los campos antes de enviar.');
      return;
    }
    const text = encodeURIComponent(
      `📩 *Nueva consulta desde tu web*\n` +
      `*Nombre:* ${nombre}\n` +
      `*Correo:* ${correo}\n` +
      `*Pregunta:* ${pregunta}`
    );
    window.open(`${baseWhatsAppURL()}?text=${text}`, '_blank');
  });

})(window, document);
