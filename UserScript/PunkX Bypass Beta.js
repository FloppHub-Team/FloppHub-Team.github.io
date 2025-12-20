// ==UserScript==
// @name         PunkX & Pandadev Bypass - kys.linkvertise.lol Edition
// @namespace    punkX-bypass-kys-edition
// @version      2.0
// @description  Bypass completamente automatizado para kys.linkvertise.lol con spoofing de referer
// @author       Mw_Anonymous | TheRealBanHammer
// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @match        https://pandadevelopment.net/getkey?*
// @match        https://pandadev.net/getkey?*
// @match        https://kys.linkvertise.lol/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-start
// ==/UserScript==

console.log('[Pangdev ULTRA] Script kys.linkvertise.lol Edition cargado');

// === CLASE PRINCIPAL EXTRACTORA ===
class PunkXUltraExtractor {
    constructor() {
        this.hasCopied = false;
        this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
    }

    async start() {
        if (this.hasCopied) return;
        console.log('[Pangdev ULTRA] Buscando botón de copia...');
        
        const copyButton = await this.waitForCopyButton();
        if (copyButton) {
            await this.clickCopyButton(copyButton);
        } else {
            console.warn('[Pangdev ULTRA] Botón no encontrado, usando fallback');
            this.fallbackManualExtract();
        }
    }

    waitForCopyButton() {
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 50;
            
            const check = () => {
                attempts++;
                const button = this.findCopyButton();
                
                if (button) {
                    console.log('[Pangdev ULTRA] Botón encontrado después de', attempts, 'intentos');
                    resolve(button);
                } else if (attempts >= maxAttempts) {
                    console.error('[Pangdev ULTRA] Timeout esperando botón');
                    resolve(null);
                } else {
                    setTimeout(check, 100);
                }
            };
            
            check();
        });
    }

    findCopyButton() {
        const selectors = [
            'button:contains("Copy Key")', 'button:contains("copy key")', 'button:contains("Copy")',
            'input[type="button"]:contains("Copy")', '.copy-key-btn', '#copy-key-btn',
            '.btn-copy', '.copy-button', '[class*="copy"]', '[id*="copy"]', 'button[data-clipboard-text]'
        ];

        for (let selector of selectors) {
            try {
                if (selector.includes(':contains')) {
                    const parts = selector.split(':contains');
                    const baseSelector = parts[0];
                    const text = parts[1].replace(/[()]/g, '');
                    const elements = document.querySelectorAll(baseSelector);
                    for (let el of elements) {
                        if (el.textContent.toLowerCase().includes(text.toLowerCase())) {
                            return el;
                        }
                    }
                } else {
                    const element = document.querySelector(selector);
                    if (element && this.isElementVisible(element)) {
                        return element;
                    }
                }
            } catch (e) {}
        }
        return null;
    }

    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && !element.disabled;
    }

    async clickCopyButton(button) {
        try {
            console.log('[Pangdev ULTRA] Haciendo clic en botón:', button.tagName, button.className);
            
            const clickEvent = new MouseEvent('click', {
                view: window, bubbles: true, cancelable: true, button: 0
            });
            
            button.dispatchEvent(clickEvent);
            
            setTimeout(async () => {
                const clipboardText = await navigator.clipboard.readText().catch(() => '');
                if (clipboardText && this.keyPattern.test(clipboardText)) {
                    this.hasCopied = true;
                    GM_notification({
                        text: `Key copiado: ${clipboardText}`,
                        title: "Pangdev ULTRA",
                        timeout: 4000
                    });
                    console.log('[Pangdev ULTRA] Key copiado exitosamente');
                    await GM_setClipboard(clipboardText);
                } else {
                    console.warn('[Pangdev ULTRA] Clic fallido, usando fallback');
                    this.fallbackExtractFromButton(button);
                }
            }, 300);
            
        } catch (e) {
            console.error('[Pangdev ULTRA] Error al hacer clic:', e);
            this.fallbackManualExtract();
        }
    }

    fallbackExtractFromButton(button) {
        const dataKey = button.getAttribute('data-clipboard-text') || button.getAttribute('data-key');
        if (dataKey && this.keyPattern.test(dataKey)) {
            GM_setClipboard(dataKey);
            this.hasCopied = true;
            GM_notification({
                text: `Key copiado (fallback): ${dataKey}`,
                title: "Pangdev ULTRA",
                timeout: 4000
            });
            console.log('[Pangdev ULTRA] Key copiado via data-attribute');
        } else {
            this.fallbackManualExtract();
        }
    }

    fallbackManualExtract() {
        console.log('[Pangdev ULTRA] Extracción manual iniciada');
        const elements = document.querySelectorAll('div, span, p, code, pre, input, textarea');
        for (let el of elements) {
            const text = (el.textContent || el.value || '').trim();
            const match = text.match(this.keyPattern);
            if (match) {
                GM_setClipboard(match[0]);
                this.hasCopied = true;
                GM_notification({
                    text: `Key extraído: ${match[0]}`,
                    title: "Pangdev ULTRA",
                    timeout: 4000
                });
                console.log('[Pangdev ULTRA] Key encontrado en DOM');
                return;
            }
        }
        console.error('[Pangdev ULTRA] Todas las extracciones fallaron');
        GM_notification({
            text: "Error: No se pudo copiar el key",
            title: "Pangdev ULTRA",
            timeout: 5000
        });
    }
}

