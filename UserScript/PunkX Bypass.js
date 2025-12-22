// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    punkX-bypass-exclusive


// @version      2.0
// @description  Automatische Key-Kopierung ohne Klick-System
// @author       Mw_Anonymous | TheRealBanHammer

// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js


// @match        https://pandadevelopment.net/getkey?*
// @match        https://pandadev.net/getkey?*
// @match        https://linkvertise.com/*
// @match        https://short-jambo.com/*
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*


// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard


// @connect      *


// @run-at       document-start
// ==/UserScript==

console.log('[Pangdev ULTRA] Automatischer Copy-Button-Klick geladen');

// === SYSTEM ZUR ERKENNUNG UND AUTOMATISCHEM KLICK AUF COPY BUTTON ===

class PunkXUltraExtractor {
    constructor() {
        this.hasCopied = false;
        // Prueft auf das spezifische Format "Punkx - XXXXXX"
        this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
    }

    async start() {
        if (this.hasCopied) return;
        
        console.log('[Pangdev ULTRA] Suche nach Copy-Button...');
        
        // Warte bis der Copy-Button garantiert geladen ist
        const copyButton = await this.waitForCopyButton();
        
        if (copyButton) {
            await this.clickCopyButton(copyButton);
        } else {
            console.warn('[Pangdev ULTRA] Copy-Button nicht gefunden, versuche Fallback');
            this.fallbackManualExtract();
        }
    }

    // Wartet bis der Copy-Button im DOM erscheint
    waitForCopyButton() {
        return new Promise(resolve => {
            let attempts = 0;
            const maxAttempts = 50; // 5 Sekunden Timeout
            
            const check = () => {
                attempts++;
                
                // Versucht den Button ueber verschiedene Selektoren zu finden
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

    // Findet den Copy-Button durch mehrere Selektoren
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
                // Spezielle Behandlung fuer :contains da es nicht standard ist
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
                        // Pruefe ob das Element sichtbar und aktiviert ist
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

    // Fuehrt einen natuerlichen Klick auf den Button aus
    async clickCopyButton(button) {
        try {
            console.log('[Pangdev ULTRA] Klicke auf Copy-Button:', button.tagName, button.className);
            
            // Erstelle natuerliches Klick-Event
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0
            });
            
            button.dispatchEvent(clickEvent);
            
            // Warte kurz und pruefe ob Key wirklich kopiert wurde
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
                    
                    // Sicherheitskopie mit GM_setClipboard
                    await GM_setClipboard(clipboardText);
                } else {
                    // Wenn Klick nicht funktioniert hat, nutze Fallback
                    console.warn('[Pangdev ULTRA] Klick hat nicht funktioniert, nutze Fallback');
                    this.fallbackExtractFromButton(button);
                }
            }, 300);
            
        } catch (e) {
            console.error('[Pangdev ULTRA] Fehler beim Klicken:', e);
            this.fallbackManualExtract();
        }
    }

    // Fallback: Extrahiert Key direkt aus data-clipboard-text Attribut
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

    // Letzter Fallback: Manuelle Extraktion aus dem DOM
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

// === ADSPOOF UND LVDL FUNKTIONEN (VOLLSTAENDIG) ===

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
    // Starte den ULTRA-KeyExtractor (Klick-Methode)
    const keyCopier = new PunkXUltraExtractor();
    keyCopier.start();

    // Entferne Anti-Adblock-Overlays
    let antiAdblockRemover = setInterval(() => {
        const antiAdblock = document.querySelector('.adblock_title');
        if (antiAdblock) {
            antiAdblock.closest('body > *')?.remove();
            clearInterval(antiAdblockRemover);
            console.log('[Pangdev ULTRA] Anti-Adblock entfernt');
        }
    }, 500);

    // Interne Funktion zum Abrufen des Ad-Links aus Formular
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

    // Interne Funktion zum Dekodieren der Ziel-URL aus Ad-Links
    function getDestUrl(link) {
        const url = new URL(encodeURI(link));
        switch (url.hostname) {
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

    // Service-spezifische Wartezeiten fuer Ad-Simulation (in Millisekunden)
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

        const adUrl = await getAdLink();
        const dest = getDestUrl(adUrl);
        
        if (!dest) {
            // Kein Ziel gefunden, direkt zur Key-Seite
            window.location.assign(`https://pangdev.net/getkey?hwid=${hwid}&service=${service}`);
            return;
        }

        // Simuliere Ad-Wartezeit je nach Service
        await sleep(customSleepTimes[service] || 3000);
        
        console.log('[Pangdev ULTRA] Simuliere Ad-Ansicht...');
        notification(`Level abgeschlossen (${service})`, 3000);
        
        await sleep(3000);

        // Konstruiere naechsten Checkpoint-URL
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
    
    // Versuche zuerst LVDL-Weiterleitung fuer Ad-Links
    const handledByLvdl = await lvdl();
    if (handledByLvdl) return;
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('pandadev')) {
        notification('ULTRA AutoCopy aktiviert', 3000);
        await pandadevelopment();
    } else if (hostname.includes('linkvertise.com') || 
               hostname.includes('loot-link') || 
               hostname.includes('short-jambo.com')) {
        notification('Verarbeite Ad-Link...', 2000);
    }
})();
    
