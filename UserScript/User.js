// ==UserScript==
// @name         PunkX Bypass | AdMavenshort + Linkvertise
// @namespace    Combined Bypass Scripts
// @version      2.6.2
// @description:es  Bypass instantáneo y auto-copy keys en Pandadevelopment
// @description  Instant bypass and auto-copy keys in Pandadevelopment
// @author       TheRealBanHammer | Mw_Anonymous
// @match        https://rapid-links.net/s*
// @match        https://rapid-links.com/s* 
// @match        https://linkvertise.com/*/*
// @match        https://pandadevelopment.net/getkey*
// @match        https://*.pandadevelopment.net/getkey*
// @match        https://new.pandadevelopment.net/getkey*
// @match        https://linkvertise-bypass.com/*
// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/User.js
// @downloadURL  https://flopphub-team.github.io/UserScript/User.js
// @require      https://flopphub-team.github.io/UserScript/Anti-Anuncios-By-BanHammer.js
// @require      https://update.greasyfork.org/scripts/462314/hCaptcha%20Autoclick.user.js 
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;
    const currentUrl = window.location.href;
    const originalLinkvertiseUrl = sessionStorage.getItem('originalLinkvertiseUrl');

    if (hostname.includes('linkvertise-bypass.com')) {
        if (sessionStorage.getItem('redirectedFromInterstitial') === 'true') {
            sessionStorage.removeItem('redirectedFromInterstitial');
            sessionStorage.removeItem('originalLinkvertiseUrl');
            
            let attempts = 0;
            const maxAttempts = 600;
            const interval = setInterval(() => {
                attempts++;
                if (attempts > maxAttempts) {
                    clearInterval(interval);
                    return;
                }

                const buttons = document.querySelectorAll('button, a, div[role="button"], input[type="button"]');
                for (const btn of buttons) {
                    const text = (btn.textContent || btn.innerText || btn.value || '').toLowerCase();
                    if (text.includes('access') && text.includes('pandadevelopment')) {
                        btn.click();
                        clearInterval(interval);
                        return;
                    }
                }
            }, 500);
            return;
        }

        if (originalLinkvertiseUrl) {
            sessionStorage.setItem('pendingBypass', 'true');
            window.location.replace(originalLinkvertiseUrl);
            return;
        }

        let attempts = 0;
        const maxAttempts = 600;
        const interval = setInterval(() => {
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(interval);
                return;
            }

            const buttons = document.querySelectorAll('button, a, div[role="button"], input[type="button"]');
            for (const btn of buttons) {
                const text = (btn.textContent || btn.innerText || btn.value || '').toLowerCase();
                if (text.includes('access') && text.includes('pandadevelopment')) {
                    btn.click();
                    clearInterval(interval);
                    return;
                }
            }
        }, 500);
        return;
    }

    if (hostname.includes('linkvertise.com') || hostname.includes('rapid-links.com') || hostname.includes('rapid-links.net')) {
        if (sessionStorage.getItem('pendingBypass') === 'true') {
            sessionStorage.removeItem('pendingBypass');
            sessionStorage.setItem('redirectedFromInterstitial', 'true');
            
            setTimeout(() => {
                window.location.replace('https://linkvertise-bypass.com/bypass?link=' + encodeURIComponent(currentUrl));
            }, 3000);
            return;
        }

        sessionStorage.setItem('originalLinkvertiseUrl', currentUrl);
        window.location.replace('https://linkvertise-bypass.com/bypass?link=' + encodeURIComponent(currentUrl));
        return;
    }

    if (hostname.includes('pandadevelopment.net')) {

        class PandaKeyAutoCopy {
            constructor() {
                this.hasCopied = false;
                this.keyPattern = /punkx\s*-+\s*[a-z0-9]+/i;
                this.attempts = 0;
                this.maxAttempts = 60;
            }

            start() {
                if (this.hasCopied) return;

                console.log('[PandaDev AutoCopy] Iniciado en ' + hostname);

                this.pollForButton();

                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.pollForButton());
                }
            }

            pollForButton() {
                const interval = setInterval(() => {
                    if (this.hasCopied || this.attempts >= this.maxAttempts) {
                        clearInterval(interval);
                        if (!this.hasCopied) this.fallbackExtract();
                        return;
                    }

                    this.attempts++;
                    const button = this.findCopyButton();

                    if (button) {
                        clearInterval(interval);
                        console.log('[PandaDev AutoCopy] Botón encontrado, intentando click');
                        this.simulateHumanClick(button);
                    }
                }, 500);
            }

            findCopyButton() {
                const candidates = [];

                const allElements = document.querySelectorAll('button, div, span, a, input');
                for (const el of allElements) {
                    const text = el.textContent.toLowerCase().trim();
                    const hasCopyText = text.includes('copy') && (text.includes('key') || text.length < 20);
                    const isVisible = this.isVisible(el);
                    const isClickable = el.tagName === 'BUTTON' || 
                                       el.onclick || 
                                       el.getAttribute('role') === 'button' ||
                                       el.style.cursor === 'pointer' ||
                                       window.getComputedStyle(el).cursor === 'pointer';

                    if (hasCopyText && isVisible) {
                        candidates.push({el, priority: 10});
                    } else if (text === 'copy' && isVisible) {
                        candidates.push({el, priority: 8});
                    } else if (el.getAttribute('data-clipboard-text') && isVisible) {
                        candidates.push({el, priority: 9});
                    }
                }

                if (candidates.length > 0) {
                    candidates.sort((a, b) => b.priority - a.priority);
                    return candidates[0].el;
                }

                const specificSelectors = [
                    'button[class*="copy"]',
                    'button[id*="copy"]',
                    '[data-clipboard-text]',
                    '[data-key]',
                    '.copy-btn',
                    '.btn-copy',
                    'button:has(svg)',
                    '.MuiButton-root',
                    '[class*="MuiButton"]'
                ];

                for (const selector of specificSelectors) {
                    try {
                        const el = document.querySelector(selector);
                        if (el && this.isVisible(el)) return el;
                    } catch(e) {}
                }

                return null;
            }

            isVisible(el) {
                if (!el) return false;
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return !!(rect.width && rect.height && 
                         style.display !== 'none' && 
                         style.visibility !== 'hidden' &&
                         rect.top >= 0 &&
                         rect.left >= 0);
            }

            simulateHumanClick(element) {
                const rect = element.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;

                const events = [
                    new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y }),
                    new MouseEvent('mouseenter', { bubbles: true, cancelable: true, clientX: x, clientY: y }),
                    new MouseEvent('mouseover', { bubbles: true, cancelable: true, clientX: x, clientY: y }),
                    new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y }),
                    new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y }),
                    new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y })
                ];

                let delay = 0;
                events.forEach((event, index) => {
                    setTimeout(() => {
                        element.dispatchEvent(event);
                    }, delay);
                    delay += 50 + Math.random() * 50;
                });

                setTimeout(() => {
                    element.click();

                    const dataKey = element.getAttribute('data-clipboard-text') || 
                                   element.getAttribute('data-key');
                    if (dataKey) {
                        GM_setClipboard(dataKey);
                        this.success(dataKey);
                        return;
                    }

                    setTimeout(() => this.checkClipboard(), 300);
                }, delay + 100);
            }

            async checkClipboard() {
                try {
                    const text = await navigator.clipboard.readText();
                    if (text && this.keyPattern.test(text)) {
                        this.success(text);
                        return;
                    }
                } catch(e) {}

                this.fallbackExtract();
            }

            fallbackExtract() {
                const selectors = [
                    'input[type="text"]',
                    'textarea',
                    'code',
                    'pre',
                    '[class*="key"]',
                    '[id*="key"]',
                    'div[class*="MuiBox"]',
                    'div[class*="container"]'
                ];

                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        const text = (el.value || el.textContent || '').trim();
                        const match = text.match(/punkx\s*-+\s*[a-z0-9-]+/i);
                        if (match) {
                            GM_setClipboard(match[0]);
                            this.success(match[0]);
                            return;
                        }
                    }
                }

                const bodyText = document.body.innerText || document.body.textContent;
                const match = bodyText.match(/punkx\s*-+\s*[a-z0-9-]+/i);
                if (match) {
                    GM_setClipboard(match[0]);
                    this.success(match[0]);
                    return;
                }

                console.error('[PandaDev AutoCopy] No se encontró la key');
            }

            success(key) {
                if (this.hasCopied) return;
                this.hasCopied = true;

                GM_setClipboard(key);
                GM_notification({
                    text: 'Key copiada: ' + key,
                    title: "PandaDevelopment AutoCopy",
                    timeout: 4000
                });
                console.log('[PandaDev AutoCopy] Éxito: ' + key);
            }
        }

        const autoCopy = new PandaKeyAutoCopy();
        autoCopy.start();

        return;
    }
})();
