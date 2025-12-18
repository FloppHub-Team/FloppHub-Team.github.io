// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    punkX-bypass-exclusive


// @version      1.2
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

console.log('[Pangdev ULTRA] Extrem präzise Key-Extraktion geladen');

// === ULTRA PRAZISES SYSTEM ZUR AUTOMATISCHEN KEY-ERKENNUNG ===

class PunkXUltraExtractor {
    constructor() {
        this.hasCopied = false;
        // FLEXIBLER REGEX: Erlaubt "Punkx", "PunkX", Leerzeichen und Bindestrich
        this.keyPattern = /punkx\s*-\s*([a-z0-9]+)/i;
        this.fullKeyPattern = /punkx\s*-\s*[a-z0-9]+/i;
    }

    async start() {
        if (this.hasCopied) return;
        
        console.log('[Pangdev ULTRA] Suche nach Key im "Punkx - XXXXXX" Format...');
        
        // EXTREME WARTEZEIT für langsam ladende Seiten
        await this.waitForKeyElement();
        
        const key = this.extractRealKey();
        
        if (key) {
            await GM_setClipboard(key);
            this.hasCopied = true;
            GM_notification({
                text: `KEY KOPIERT: ${key}`,
                title: "PunkX ULTRA",
                timeout: 6000
            });
            console.log('[Pangdev ULTRA] ECHTER Key gefunden und kopiert:', key);
        } else {
            console.warn('[Pangdev ULTRA] KEIN gültiger Key im erwarteten Format gefunden');
            // Debug-Ausgabe: Zeigt gefundenen Text zur Fehlersuche
            console.log('[Pangdev ULTRA] Seitentext:', document.body.innerText.substring(0, 500));
        }
    }

    waitForKeyElement() {
        return new Promise(resolve => {
            let attempts = 0;
            const check = () => {
                attempts++;
                // Suche nach dem visuellen KEY-Container
                const keyContainer = document.querySelector('.key-box') || 
                                   document.querySelector('[class*="key"]') ||
                                   document.querySelector('code') ||
                                   document.querySelector('pre') ||
                                   document.querySelector('div[style*="border"]') ||
                                   document.querySelector('input[name="key"]');
                
                if (keyContainer || document.body.textContent.match(/punkx\s*-\s*[a-z0-9]+/i)) {
                    console.log('[Pangdev ULTRA] Key-Container gefunden nach', attempts, 'Versuchen');
                    setTimeout(resolve, 800); // Zusätzliche Wartezeit für Rendering
                } else if (attempts > 50) { // Maximal 5 Sekunden Timeout
                    console.error('[Pangdev ULTRA] Timeout: Key-Container nicht gefunden');
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    extractRealKey() {
        console.log('[Pangdev ULTRA] Extraktion gestartet...');
        
        // METHODE 1: Durchsuche alle Elemente nach dem vollständigen Text "Punkx - ..."
        const elementsWithText = document.querySelectorAll('div, span, p, code, pre, input, textarea');
        for (let el of elementsWithText) {
            const text = el.textContent || el.value;
            if (text && this.fullKeyPattern.test(text)) {
                const match = text.match(this.fullKeyPattern);
                if (match) {
                    console.log('[Pangdev ULTRA] Key gefunden in Element:', el.tagName, el.className);
                    return match[0].trim();
                }
            }
        }

        // METHODE 2: Prüfe data-clipboard-text Attribute (Copy-Button)
        const copyButton = document.querySelector('button') || 
                          document.querySelector('[class*="copy"]') ||
                          document.querySelector('[id*="copy"]');
        
        if (copyButton) {
            const dataKey = copyButton.getAttribute('data-clipboard-text') || 
                           copyButton.getAttribute('data-key');
            if (dataKey && this.fullKeyPattern.test(dataKey)) {
                console.log('[Pangdev ULTRA] Key extrahiert aus Button data-attribute');
                return dataKey.trim();
            }
        }

        // METHODE 3: Letzter Ausweg - Suche im gesamten Body mit flexiblem Regex
        const bodyText = document.body.innerText;
        const match = bodyText.match(this.fullKeyPattern);
        if (match) {
            console.log('[Pangdev ULTRA] Key gefunden im Body-Text');
            return match[0].trim();
        }

        return null;
    }
}

// === HELFER-FUNKTIONEN (OPTIMIERT) ===

function handleError(error) {
    const errorText = error.message || error;
    console.error('[Pangdev ULTRA] FEHLER:', errorText);
    GM_notification({
        text: `FEHLER: ${errorText}`,
        title: "PunkX ULTRA FEHLER",
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

// === ADSPOOF UND LVDL FUNKTIONEN (UNVERÄNDERT) ===

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

// === HAUPTFUNKTION MIT VOLLSTÄNDIGEM BYPASS-LOGIK ===

async function pandadevelopment() {
    // Starte den ULTRA-KeyExtractor
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

    // Interne Funktion zum Abrufen des Ad-Links
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

    // Interne Funktion zum Dekodieren der Ziel-URL
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

    // Service-spezifische Wartezeiten (in Millisekunden)
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

        console.log('[Pangdev ULTRA] Parameter:', { hwid, service, token, provider });

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

        // Konstruiere nächsten Checkpoint-URL
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
    
    const handledByLvdl = await lvdl();
    if (handledByLvdl) return;
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('pandadev')) {
        notification('AutoCopy aktiviert', 3000);
        await pandadevelopment();
    } else if (hostname.includes('linkvertise.com') || 
               hostname.includes('loot-link') || 
               hostname.includes('short-jambo.com')) {
        notification('Verarbeite Ad-Link...', 2000);
    }
})();
                    
