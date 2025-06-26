/*! 
 * Conect2web v1.0.0
 * Plugin JavaScript para añadir un botón flotante de contacto con QR a WhatsApp.
 * © 2025 Esteban López <estebanlopez.info> – MIT License
 */
;(function(window, document) {
  'use strict';
  const defaults = {
    whatsappNumber: '50612345678',                // número WhatsApp (código país + número, sin '+')
    defaultMessage: '¡Hola! Tengo una duda sobre sus sistemas.', // mensaje predeterminado
    qrSize: 200,                                  // tamaño del QR en px
    position: { bottom: '20px', right: '20px' },  // lugar fijo en pantalla
    colors: {
      buttonBg: '#ff5b67',                        // fondo del botón flotante
      buttonIcon: '#fff',                         // color del icono
      panelBg: '#fff'                             // fondo del panel desplegable
    }
  };
  const userCfg = window.Conect2webConfig || {};
  // Mezclar configuraciones profundamente
  const CONFIG = {
    ...defaults,
    ...userCfg,
    position: { ...defaults.position, ...(userCfg.position || {}) },
    colors:   { ...defaults.colors,   ...(userCfg.colors   || {}) }
  };

  // === UTILITIES ===
  function makeEl(tag, attrs = {}, parent) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (parent) parent.appendChild(el);
    return el;
  }

  function buildWhatsAppURL() {
    const text = encodeURIComponent(CONFIG.defaultMessage);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
  }

  function buildQRCodeURL() {
    const link = buildWhatsAppURL();
    return `https://api.qrserver.com/v1/create-qr-code/?size=${CONFIG.qrSize}x${CONFIG.qrSize}&data=${encodeURIComponent(link)}`;
  }

  // === INYECTAR ESTILOS DINÁMICOS ===
  const css = `
    #c2w-button {
      position: fixed;
      bottom: ${CONFIG.position.bottom};
      right:  ${CONFIG.position.right};
      width:  56px; height: 56px;
      border-radius: 50%;
      background: ${CONFIG.colors.buttonBg};
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      cursor: pointer;
      z-index: 99999;
    }
    #c2w-button svg {
      width: 28px; height: 28px;
      fill: ${CONFIG.colors.buttonIcon};
      margin: 14px;
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
    #c2w-panel img {
      display: block;
      margin: 0 auto 12px;
    }
    #c2w-panel button {
      background: ${CONFIG.colors.buttonBg};
      color: #fff;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
  `;
  const styleTag = makeEl('style', {}, document.head);
  styleTag.textContent = css;

  // === CREAR BOTÓN FLOTANTE ===
  const btn = makeEl('div', { id: 'c2w-button', title: 'Contáctanos' }, document.body);
  btn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 5.58 2 10c0 1.86.84 3.58 2.35 4.9L4 22l6.24-2.58C11.1 19.5 11.54 19.54 12 19.54c5.52 0 10-3.58 10-8S17.52 2 12 2z"/>
    </svg>`;

  // === CREAR PANEL DESPLEGABLE ===
  const panel = makeEl('div', { id: 'c2w-panel' }, document.body);
  // Código QR
  makeEl('img', { src: buildQRCodeURL(), alt: 'QR WhatsApp' }, panel);
  // Formulario
  const textarea = makeEl('textarea', { placeholder: 'Tu mensaje...' }, panel);
  const inputName = makeEl('input',   { type: 'text',    placeholder: 'Tu nombre'  }, panel);
  const inputEmail= makeEl('input',   { type: 'email',   placeholder: 'Tu correo'  }, panel);
  const submitBtn = makeEl('button',   {}, panel);
  submitBtn.textContent = 'Enviar';

  // === LÓGICA DE EVENTOS ===
  btn.addEventListener('click', () => {
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  });

  submitBtn.addEventListener('click', () => {
    if (!textarea.value || !inputName.value || !inputEmail.value) {
      alert('Por favor completa todos los campos.');
      return;
    }
    // Enviar datos a tu endpoint
    fetch('https://tuservidor.com/api/contacto', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: textarea.value,
        nombre:  inputName.value,
        correo:  inputEmail.value
      })
    })
    .then(res => {
      if (res.ok) {
        alert('¡Mensaje enviado!');
        textarea.value = inputName.value = inputEmail.value = '';
      } else {
        return Promise.reject();
      }
    })
    .catch(() => alert('Error al enviar. Intenta más tarde.'));
  });
})(window, document);