// === FUNCIONES AYUDANTES ===
function handleError(error) {
    const errorText = error.message || error;
    console.error('[Pangdev ULTRA] ERROR:', errorText);
    GM_notification({
        text: `ERROR: ${errorText}`,
        title: "Pangdev ULTRA",
        silent: true,
        timeout: 5000
    });
}

function notification(message, timeout = 3000) {
    GM_notification({
        text: message,
        title: "Pangdev ULTRA",
        silent: true,
        timeout: timeout
    });
    console.log('[Pangdev ULTRA] NOTIFICACIÓN:', message);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function adSpoof(url, referrer) {
    return new Promise((resolve, reject) => {
        console.log('[Pangdev ULTRA] adSpoof() redirigiendo a:', url);
        console.log('[Pangdev ULTRA] Spoofeando referer como:', referrer);
        
        // Hacer petición con referer spoofeado
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            anonymous: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; GO3C Build/OPM2.171019.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.141 Mobile Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Referer": referrer, // Este es el key para engañar a pandadev
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate"
            },
            onload: function(response) {
                // Redirigir realmente después de spoofear
                window.location.href = url;
                resolve();
            },
            onerror: reject
        });
    });
}

// === LÓGICA PRINCIPAL PANDADEV ===
async function pandadevelopment() {
    // Guardar URL de retorno cuando provider=linkvertise
    const currentUrl = new URL(window.location.href);
    const provider = currentUrl.searchParams.get('provider');
    const hwid = currentUrl.searchParams.get('hwid');
    
    if (provider === 'linkvertise' && hwid) {
        // Construir URL de retorno SIN provider
        const baseUrl = `${currentUrl.origin}${currentUrl.pathname}`;
        const searchParams = new URLSearchParams();
        searchParams.set('service', currentUrl.searchParams.get('service'));
        searchParams.set('hwid', hwid);
        if (currentUrl.searchParams.get('sessiontoken')) {
            searchParams.set('sessiontoken', currentUrl.searchParams.get('sessiontoken'));
        }
        const returnUrl = `${baseUrl}?${searchParams.toString()}`;
        
        // Guardar en almacenamiento persistente
        GM_setValue('pandadev_return_url', returnUrl);
        GM_setValue('pandadev_hwid', hwid);
        console.log('[Pangdev ULTRA] URL de retorno guardada:', returnUrl);
        console.log('[Pangdev ULTRA] HWID guardado:', hwid);
        
        notification('Bypass kys.linkvertise.lol preparado', 3000);
        
        // No continuar con la lógica normal, esperar redirección manual
        return;
    }

    // INICIAR AUTO-COPY
    const keyCopier = new PunkXUltraExtractor();
    keyCopier.start();

    // Remover anti-adblock
    let antiAdblockRemover = setInterval(() => {
        const antiAdblock = document.querySelector('.adblock_title');
        if (antiAdblock) {
            antiAdblock.closest('body > *')?.remove();
            clearInterval(antiAdblockRemover);
            console.log('[Pangdev ULTRA] Anti-Adblock removido');
        }
    }, 500);

    // Lógica de bypass normal (para otros casos)
    const customSleepTimes = {
        'vegax': 11000,
        'laziumtools': 11000,
        'adelhub': 11000,
        'neoxkey': 16000,
    };

    try {
        const hwidParam = currentUrl.searchParams.get('hwid');
        const service = currentUrl.searchParams.get('service');
        const token = currentUrl.searchParams.get('sessiontoken');

        if (!hwidParam || !service) {
            console.log('[Pangdev ULTRA] Faltan parámetros, esperando redirección');
            return;
        }

        console.log('[Pangdev ULTRA] URL-Parameter:', { hwidParam, service, token });

        const adUrl = await getAdLink();
        const dest = await getDestUrl(adUrl);
        
        if (!dest) {
            console.log('[Pangdev ULTRA] No hay destino, ya en página final');
            return;
        }

        await sleep(customSleepTimes[service] || 3000);
        notification(`Level completado (${service})`, 3000);
        await sleep(3000);

        let nextCheckpoint = `https://pangdev.net/getkey?hwid=${hwidParam}&service=${service}`;
        if (token) nextCheckpoint += `&sessiontoken=${token}`;
        
        console.log('[Pangdev ULTRA] Redirigiendo a:', nextCheckpoint);
        window.location.assign(nextCheckpoint);
    } catch (e) {
        handleError(e);
    }
}

