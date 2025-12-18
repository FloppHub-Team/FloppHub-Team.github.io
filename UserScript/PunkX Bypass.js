// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    punkX-bypass-exclusive


// @version      1.1
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

console.log('[Pangdev Bypass] Korrigierte Version geladen auf:', window.location.href);

// === KORRIGIERTES SYSTEM FÜR AUTOMATISCHE KEY-ERKENNUNG ===

class PunkXKeyExtractor {
    constructor() {
        this.hasCopied = false;
        this.keyPattern = /^PunkX-[a-zA-Z0-9-_]+$/; // PRÄZISER REGEX!
        this.minLength = 25; // Echter Key ist länger als Fake-Keys
    }

    async start() {
        if (this.hasCopied) return;
        
        console.log('[Pangdev Bypass] Suche nach echtem PunkX-Key...');
        
        // WARTE bis das Key-Element garantiert geladen ist
        await this.waitForKeyElement();
        
        const key = this.extractRealKey();
        
        if (key) {
            await GM_setClipboard(key);
            this.hasCopied = true;
            GM_notification({
                text: `Key kopiert: ${key}`,
                title: "PunkX Bypass",
                timeout: 5000
            });
            console.log('[Pangdev Bypass] ECHTER Key erfolgreich kopiert:', key);
        } else {
            console.warn('[Pangdev Bypass] Kein gültiger Key gefunden');
        }
    }

    waitForKeyElement() {
        return new Promise(resolve => {
            const check = () => {
                // Prüfe auf spezifische Key-Elemente
                const keyElement = document.querySelector('input[name="key"]') || 
                                 document.querySelector('#key') ||
                                 document.querySelector('.key-display') ||
                                 document.querySelector('code') ||
                                 document.querySelector('pre');
                
                if (keyElement || document.body.textContent.includes('PunkX-')) {
                    setTimeout(resolve, 500); // Zusätzliche Sicherheitswartezeit
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    extractRealKey() {
        // METHODE 1: Spezifische Input-Felder (HÖCHSTE ZUVERLÄSSIGKEIT)
        const keyInput = document.querySelector('input[name="key"]') || 
                        document.querySelector('#key') ||
                        document.querySelector('input[type="text"][value^="PunkX-"]');
        
        if (keyInput && this.isValidKey(keyInput.value)) {
            return keyInput.value.trim();
        }

        // METHODE 2: Code/Pre-Elemente mit exaktem Text
        const textSelectors = ['code', 'pre', '.key', '#key-display', '.key-text'];
        for (let selector of textSelectors) {
            const element = document.querySelector(selector);
            if (element && this.isValidKey(element.textContent)) {
                return element.textContent.trim();
            }
        }

        // METHODE 3: Fallback - durchsuche gesamten Text aber INTELLIGENT GEFILTERT
        const allText = document.body.innerText;
        const potentialKeys = allText.match(/PunkX-[a-zA-Z0-9-_]+/g) || [];
        
        // Filtere nach Länge und wähle den längsten Key (der echte ist normalerweise der längste)
        const validKeys = potentialKeys.filter(key => key.length > this.minLength);
        
        if (validKeys.length > 0) {
            // Sortiere absteigend nach Länge und nimm den ersten (längsten)
            return validKeys.sort((a, b) => b.length - a.length)[0];
        }

        return null;
    }

    isValidKey(text) {
        if (!text || typeof text !== 'string') return false;
        const trimmed = text.trim();
        return this.keyPattern.test(trimmed) && trimmed.length > this.minLength;
    }
}

// === HELFER-FUNKTIONEN (UNVERÄNDERT) ===

function handleError(error) {
    const errorText = error.message || error;
    console.error('[Pangdev Bypass] FEHLER:', errorText);
    GM_notification({
        text: errorText,
        title: "Pangdev Bypass FEHLER",
        silent: true,
        timeout: 5000
    });
}

function notification(message, timeout = 3000) {
    const config = {
        text: message,
        title: "Pangdev Bypass",
        silent: true
    };
    if (timeout) config.timeout = timeout;
    GM_notification(config);
    console.log('[Pangdev Bypass] BENACHRICHTIGUNG:', message);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// === ADSPOOF UND LVDL FUNKTIONEN ===

function adSpoof(url, referrer) {
    return new Promise((resolve, reject) => {
        console.log('[Pangdev Bypass] adSpoof() leitet weiter zu:', url);
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
    // Starte das korrigierte AutoCopy-System sofort
    const keyCopier = new PunkXKeyExtractor();
    keyCopier.start();

    // Entferne Anti-Adblock-Overlays
    let antiAdblockRemover = setInterval(() => {
        const antiAdblock = document.querySelector('.adblock_title');
        if (antiAdblock) {
            antiAdblock.closest('body > *')?.remove();
            clearInterval(antiAdblockRemover);
            console.log('[Pangdev Bypass] Anti-Adblock erfolgreich entfernt');
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

        console.log('[Pangdev Bypass] URL-Parameter:', { hwid, service, token, provider });

        const adUrl = await getAdLink();
        const dest = getDestUrl(adUrl);
        
        if (!dest) {
            window.location.assign(`https://pangdev.net/getkey?hwid=${hwid}&service=${service}`);
            return;
        }

        // Warte service-spezifische Zeit
        await sleep(customSleepTimes[service] || 3000);
        
        console.log('[Pangdev Bypass] Simuliere Ad-Ansicht...');
        notification(`Level abgeschlossen (${service})`, 3000);
        
        await sleep(3000);

        // Konstruiere nächsten Checkpoint-URL
        let nextCheckpoint = `https://pangdev.net/getkey?hwid=${hwid}&service=${service}`;
        if (token) nextCheckpoint += `&sessiontoken=${token}`;
        if (provider) nextCheckpoint += `&provider=${provider}`;
        
        console.log('[Pangdev Bypass] Weiterleitung zu:', nextCheckpoint);
        window.location.assign(nextCheckpoint);
    } catch (e) {
        handleError(e);
    }
}

// === AUTOMATISCHE INITIALISIERUNG BEI SEITENLADUNG ===

(async function() {
    console.log('[Pangdev Bypass] INITIALISIERUNG auf:', window.location.hostname);
    
    // Versuche zuerst LVDL-Weiterleitung
    const handledByLvdl = await lvdl();
    if (handledByLvdl) return;
    
    const hostname = window.location.hostname;
    
    // Prüfe ob wir auf der Key-Seite sind
    if (hostname.includes('pandadev')) {
        notification('AutoCopy-System aktiviert', 3000);
        await pandadevelopment();
    } else if (hostname.includes('linkvertise.com') || 
               hostname.includes('loot-link') || 
               hostname.includes('short-jambo.com')) {
        notification('Verarbeite Ad-Link...', 2000);
    }
})();
            
