// ==UserScript==
// @name         Bypass.vip + PandaDev AutoCopy
// @namespace    bypass-pandadev-combined
// @version      1.6.2
// @description  Bypass ad-links + auto-copy keys on pandadevelopment.net
// @author       bypass.vip | Mw_Anonymous (Adapted)
// @match        *://linkvertise.com/*/*
// @match        https://rapid-links.com/s*
// @match        https://rapid-links.net/s*
// @match        https://pandadevelopment.net/getkey?*
// @match        https://*.pandadevelopment.net/getkey*
// @match        https://new.pandadevelopment.net/getkey*
// @updateURL    https://flopphub-team.github.io/UserScript/Bypassvip.js
// @downloadURL  https://flopphub-team.github.io/UserScript/Bypassvip.js
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

    const config = {
        time: 1,
        key: '',
        safeMode: true
    };

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    function runScript() {
        const urlParams = new URLSearchParams(window.location.search);
        const rawRedirect = urlParams.get('redirect');

        if (!rawRedirect) {
            const targetUrl = `https://bypass.vip/userscript.html?url=${encodeURIComponent(location.href)}&time=${config.time}&key=${config.key}`;
            location.replace(targetUrl);
            return;
        }

        let redirectUrl = rawRedirect;

        if (!isValidUrl(redirectUrl)) {
            try {
                const decoded = decodeURIComponent(rawRedirect);
                if (isValidUrl(decoded)) {
                    redirectUrl = decoded;
                } else {
                    window.location.href = rawRedirect;
                    return;
                }
            } catch (err) {
                window.location.href = rawRedirect;
                return;
            }
        }

        const counter = document.createElement('div');
        counter.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:10px;z-index:9999;font-size:24px;text-align:center;';
        counter.textContent = 'Redirigiendo en 3 segundos...';
        document.body.appendChild(counter);

        let secondsLeft = 3;
        const interval = setInterval(() => {
            secondsLeft--;
            counter.textContent = `Redirigiendo en ${secondsLeft} segundos...`;
            if (secondsLeft <= 0) {
                clearInterval(interval);
                counter.remove();
                console.log('[Bypass.vip] Auto-redirecting to:', redirectUrl);
                window.location.assign(redirectUrl);
            }
        }, 1000);
    }

    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runScript, { once: true });
        } else {
            runScript();
        }
    } catch (err) {
        console.error('Userscript error:', err);
    }
})();