function getAdLink() {
    const form = document.querySelector('form');
    if (!form) return Promise.reject('Formulario no encontrado');
    
    const data = new FormData(form);
    return new Promise((resolve, reject) => {
        GM.xmlhttpRequest({
            method: "POST",
            url: form.action,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': window.location.href,
            },
            data: new URLSearchParams(data),
            onload: (response) => resolve(response.finalUrl),
            onerror: reject
        });
    });
}

function getDestUrl(link) {
    const url = new URL(encodeURI(link));
    switch (url.hostname) {
        case 'linkvertise.com':
            const r = url.searchParams.get('r');
            if (!r) return false;
            return atob(r);
        case 'short-jambo.com':
            const parts = url.search.split('&url=');
            if (parts.length < 2) return false;
            return parts[1];
        default:
            return false;
    }
}

// === DETECTAR KYS.LINKVERTISE.LOL Y REDIRIGIR ===
async function handleKysLinkvertise() {
    const url = new URL(window.location.href);
    
    // Verificar si estamos en kys.linkvertise.lol
    if (!url.hostname.includes('kys.linkvertise.lol')) return false;
    
    console.log('[Pangdev ULTRA] kys.linkvertise.lol detectado');
    
    // Extraer HWID del path
    const pathMatch = url.pathname.match(/\/TaskStarted\/([a-f0-9-]+)/i);
    if (!pathMatch) {
        console.error('[Pangdev ULTRA] No se pudo extraer HWID de la ruta');
        notification('Error: HWID no encontrado en URL', 5000);
        return false;
    }
    
    const hwid = pathMatch[1];
    console.log('[Pangdev ULTRA] HWID extraído:', hwid);
    
    // Recuperar URL guardada de pandadev
    const returnUrl = GM_getValue('pandadev_return_url');
    const savedHwid = GM_getValue('pandadev_hwid');
    
    if (!returnUrl || savedHwid !== hwid) {
        console.error('[Pangdev ULTRA] No hay URL guardada o HWID no coincide');
        console.error('[Pangdev ULTRA] Guardada:', returnUrl, 'HWID:', savedHwid);
        notification('Error: No hay sesión guardada', 5000);
        return false;
    }
    
    console.log('[Pangdev ULTRA] URL de retorno encontrada:', returnUrl);
    
    // NOTIFICACIÓN de bypass
    notification(`Bypass ejecutado: ${hwid.substring(0, 8)}...`, 4000);
    
    // IMPORTANTE: Spoofear el referer como kys.linkvertise.lol antes de redirigir
    const spoofedReferer = window.location.href; // Esto será "https://kys.linkvertise.lol/TaskStarted/XXX?antibypass=true"
    
    // Limpiar valores guardados (una sola vez)
    GM_setValue('pandadev_return_url', null);
    GM_setValue('pandadev_hwid', null);
    
    // Redirigir con spoofing de referer
    await adSpoof(returnUrl, spoofedReferer);
    return true;
}

// === INICIALIZACIÓN AUTOMÁTICA ===
(async function() {
    const hostname = window.location.hostname;
    console.log('[Pangdev ULTRA] Inicializando en:', hostname);
    
    // 1. Primero, verificar si estamos en kys.linkvertise.lol
    if (hostname.includes('kys.linkvertise.lol')) {
        const handled = await handleKysLinkvertise();
        if (handled) return; // Salir si ya redirigimos
    }
    
    // 2. Si estamos en pandadev, ejecutar lógica principal
    if (hostname.includes('pandadev')) {
        notification('ULTRA AutoCopy activado', 2000);
        await pandadevelopment();
    }
})();
