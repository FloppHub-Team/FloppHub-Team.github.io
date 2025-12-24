// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    pandadevelopment.net-bypass-exclusive


// @version      1.0
// @description  Automatische Key-Kopierung ohne Klick-System
// @author       Mw_Anonymous | Bypass.vip

// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @require      https://flopphub-team.github.io/UserScript/Bypassvip.js
// @require      https://update.greasyfork.org/scripts/397070/Anti-AdBlocker%20Fuckoff.user.js


// @match        https://pandadevelopment.net/getkey?*
// @match        https://linkvertise.com/*
// @match        https://work.ink/*


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
