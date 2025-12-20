// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace     pandadevelopment.net-bypass-exclusive


// @version      1.0
// @description  Automatische Key-Kopierung ohne Klick-System
// @author       FloppHub Team | Bypass.vip - Web

// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass%20Beta.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass%20Beta.js

// @match        *://certainlywhenev.org/*
// @match        *://butthedshookh.org/*
// @match        *://aywithmehesa.org/*
// @match        *://pandadevelopment.net/*
// @match        *://linkvertise.com/*
// @match        *://short-jambo.com/*
// @match        *://loot-link.com/*
// @match        *://loot-links.com/*
// @match        *://lootlink.org/*
// @match        *://lootlinks.co/*

// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @connect      *
// @run-at       document-start
// ==/UserScript==

(async () => {
    'use strict';
    if (window.top !== window.self) return;

    const config = {
        time: 1,
        key: ''
    };

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    function showError(message) {
        console.error('[Fusion] FEHLER:', message);
        GM_notification({
            text: `Fehler: ${message}`,
            title: "BYPASS.VIP + PunkX",
            silent: true,
            timeout: 5000
        });
    }

    // === DIREKTER SOFORT-BYPASS (OHNE UI) ===
    function runDirectBypass() {
        const urlParams = new URLSearchParams(window.location.search);
        const rawRedirect = urlParams.get('redirect');

        // Wenn kein redirect vorhanden ist, zu bypass.vip weiterleiten für Verarbeitung
        if (!rawRedirect) {
            console.log('[Fusion] Leite zu bypass.vip API weiter...');
            const targetUrl = `https://bypass.vip/userscript.html?url=${encodeURIComponent(location.href)}&time=${config.time}&key=${config.key}`;
            location.replace(targetUrl);
            return;
        }

        // Wenn redirect vorhanden ist, direkt zum Ziel nach 1 Sekunde weiterleiten
        let redirectUrl = rawRedirect;
        if (!isValidUrl(redirectUrl)) {
            try {
                const decoded = decodeURIComponent(rawRedirect);
                if (isValidUrl(decoded)) {
                    redirectUrl = decoded;
                } else {
                    throw new Error('Ungültige URL');
                }
            } catch {
                showError('Ungültige Redirect-URL. Wiederholung...');
                setTimeout(() => location.replace(location.href.split('?')[0]), 1500);
                return;
            }
        }

        console.log('[Fusion] Direkt-Weiterleitung zu:', redirectUrl);
        setTimeout(() => {
            try {
                window.location.assign(redirectUrl);
            } catch {
                window.location.href = redirectUrl;
            }
        }, 1000);
    }

    // === PUNKX AUTO-COPY SYSTEM ===
    class PunkXUltraExtractor {
        constructor() {
            this.hasCopied = false;
            this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
        }

        async start() {
            if (this.hasCopied) return;
            const button = await this.waitForCopyButton();
            if (button) {
                await this.clickCopyButton(button);
            } else {
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
                        resolve(button);
                    } else if (attempts >= maxAttempts) {
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
                        if (element && !element.disabled) {
                            const style = window.getComputedStyle(element);
                            if (style.display !== 'none' && style.visibility !== 'hidden') {
                                return element;
                            }
                        }
                    }
                } catch {}
            }
            return null;
        }

        async clickCopyButton(button) {
            try {
                const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true, button: 0 });
                button.dispatchEvent(clickEvent);
                
                setTimeout(async () => {
                    const clipboardText = await navigator.clipboard.readText().catch(() => '');
                    if (clipboardText && this.keyPattern.test(clipboardText)) {
                        this.hasCopied = true;
                        GM_setClipboard(clipboardText);
                        GM_notification({
                            text: `Key kopiert: ${clipboardText}`,
                            title: "AutoCopy",
                            timeout: 4000
                        });
                    } else {
                        this.fallbackExtractFromButton(button);
                    }
                }, 300);
            } catch {
                this.fallbackExtractFromButton(button);
            }
        }

        fallbackExtractFromButton(button) {
            const dataKey = button.getAttribute('data-clipboard-text') || button.getAttribute('data-key');
            if (dataKey && this.keyPattern.test(dataKey)) {
                GM_setClipboard(dataKey);
                this.hasCopied = true;
                GM_notification({ text: `Key kopiert: ${dataKey}`, title: "AutoCopy", timeout: 4000 });
            } else {
                this.fallbackManualExtract();
            }
        }

        fallbackManualExtract() {
            const elements = document.querySelectorAll('div, span, p, code, pre, input, textarea');
            for (let el of elements) {
                const text = (el.textContent || el.value || '').trim();
                const match = text.match(this.keyPattern);
                if (match) {
                    GM_setClipboard(match[0]);
                    this.hasCopied = true;
                    GM_notification({ text: `Key kopiert: ${match[0]}`, title: "AutoCopy", timeout: 4000 });
                    return;
                }
            }
            showError('Key-Extraktion fehlgeschlagen');
        }
    }

    // === PUNKX AD-FUNKTIONEN ===
    function adSpoof(url, referrer) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                anonymous: true,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; GO3C Build/OPM2.171019.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.141 Mobile Safari/537.36",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Referer": referrer,
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate"
                },
                onload: () => {
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
                await adSpoof(atob(rParam), window.location.hostname);
                return true;
            } catch {
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

        // Anti-Adblock entfernen
        const antiAdblockRemover = setInterval(() => {
            const antiAdblock = document.querySelector('.adblock_title');
            if (antiAdblock) {
                antiAdblock.closest('body > *')?.remove();
                clearInterval(antiAdblockRemover);
            }
        }, 500);

        function getAdLink() {
            const form = document.querySelector('form');
            if (!form) return Promise.reject('Kein Formular gefunden');
            
            const data = new FormData(form);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
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
            if (url.hostname === 'linkvertise.com') {
                const r = url.searchParams.get('r');
                if (!r) throw new Error('Kein r-Parameter');
                return atob(r);
            } else if (url.hostname === 'short-jambo.com') {
                const parts = url.search.split('&url=');
                if (parts.length < 2) throw new Error('Kein url-Parameter');
                return parts[1];
            }
            return false;
        }

        const customSleepTimes = {
            'vegax': 11000, 'laziumtools': 11000, 'adelhub': 11000,
            'neoxkey': 16000,
        };

        try {
            const currentUrl = new URL(window.location.href);
            const hwid = currentUrl.searchParams.get('hwid');
            const service = currentUrl.searchParams.get('service');
            const token = currentUrl.searchParams.get('sessiontoken');
            const provider = currentUrl.searchParams.get('provider');

            if (!hwid || !service) return;

            const adUrl = await getAdLink();
            const dest = getDestUrl(adUrl);
            
            if (!dest) {
                window.location.assign(`https://pangdev.net/getkey?hwid=${hwid}&service=${service}`);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, customSleepTimes[service] || 3000));
            await new Promise(resolve => setTimeout(resolve, 3000));

            let nextCheckpoint = `https://pangdev.net/getkey?hwid=${hwid}&service=${service}`;
            if (token) nextCheckpoint += `&sessiontoken=${token}`;
            if (provider) nextCheckpoint += `&provider=${provider}`;
            
            window.location.assign(nextCheckpoint);
        } catch (e) {
            showError(e.message);
        }
    }

    // === HAUPTAUSFÜHRUNG ===
    const hostname = window.location.hostname;

    // Hosts für direkten Bypass
    const directBypassHosts = ['certainlywhenev.org', 'butthedshookh.org', 'aywithmehesa.org'];

    // DIREKTEN BYPASS IMMER AUF DIESEN HOSTS AUSFÜHREN
    if (directBypassHosts.includes(hostname)) {
        console.log(`[Fusion] Direkter Bypass-Modus aktiviert für ${hostname}`);
        runDirectBypass();
        return; // Zusätzliche Ausführung stoppen
    }

    // WENN ES KEIN DIREKTER BYPASS-HOST IST, PUNKX-LOGIK AUSFÜHREN
    console.log('[Fusion] Führe PunkX-Logik aus für', hostname);
    const handledByLvdl = await lvdl();
    if (!handledByLvdl) {
        if (hostname.includes('pandadev')) {
            GM_notification({ text: 'AutoCopy aktiviert', title: 'PunkX', timeout: 3000 });
            await pandadevelopment();
        } else if (hostname.includes('linkvertise.com') || hostname.includes('loot-link')) {
            GM_notification({ text: 'Verarbeite Ad-Link...', title: 'PunkX', timeout: 2000 });
        }
    }
})();
