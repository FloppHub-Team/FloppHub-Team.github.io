// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    punkX-bypass-exclusive
// @version      2.4
// @description  Automatische Key-Kopierung mit Linkvertise-Lol Bypass
// @author       Mw_Anonymous | TheRealBanHammer
// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @match        https://pandadevelopment.net/getkey?*
// @match        https://pandadev.net/getkey?*
// @match        https://kys.linkvertise.lol/*
// @match        https://short-jambo.com/*
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-start
// ==/UserScript==

console.log('[Pangdev ULTRA] Automatischer Copy-Button-Klick geladen');

// === SYSTEM ZUR ERKENNUNG UND AUTOMATISCHEM KLICK AUF COPY BUTTON ===

class PunkXUltraExtractor {
    constructor() {
        this.hasCopied = false;
        this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
    }

    async start() {
        if (this.hasCopied) return;
        
        console.log('[Pangdev ULTRA] Suche nach Copy-Button...');
        
        const copyButton = await this.waitForCopyButton();
        
        if (copyButton) {
            await this.clickCopyButton(copyButton);
        } else {
            console.warn('[Pangdev ULTRA] Copy-Button nicht gefunden, versuche Fallback');
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
                    console.log('[Pangdev ULTRA] Copy-Button gefunden nach', attempts, 'Versuchen');
                    resolve(button);
                } else if (attempts >= maxAttempts) {
                    console.error('[Pangdev ULTRA] Timeout: Copy-Button nicht gefunden');
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
            'button:contains("Copy Key")',
            'button:contains("copy key")',
            'button:contains("Copy")',
            'input[type="button"]:contains("Copy")',
            '.copy-key-btn',
            '#copy-key-btn',
            '.btn-copy',
            '.copy-button',
            '[class*="copy"]',
            '[id*="copy"]',
            'button[data-clipboard-text]'
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
                    if (element) {
                        const style = window.getComputedStyle(element);
                        if (style.display !== 'none' && 
                            style.visibility !== 'hidden' && 
                            !element.disabled) {
                            return element;
                        }
                    }
                }
            } catch (e) {
                // Ignoriere Selektor-Fehler
            }
        }

        return null;
    }

    async clickCopyButton(button) {
        try {
            console.log('[Pangdev ULTRA] Klicke auf Copy-Button:', button.tagName, button.className);
            
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0
            });
            
            button.dispatchEvent(clickEvent);
            
            setTimeout(async () => {
                const clipboardText = await navigator.clipboard.readText().catch(() => '');
                if (clipboardText && this.keyPattern.test(clipboardText)) {
                    this.hasCopied = true;
                    GM_notification({
                        text: `Key automatisch kopiert: ${clipboardText}`,
                        title: "Pangdev ULTRA",
                        timeout: 4000
                    });
                    console.log('[Pangdev ULTRA] Key erfolgreich ueber Button-Klick kopiert');
                    
                    await GM_setClipboard(clipboardText);
                } else {
                    console.warn('[Pangdev ULTRA] Klick hat nicht funktioniert, nutze Fallback');
                    this.fallbackExtractFromButton(button);
                }
            }, 300);
            
        } catch (e) {
            console.error('[Pangdev ULTRA] Fehler beim Klicken:', e);
            this.fallbackManualExtract();
        }
    }

    fallbackExtractFromButton(button) {
        const dataKey = button.getAttribute('data-clipboard-text') || 
                       button.getAttribute('data-key');
        
        if (dataKey && this.keyPattern.test(dataKey)) {
            GM_setClipboard(dataKey);
            this.hasCopied = true;
            GM_notification({
                text: `Key ueber Fallback kopiert: ${dataKey}`,
                title: "Pangdev ULTRA",
                timeout: 4000
            });
            console.log('[Pangdev ULTRA] Key ueber data-attribute Fallback kopiert');
        } else {
            this.fallbackManualExtract();
        }
    }

    fallbackManualExtract() {
        console.log('[Pangdev ULTRA] Starte manuelle Extraktion...');
        
        const elements = document.querySelectorAll('div, span, p, code, pre, input, textarea');
        for (let el of elements) {
            const text = (el.textContent || el.value || '').trim();
            const match = text.match(this.keyPattern);
            if (match) {
                GM_setClipboard(match[0]);
                this.hasCopied = true;
                GM_notification({
                    text: `Key manuell kopiert: ${match[0]}`,
                    title: "Pangdev ULTRA",
                    timeout: 4000
                });
                console.log('[Pangdev ULTRA] Key ueber manuelle Extraktion gefunden');
                return;
            }
        }
        
        console.error('[Pangdev ULTRA] Alle Extraktionsmethoden fehlgeschlagen');
        GM_notification({
            text: "Fehler: Key konnte nicht kopiert werden",
            title: "Pangdev ULTRA",
            timeout: 5000
        });
    }
}

