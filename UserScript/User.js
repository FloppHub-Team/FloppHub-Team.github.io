// ==UserScript==
// @name         PunkX Bypass | AdMavenshort + Linkvertise
// @namespace    Combined Bypass Scripts
// @version      2.2
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

    if (hostname.includes('pandadevelopment.net')) {
        
        class PandaKeyAutoCopy {
            constructor() {
                this.hasCopied = false;
                this.keyPattern = /punkx\s*-\s*[a-z0-9]+/i;
            }

            async start() {
                if (this.hasCopied) return;
                
                console.log('[PandaDev AutoCopy] Buscando botón...');
                
                const copyButton = await this.waitForCopyButton();
                
                if (copyButton) {
                    await this.clickCopyButton(copyButton);
                } else {
                    console.warn('[PandaDev AutoCopy] Botón no encontrado, usando fallback manual');
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
                            console.log('[PandaDev AutoCopy] Botón encontrado tras', attempts, 'intentos');
                            resolve(button);
                        } else if (attempts >= maxAttempts) {
                            console.error('[PandaDev AutoCopy] Timeout: Botón no encontrado');
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
                    } catch (e) {}
                }
                return null;
            }

            async clickCopyButton(button) {
                try {
                    console.log('[PandaDev AutoCopy] Clickeando botón');
                    
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
                            this.success(clipboardText, 'Botón');
                        } else {
                            this.fallbackExtractFromButton(button);
                        }
                    }, 300);
                    
                } catch (e) {
                    console.error('[PandaDev AutoCopy] Error al clickear:', e);
                    this.fallbackExtractFromButton(button);
                }
            }

            fallbackExtractFromButton(button) {
                const dataKey = button.getAttribute('data-clipboard-text') || 
                               button.getAttribute('data-key');
                
                if (dataKey && this.keyPattern.test(dataKey)) {
                    this.success(dataKey, 'Atributo data');
                } else {
                    this.fallbackManualExtract();
                }
            }

            fallbackManualExtract() {
                console.log('[PandaDev AutoCopy] Extracción manual iniciada');
                
                const elements = document.querySelectorAll('div, span, p, code, pre, input, textarea');
                for (let el of elements) {
                    const text = (el.textContent || el.value || '').trim();
                    const match = text.match(this.keyPattern);
                    if (match) {
                        this.success(match[0], 'Extracción manual');
                        return;
                    }
                }
                
                this.error('No se encontró la key en la página');
            }

            success(key, method) {
                this.hasCopied = true;
                GM_setClipboard(key);
                GM_notification({
                    text: `Key copiada automáticamente: ${key}`,
                    title: "PandaDevelopment AutoCopy",
                    timeout: 4000
                });
                console.log(`[PandaDev AutoCopy] Key copiada vía ${method}: ${key}`);
            }

            error(message) {
                GM_notification({
                    text: message,
                    title: "PandaDevelopment AutoCopy Error",
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
        
        return;
    }
})();
