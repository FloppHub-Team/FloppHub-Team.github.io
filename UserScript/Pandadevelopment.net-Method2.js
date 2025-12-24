// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    pandadevelopment.net-bypass-exclusive


// @version      1.2
// @description  Automatische Key-Kopierung ohne Klick-System
// @author       Mw_Anonymous | Bypass.vip

// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/Pandadevelopment.net-Method2.js
// @downloadURL  https://flopphub-team.github.io/UserScript/Pandadevelopment.net-Method2.js
// @require      https://flopphub-team.github.io/UserScript/Bypassvip.js
// @require      https://update.greasyfork.org/scripts/397070/Anti-AdBlocker%20Fuckoff.user.js


// @match        https://pandadevelopment.net/getkey?*


// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard


// @connect      *


// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    console.log('[PandaDev AutoCopy] Auto-copy system started');

    class PandaKeyAutoCopy {
        constructor() {
            this.hasCopied = false;
            this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
        }

        async start() {
            if (this.hasCopied) return;
            
            console.log('[PandaDev AutoCopy] Searching for copy button...');
            
            const copyButton = await this.waitForCopyButton();
            
            if (copyButton) {
                await this.clickCopyButton(copyButton);
            } else {
                console.warn('[PandaDev AutoCopy] Button not found, using manual fallback');
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
                        console.log('[PandaDev AutoCopy] Button found after', attempts, 'attempts');
                        resolve(button);
                    } else if (attempts >= maxAttempts) {
                        console.error('[PandaDev AutoCopy] Timeout: Button not found');
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
                        if (element && !element.disabled && 
                            window.getComputedStyle(element).display !== 'none') {
                            return element;
                        }
                    }
                } catch (e) {
                }
            }
            return null;
        }

        async clickCopyButton(button) {
            try {
                console.log('[PandaDev AutoCopy] Clicking button');
                
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
                        this.success(clipboardText, 'Button');
                    } else {
                        this.fallbackExtractFromButton(button);
                    }
                }, 300);
                
            } catch (e) {
                console.error('[PandaDev AutoCopy] Error clicking:', e);
                this.fallbackExtractFromButton(button);
            }
        }

        fallbackExtractFromButton(button) {
            const dataKey = button.getAttribute('data-clipboard-text') || 
                           button.getAttribute('data-key');
            
            if (dataKey && this.keyPattern.test(dataKey)) {
                this.success(dataKey, 'Data attribute');
            } else {
                this.fallbackManualExtract();
            }
        }

        fallbackManualExtract() {
            console.log('[PandaDev AutoCopy] Manual extraction started');
            
            const elements = document.querySelectorAll('div, span, p, code, pre, input, textarea');
            for (let el of elements) {
                const text = (el.textContent || el.value || '').trim();
                const match = text.match(this.keyPattern);
                if (match) {
                    this.success(match[0], 'Manual extraction');
                    return;
                }
            }
            
            this.error('Could not find key on page');
        }

        success(key, method) {
            this.hasCopied = true;
            GM_setClipboard(key);
            GM_notification({
                text: `Key automatically copied: ${key}`,
                title: "PandaDevelopment AutoCopy",
                timeout: 4000
            });
            console.log(`[PandaDev AutoCopy] Key copied via ${method}: ${key}`);
        }

        error(message) {
            GM_notification({
                text: message,
                title: "PandaDevelopment AutoCopy",
                timeout: 5000
            });
            console.error('[PandaDev AutoCopy]', message);
        }
    }

    const autoCopy = new PandaKeyAutoCopy();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => autoCopy.start());
    } else {
        autoCopy.start();
    }

})();
 
