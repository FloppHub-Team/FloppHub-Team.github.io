// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key (New Domain)
// @namespace    punkX-bypass-exclusive
// @version      2.1.0
// @description  Automatische Key-Kopierung für new.pandadevelopment.net
// @author       Mw_Anonymous | TheRealBanHammer (Updated)
// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @require      https://flopphub-team.github.io/UserScript/Anti-Anuncios-By-BanHammer.js 
// @match        https://new.pandadevelopment.net/getkey/*
// @match        https://pandadevelopment.net/getkey*
// @match        https://linkvertise.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-start
// ==/UserScript==

console.log('[Pangdev ULTRA] Automatischer Copy-Button-Klick geladen');

class PunkXUltraExtractor {
    constructor() {
        this.hasCopied = false;
        this.keyPattern = /PUNKX--[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}/i;
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
            'button[class*="bg-[#38B2AC]"]',
            'button[class*="rounded-lg"]',
            'button:has-text("Copy Key")',
            'button:contains("Copy Key")',
            'button:contains("copy key")',
            'button:contains("Copy")',
            '.copy-key-btn',
            '#copy-key-btn',
            '.btn-copy',
            '.copy-button',
            '[class*="copy"]',
            '[id*="copy"]',
            'button[data-clipboard-text]',
            'button.w-full',
            'button.bg-gradient-to-r',
            'button'
        ];

        for (let selector of selectors) {
            try {
                if (selector.includes(':contains')) {
                    const parts = selector.split(':contains');
                    const baseSelector = parts[0] || '*';
                    const text = parts[1].replace(/[()]/g, '').replace(/"/g, '');
                    const elements = document.querySelectorAll(baseSelector);
                    for (let el of elements) {
                        if (el.textContent.toLowerCase().includes(text.toLowerCase())) {
                            return el;
                        }
                    }
                } else if (selector.includes(':has-text')) {
                    const baseSelector = selector.split(':has-text')[0] || 'button';
                    const text = selector.match(/:has-text\(["'](.+?)["']\)/)?.[1] || 'Copy';
                    const elements = document.querySelectorAll(baseSelector);
                    for (let el of elements) {
                        if (el.textContent.includes(text)) return el;
                    }
                } else {
                    const element = document.querySelector(selector);
                    if (element) {
                        const style = window.getComputedStyle(element);
                        if (style.display !== 'none' && 
                            style.visibility !== 'hidden' && 
                            !element.disabled) {
                            if (element.tagName === 'BUTTON' || 
                                element.onclick || 
                                element.getAttribute('role') === 'button' ||
                                element.classList.contains('cursor-pointer')) {
                                return element;
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        const buttons = document.querySelectorAll('button');
        for (let btn of buttons) {
            const text = btn.textContent.toLowerCase();
            if (text.includes('copy') && text.includes('key')) {
                const style = window.getComputedStyle(btn);
                if (style.display !== 'none' && style.visibility !== 'hidden') {
                    return btn;
                }
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
                try {
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
                } catch (e) {
                    this.fallbackExtractFromButton(button);
                }
            }, 500);
        } catch (e) {
            console.error('[Pangdev ULTRA] Fehler beim Klicken:', e);
            this.fallbackManualExtract();
        }
    }

    fallbackExtractFromButton(button) {
        const dataKey = button.getAttribute('data-clipboard-text') || 
                       button.getAttribute('data-key') ||
                       button.getAttribute('data-text');
        
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
        const elements = document.querySelectorAll('div, span, p, code, pre, input, textarea, h1, h2, h3, h4, h5, h6, [class*="key"], [id*="key"]');
        
        for (let el of elements) {
            const text = (el.textContent || el.value || el.getAttribute('data-key') || '').trim();
            const match = text.match(this.keyPattern);
            if (match) {
                const key = match[0].toUpperCase();
                GM_setClipboard(key);
                this.hasCopied = true;
                GM_notification({
                    text: `Key manuell kopiert: ${key}`,
                    title: "Pangdev ULTRA",
                    timeout: 4000
                });
                console.log('[Pangdev ULTRA] Key ueber manuelle Extraktion gefunden');
                return;
            }
        }
        
        const bodyText = document.body.innerText || document.body.textContent;
        const matches = bodyText.match(this.keyPattern);
        if (matches && matches[0]) {
            const key = matches[0].toUpperCase();
            GM_setClipboard(key);
            this.hasCopied = true;
            GM_notification({
                text: `Key aus Seitentext kopiert: ${key}`,
                title: "Pangdev ULTRA",
                timeout: 4000
            });
            console.log('[Pangdev ULTRA] Key aus body text extrahiert');
            return;
        }
        
        console.error('[Pangdev ULTRA] Alle Extraktionsmethoden fehlgeschlagen');
        GM_notification({
            text: "Fehler: Key konnte nicht kopiert werden",
            title: "Pangdev ULTRA",
            timeout: 5000
        });
    }
}

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

        const adUrl = await getAdLink();
        const dest = getDestUrl(adUrl);
        
        if (!dest) {
            const newDomain = window.location.hostname.includes('new.') ? 'new.pandadevelopment.net' : 'pandadevelopment.net';
            window.location.assign(`https://${newDomain}/getkey?hwid=${hwid}&service=${service}`);
            return;
        }

        await sleep(customSleepTimes[service] || 3000);
        console.log('[Pangdev ULTRA] Simuliere Ad-Ansicht...');
        notification(`Level abgeschlossen (${service})`, 3000);
        await sleep(3000);

        const newDomain = window.location.hostname.includes('new.') ? 'new.pandadevelopment.net' : 'pandadevelopment.net';
        let nextCheckpoint = `https://${newDomain}/getkey?hwid=${hwid}&service=${service}`;
        if (token) nextCheckpoint += `&sessiontoken=${token}`;
        if (provider) nextCheckpoint += `&provider=${provider}`;
        
        console.log('[Pangdev ULTRA] Weiterleitung zu:', nextCheckpoint);
        window.location.assign(nextCheckpoint);
    } catch (e) {
        handleError(e);
    }
}

(async function() {
    console.log('[Pangdev ULTRA] INITIALISIERUNG auf:', window.location.hostname);
    const handledByLvdl = await lvdl();
    if (handledByLvdl) return;
    
    const hostname = window.location.hostname;
    
    if (hostname.includes('pandadev') || hostname.includes('new.pandadevelopment')) {
        notification('ULTRA AutoCopy aktiviert (v2.1)', 3000);
        await pandadevelopment();
    } else if (hostname.includes('linkvertise.com') || 
               hostname.includes('loot-link') || 
               hostname.includes('short-jambo.com')) {
        notification('Verarbeite Ad-Link...', 2000);
    }
})();
