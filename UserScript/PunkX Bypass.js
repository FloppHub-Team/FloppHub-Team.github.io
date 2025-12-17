// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    punkX-bypass-exclusive


// @version      2.3
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

console.log('[Pandadev Bypass] AutoCopy-Only-Version geladen auf:', window.location.href);

// === POLLING-SYSTEM FÜR AUTOMATISCHE KEY-ERKENNUNG ===

class PandadevKeyAutoCopier {
    constructor() {
        this.isRunning = false;
        this.hasExecuted = false;
        this.pollingInterval = null;
        this.MAX_WAIT_TIME = 120000; // 2 Minuten Timeout
        this.startTime = Date.now();
    }

    start() {
        if (this.isRunning || this.hasExecuted) return;
        this.isRunning = true;
        this.startTime = Date.now();
        
        console.log('[Pandadev Bypass] Starte intelligentes Key-Polling...');
        notification('AutoCopy aktiv', 2000);
        
        // Sofortige Überprüfung und dann alle 500ms
        this.checkForKey();
        this.pollingInterval = setInterval(() => this.checkForKey(), 500);
        
        // Sicherheits-Timeout
        setTimeout(() => {
            if (this.isRunning) {
                console.warn('[Pandadev Bypass] Maximale Wartezeit erreicht');
                this.stop();
            }
        }, this.MAX_WAIT_TIME);
    }

    stop() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.isRunning = false;
            this.hasExecuted = true;
            console.log('[Pandadev Bypass] Polling gestoppt');
        }
    }

    checkForKey() {
        if (!window.location.hostname.includes('pandadev') || this.hasExecuted) {
            this.stop();
            return;
        }

        try {
            // PRIO 1: Prüfen, ob wir auf der finalen Key-Seite sind
            if (this.isFinalPageWithKey()) {
                this.handleFinalPage();
                return;
            }

            // Timeout nach 2 Minuten
            if (Date.now() - this.startTime > this.MAX_WAIT_TIME) {
                console.error('[Pandadev Bypass] Wartezeit abgelaufen');
                this.stop();
            }
        } catch (e) {
            console.error('[Pandadev Bypass] Fehler beim Polling:', e);
            this.stop();
        }
    }

    isFinalPageWithKey() {
        // Indikatoren für die finale Key-Seite
        const indicators = [
            'you got the key', 'key generated', 'success', 'Copy Key', 
            'copy key', 'key copied', 'Ihr Key wurde generiert'
        ];
        
        const pageText = document.body.textContent.toLowerCase();
        return indicators.some(indicator => pageText.includes(indicator.toLowerCase()));
    }

    async handleFinalPage() {
        if (this.hasExecuted) return;
        this.hasExecuted = true;
        
        console.log('[Pandadev Bypass] Finale Seite erkannt, versuche Key zu kopieren...');
        
        // Sofort kopieren versuchen
        await this.copyKeyAutomatically();
        
        this.stop();
    }

    async copyKeyAutomatically() {
        try {
            // Methode 1: Suche nach sichtbaren Input-Feldern
            const inputSelectors = [
                'input[type="text"]', 'input[type="password"]', 
                'input[name*="key"]', 'input[id*="key"]', 'textarea'
            ];
            
            for (let selector of inputSelectors) {
                const elements = document.querySelectorAll(selector);
                for (let el of elements) {
                    const key = (el.value || el.textContent || '').trim();
                    if (this.isValidKey(key)) {
                        await GM_setClipboard(key);
                        notification(`Key kopiert: ${key.substring(0, 20)}...`, 6000);
                        console.log('[Pandadev Bypass] Key erfolgreich kopiert');
                        return true;
                    }
                }
            }
            
            // Methode 2: Suche nach Code/Pre-Elementen
            const codeElements = document.querySelectorAll('code, pre, .key, #key, [class*="key"]');
            for (let el of codeElements) {
                const key = el.textContent.trim();
                if (this.isValidKey(key)) {
                    await GM_setClipboard(key);
                    notification('Key automatisch kopiert!', 6000);
                    console.log('[Pandadev Bypass] Key aus Code-Element kopiert');
                    return true;
                }
            }
            
            // Methode 3: Fallback - Suche im gesamten Text nach Key-Pattern
            const allText = document.body.innerText;
            const words = allText.split(/\s+/);
            for (let word of words) {
                if (this.isValidKey(word)) {
                    await GM_setClipboard(word);
                    notification('Key gefunden und kopiert!', 6000);
                    console.log('[Pandadev Bypass] Key aus Text extrahiert');
                    return true;
                }
            }
            
            // Letzter Versuch: Klicke auf "Copy Key"-Button und prüfe dann das Clipboard
            const copyButtonClicked = this.clickCopyButton();
            if (copyButtonClicked) {
                console.log('[Pandadev Bypass] Klick auf Copy-Button ausgeführt');
                // Warte kurz und prüfe dann erneut
                setTimeout(() => this.copyKeyAutomatically(), 500);
                return true;
            }
            
        } catch (e) {
            console.error('[Pandadev Bypass] Fehler beim Kopieren:', e);
        }
        return false;
    }

    clickCopyButton() {
        // Versuche, auf einen "Copy Key"-Button zu klicken
        const selectors = ['button', 'input[type="button"]', '.btn', '.button', '[role="button"]'];
        const elements = document.querySelectorAll(selectors.join(', '));
        
        for (let el of elements) {
            const buttonText = (el.textContent || el.value || '').trim();
            if (buttonText.toLowerCase().includes('copy key')) {
                const style = window.getComputedStyle(el);
                const isVisible = style.display !== 'none' && 
                                 style.visibility !== 'hidden' && 
                                 style.opacity !== '0';
                
                if (isVisible && !el.disabled) {
                    console.log(`[Pandadev Bypass] Klicke auf: "${buttonText}"`);
                    el.click();
                    return true;
                }
            }
        }
        return false;
    }

    isValidKey(text) {
        // Validiert, ob es sich um einen Key handelt: >10 Zeichen, alphanumerisch mit Bindestrichen
        return text && text.length > 10 && /^[a-zA-Z0-9-_]+$/.test(text);
    }
}