// === HELPER-FUNKTIONEN (OPTIMIERT) ===

function handleError(error) {
    const errorText = error.message || error;
    console.error('[Pangdev ULTRA] FEHLER:', errorText);
    GM_notification({
        text: `FEHLER: ${errorText}`,
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
    console.log('[Pangdev ULTRA] BENACHRICHTIGUNG:', message);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// === NEW FUNCTION: BYPASS KYS.LINKVERTISE.LOL ===

async function bypassLinkvertiseLol() {
    // Guardar URL inicial cuando estamos en pandadev con provider
    if (window.location.hostname.includes('pandadev') && 
        window.location.href.includes('provider=') && 
        window.location.href.includes('hwid=')) {
        
        const currentUrl = window.location.href;
        await GM_setValue('pandadev_initial_url', currentUrl);
        console.log('[Pangdev ULTRA] URL principal guardada:', currentUrl);
        return false; // No es un bypass, continuar normal
    }
    
    // Detectar si estamos en kys.linkvertise.lol/TaskStarted/
    if (window.location.hostname === 'kys.linkvertise.lol' && 
        window.location.pathname.includes('/TaskStarted/')) {
        
        console.log('[Pangdev ULTRA] Detectado TaskStarted en kys.linkvertise.lol');
        
        // Recuperar URL guardada
        const storedUrl = await GM_getValue('pandadev_initial_url', null);
        if (!storedUrl) {
            console.error('[Pangdev ULTRA] No se encontró URL principal guardada');
            return false;
        }
        
        try {
            const urlObj = new URL(storedUrl);
            const hwid = urlObj.searchParams.get('hwid');
            const service = urlObj.searchParams.get('service');
            
            if (!hwid || !service) {
                console.error('[Pangdev ULTRA] Parámetros hwid o service faltantes');
                return false;
            }
            
            // Construir nueva URL SIN provider
            let targetUrl = `https://pandadevelopment.net/getkey?service=${service}&hwid=${hwid}`;
            
            // Obtener Task ID para el referer falso
            const pathParts = window.location.pathname.split('/');
            const taskIndex = pathParts.indexOf('TaskStarted');
            let taskId = '';
            if (taskIndex !== -1 && pathParts[taskIndex + 1]) {
                taskId = pathParts[taskIndex + 1];
            }
            
            const fakeReferer = `https://kys.linkvertise.lol/TaskStarted/${taskId}?antibypass=true`;
            
            console.log('[Pangdev ULTRA] Redirigiendo con referer spoof:', fakeReferer);
            console.log('[Pangdev ULTRA] URL destino:', targetUrl);
            
            // Hacer petición con referer falsificado
            GM_xmlhttpRequest({
                method: "GET",
                url: targetUrl,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; GO3C Build/OPM2.171019.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.141 Mobile Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "Referer": fakeReferer,
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate"
                },
                onload: function(response) {
                    notification('Bypass completado - Cargando página...', 3000);
                    
                    // Reemplazar contenido del documento
                    document.open();
                    document.write(response.responseText);
                    document.close();
                    
                    // Actualizar URL en la barra de direcciones
                    window.history.replaceState({}, '', targetUrl);
                    
                    // Limpiar storage para evitar loops
                    GM_setValue('pandadev_initial_url', '');
                    
                    // Re-inicializar script en la nueva página
                    setTimeout(() => {
                        console.log('[Pangdev ULTRA] Re-inicializando extractor...');
                        const keyCopier = new PunkXUltraExtractor();
                        keyCopier.start();
                    }, 1000);
                },
                onerror: function(error) {
                    console.error('[Pangdev ULTRA] Error en spoofed request:', error);
                    // Fallback: redirección normal
                    GM_notification({
                        text: "Bypass falló - Redirigiendo normalmente...",
                        title: "Pangdev ULTRA",
                        timeout: 4000
                    });
                    window.location.href = targetUrl;
                }
            });
            
            return true;
            
        } catch (e) {
            console.error('[Pangdev ULTRA] Error en bypass:', e);
            handleError(e);
            return true; // Indica que manejamos el caso pero con error
        }
    }
    
    return false;
}

// === ADSPOUND UND LVDL FUNKTIONEN (VOLLSTAENDIG) ===

function adSpoof(url, referrer) {
    return new Promise((resolve, reject) => {
        console.log('[Pangdev ULTRA] adSpoof() leitet weiter zu:', url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            anonymous: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; GO3C Build/OPM2.171019.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.141 Mobile Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Referer": referrer,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate"
            },
            onload: function(response) {
                window.location.href = url;
                resolve();
            },
            onerror: reject
        });
    });
}

