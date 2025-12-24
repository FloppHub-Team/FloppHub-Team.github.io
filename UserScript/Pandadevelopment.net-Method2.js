// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    pandadevelopment.net-bypass-exclusive


// @version      1.1
// @description  Automatische Key-Kopierung ohne Klick-System
// @author       Mw_Anonymous | Bypass.vip

// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @require      https://flopphub-team.github.io/UserScript/Bypassvip.js
// @require      https://update.greasyfork.org/scripts/397070/Anti-AdBlocker%20Fuckoff.user.js


// @match        https://pandadevelopment.net/getkey?*


// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard


// @connect      *


// @run-at       document-start
// ==/UserScript==


class PunkXUltraExtractor {
    constructor() {
        this.hasCopied = false;
        this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
    }

    async start() {
        if (this.hasCopied) return;
        
        const copyButton = await this.waitForCopyButton();
        
        if (copyButton) {
            await this.clickCopyButton(copyButton);
        } else {
            this.fallbackManualExtract();
        }
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
    }
}
async clickCopyButton(button) {
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
            GM_setClipboard(clipboardText);
        } else {
            this.fallbackExtractFromButton(button);
        }
    }, 300);
}
fallbackExtractFromButton(button) {
    const dataKey = button.getAttribute('data-clipboard-text') || 
                   button.getAttribute('data-key');
    
    if (dataKey && this.keyPattern.test(dataKey)) {
        GM_setClipboard(dataKey);
        this.hasCopied = true;
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
            return;
        }
    }
}
(async function() {
    if (hostname.includes('pandadev')) {
        const keyCopier = new PunkXUltraExtractor();
        keyCopier.start();
    }
})();