// === HELPER-FUNKTIONEN (UNVERÄNDERT) ===

function handleError(error) {
    const errorText = error.message || error;
    console.error('[Pandadev Bypass] FEHLER:', errorText);
    GM_notification({
        text: errorText,
        title: "Pandadev Bypass FEHLER",
        silent: true,
        timeout: 5000
    });
}

function notification(message, timeout = 3000) {
    const config = {
        text: message,
        title: "Pandadev Bypass",
        silent: true
    };
    if (timeout) config.timeout = timeout;
    GM_notification(config);
    console.log('[Pandadev Bypass] BENACHRICHTIGUNG:', message);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// === ADSPOOF UND LVDL FUNKTIONEN ===

function adSpoof(url, referrer) {
    return new Promise((resolve, reject) => {
        console.log('[Pandadev Bypass] adSpoof() leitet weiter zu:', url);
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

// === HAUPTFUNKTION ===

async function pandadevelopment() {
    // AutoCopy-System sofort starten
    const keyCopier = new PandadevKeyAutoCopier();
    keyCopier.start();

    // Anti-Adblock-Entferner
    let antiAdblockRemover = setInterval(() => {
        const antiAdblock = document.querySelector('.adblock_title');
        if (antiAdblock) {
            antiAdblock.closest('body > *')?.remove();
            clearInterval(antiAdblockRemover);
            console.log('[Pangdev Bypass] Anti-Adblock entfernt');
        }
    }, 500);

    // Restliche Logik...
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

        console.log('[Pangdev Bypass] Parameter:', { hwid, service, token, provider });

        const adUrl = await getAdLink();
        const dest = getDestUrl(adUrl);
        
        if (!dest) {
            window.location.assign(`https://pangdev.net/getkey?hwid=${hwid}&service=${service}`);
            return;
        }

        await sleep(customSleepTimes[service] || 3000);
        
        console.log('[Pangdev Bypass] Simuliere Ad-Ansicht...');
        notification(`Level abgeschlossen (${service})`, 3000);
        
        await sleep(3000);

        let nextCheckpoint = `https://pangdev.net/getkey?hwid=${hwid}&service=${service}`;
        if (token) nextCheckpoint += `&sessiontoken=${token}`;
        if (provider) nextCheckpoint += `&provider=${provider}`;
        
        console.log('[Pangdev Bypass] Weiterleitung zu:', nextCheckpoint);
        window.location.assign(nextCheckpoint);
    } catch (e) {
        handleError(e);
    }
}

// === AUTOMATISCHE AUSFÜHRUNG ===

(async function() {
    console.log('[Pangdev Bypass] STARTE auf:', window.location.hostname);
    
    const handledByLvdl = await lvdl();
    if (handledByLvdl) return;
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('pandadev')) {
        notification('AutoCopy-System aktiviert', 3000);
        await pandadevelopment();
    } else if (hostname.includes('linkvertise.com') || 
               hostname.includes('loot-link') || 
               hostname.includes('short-jambo.com')) {
        notification('Verarbeite Ad-Link...', 2000);
    }
})();
        