async function lvdl() {
    const url = new URL(window.location.href);
    const rParam = url.searchParams.get("r");
    
    if (rParam) {
        try {
            const decodedUrl = atob(rParam);
            notification('Umgehe Ad-Link...', 3000);
            await adSpoof(decodedUrl, window.location.hostname);
            return true;
        } catch (e) {
            handleError(e);
            return true;
        }
    }
    
    const urlParam = url.search.split('&url=')[1];
    if (urlParam) {
        await adSpoof(decodeURIComponent(urlParam), window.location.hostname);
        return true;
    }
    
    return false;
}

// === HAUPTFUNKTION MIT VOLLSTAENDIGEM BYPASS-LOGIK ===

async function pandadevelopment() {
    const keyCopier = new PunkXUltraExtractor();
    keyCopier.start();

    let antiAdblockRemover = setInterval(() => {
        const antiAdblock = document.querySelector('.adblock_title');
        if (antiAdblock) {
            antiAdblock.closest('body > *')?.remove();
            clearInterval(antiAdblockRemover);
            console.log('[Pangdev ULTRA] Anti-Adblock entfernt');
        }
    }, 500);

    function getAdLink() {
        const form = document.querySelector('form');
        if (!form) return Promise.reject('Kein Formular gefunden');
        
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
            case 'kys.linkvertise.lol':
            case 'linkvertise.com':
                const r = url.searchParams.get('r');
                if (!r) throw new Error('Kein r-Parameter gefunden');
                return atob(r);
            case 'short-jambo.com':
                const parts = url.search.split('&url=');
                if (parts.length < 2) throw new Error('Kein url-Parameter gefunden');
                return parts[1];
            default:
                if (new URL(window.location.href).searchParams.get('provider')) {
                    return false;
                }
                throw new Error(`Provider nicht unterstützt: ${url.hostname}`);
        }
    }

    const customSleepTimes = {
        'vegax': 11000,
        'laziumtools': 11000,
        'adelhub': 11000,
        'neoxkey': 16000,
    };

    try {
        const currentUrl = new URL(window.location.href);
        const hwid = currentUrl.searchParams.get('hwid');
        const service = currentUrl.searchParams.get('service');
        const token = currentUrl.searchParams.get('sessiontoken');
        const provider = currentUrl.searchParams.get('provider');

        console.log('[Pangdev ULTRA] URL-Parameter:', { hwid, service, token, provider });

        // Si no hay provider, solo extraer key
        if (!provider) {
            console.log('[Pangdev ULTRA] Sin provider, solo extrayendo key...');
            return;
        }

        const adUrl = await getAdLink();
        const dest = getDestUrl(adUrl);
        
        if (!dest) {
            window.location.assign(`https://pangdev.net/getkey?hwid=${hwid}&service=${service}`);
            return;
        }

        await sleep(customSleepTimes[service] || 3000);
        
        console.log('[Pangdev ULTRA] Simuliere Ad-Ansicht...');
        notification(`Level abgeschlossen (${service})`, 3000);
        
        await sleep(3000);

        let nextCheckpoint = `https://pangdev.net/getkey?hwid=${hwid}&service=${service}`;
        if (token) nextCheckpoint += `&sessiontoken=${token}`;
        if (provider) nextCheckpoint += `&provider=${provider}`;
        
        console.log('[Pangdev ULTRA] Weiterleitung zu:', nextCheckpoint);
        window.location.assign(nextCheckpoint);
    } catch (e) {
        handleError(e);
    }
}

// === AUTOMATISCHE INITIALISIERUNG BEI SEITENLADUNG ===

(async function() {
    console.log('[Pangdev ULTRA] INITIALISIERUNG auf:', window.location.hostname);
    
    // PRIMERO: Procesar bypass de linkvertise.lol si aplica
    const bypassHandled = await bypassLinkvertiseLol();
    if (bypassHandled) {
        console.log('[Pangdev ULTRA] Bypass de linkvertise.lol completado');
        return;
    }
    
    // SEGUNDO: Procesar LVDL para otros ad-links
    const handledByLvdl = await lvdl();
    if (handledByLvdl) return;
    
    // TERCERO: Lógica específica por hostname
    const hostname = window.location.hostname;
    
    if (hostname.includes('pandadev')) {
        notification('ULTRA AutoCopy aktiviert', 3000);
        await pandadevelopment();
    } else if (hostname.includes('loot-link') || 
               hostname.includes('short-jambo.com')) {
        notification('Verarbeite Ad-Link...', 2000);
    }
})();
