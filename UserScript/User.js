
// ==UserScript==
// @name         PunkX Bypass | AdMavenshort + Linkvertise
// @namespace    Combined Bypass Scripts
// @version      2.3
// @description:es  Bypass.vip modificado y auto-copy keys en Pandadevelopment
// @description  Rapid-links handled by Bypass.vip and auto-copy keys in Pandadevelopment
// @author       TheRealBanHammer | Bypass.vip | Mw_Anonymous


// @match        https://rapid-links.net/s*
// @match        https://rapid-links.com/s* 
// @match        https://linkvertise.com/*/*
// @match        https://pandadevelopment.net/getkey?*
// @match        https://new.pandadevelopment.net/getkey/punkxreleasekey?*


// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/User.js
// @downloadURL  https://flopphub-team.github.io/UserScript/User.js
// @require      https://flopphub-team.github.io/UserScript/Bypassvip.js
// @require      https://flopphub-team.github.io/UserScript/Anti-Anuncios-By-BanHammer.js


// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    
    if (hostname.includes('pandadevelopment.net')) {
        
        class PandaKeyAutoCopy {
            constructor() {
                this.hasCopied = false;
                this.keyPattern = /punkx\s*-+\s*[a-z0-9]+/i;
                this.observer = null;
            }

            start() {
                if (this.hasCopied) return;
                
                this.setupObserver();
                this.attemptCopy();
            }

            setupObserver() {
                this.observer = new MutationObserver((mutations) => {
                    if (!this.hasCopied) {
                        this.attemptCopy();
                    }
                });
                
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'style']
                });
                
                setTimeout(() => {
                    if (this.observer && !this.hasCopied) {
                        this.observer.disconnect();
                        this.fallbackManualExtract();
                    }
                }, 30000);
            }

            attemptCopy() {
                const button = this.findCopyButton();
                if (button) {
                    this.observer.disconnect();
                    this.clickButtonRobust(button);
                }
            }

            findCopyButton() {
                const xpath = "//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'copy key')] | //div[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'copy key')] | //span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'copy key')]";
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                if (result.singleNodeValue) return result.singleNodeValue;

                const cssSelectors = [
                    'button[class*="copy"]',
                    'button[id*="copy"]',
                    'button[data-clipboard-text]',
                    'button[data-key]',
                    '.copy-key-btn',
                    '.btn-copy',
                    'button:has(svg)',
                    '[class*="copy-key"]',
                    '[class*="Copy"]'
                ];
                
                for (const selector of cssSelectors) {
                    try {
                        const el = document.querySelector(selector);
                        if (el && this.isVisible(el)) return el;
                    } catch(e {}
                }

                const elements = document.querySelectorAll('button, div[role="button"], a, span');
                for (const el of elements) {
                    const text = el.textContent.toLowerCase();
                    if ((text.includes('copy') && text.includes('key')) || text === 'copy') {
                        if (this.isVisible(el)) return el;
                    }
                }

                return null;
            }

            isVisible(el) {
                return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && 
                       window.getComputedStyle(el).visibility !== 'hidden' &&
                       window.getComputedStyle(el).display !== 'none';
            }

            clickButtonRobust(button) {
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    try {
                        const events = [
                            new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }),
                            new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }),
                            new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }),
                            new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 })
                        ];
                        
                        events.forEach((event, index) => {
                            setTimeout(() => {
                                button.dispatchEvent(event);
                            }, index * 50);
                        });

                        setTimeout(() => {
                            button.click();
                            setTimeout(() => this.verifyAndExtract(button), 500);
                        }, 200);

                    } catch (e) {
                        this.fallbackManualExtract();
                    }
                }, 300);
            }

            async verifyAndExtract(button) {
                try {
                    const clipboardText = await navigator.clipboard.readText().catch(() => '');
                    if (clipboardText && this.keyPattern.test(clipboardText)) {
                        this.success(clipboardText, 'Clipboard');
                        return;
                    }
                } catch(e) {}

                const dataKey = button.getAttribute('data-clipboard-text') || 
                               button.getAttribute('data-key');
                
                if (dataKey && this.keyPattern.test(dataKey)) {
                    GM_setClipboard(dataKey);
                    this.success(dataKey, 'Atributo');
                    return;
                }

                this.fallbackManualExtract();
            }

            fallbackManualExtract() {
                const selectors = ['input[type="text"]', 'textarea', 'code', 'pre', '.key', '#key', '[class*="key"]'];
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        const text = (el.value || el.textContent || '').trim();
                        const match = text.match(this.keyPattern);
                        if (match) {
                            GM_setClipboard(match[0]);
                            this.success(match[0], 'DOM');
                            return;
                        }
                    }
                }

                const bodyText = document.body.innerText;
                const match = bodyText.match(this.keyPattern);
                if (match) {
                    GM_setClipboard(match[0]);
                    this.success(match[0], 'Texto');
                    return;
                }

                this.error('Key no encontrada');
            }

            success(key, method) {
                if (this.hasCopied) return;
                this.hasCopied = true;
                
                if (this.observer) this.observer.disconnect();
                
                GM_setClipboard(key);
                GM_notification({
                    text: `Key copiada: ${key}`,
                    title: "PandaDevelopment AutoCopy",
                    timeout: 4000
                });
            }

            error(message) {
                GM_notification({
                    text: message,
                    title: "PandaDevelopment Error",
                    timeout: 5000
                });
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const autoCopy = new PandaKeyAutoCopy();
                autoCopy.start();
            });
        } else {
            const autoCopy = new PandaKeyAutoCopy();
            autoCopy.start();
        }
        
        return;
    }
})();
