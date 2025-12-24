// ==UserScript==
// @name         Bypass.vip + PandaDev AutoCopy
// @namespace    bypass-pandadev-combined
// @version      1.5.1
// @description  Bypass ad-links + auto-copy keys on pandadevelopment.net
// @author       bypass.vip | Mw_Anonymous (Adapted)
// @match        *://loot-link.com/*
// @match        *://loot-links.com/*
// @match        *://lootdest.com/*
// @match        *://direct-links.net/*
// @match        *://lootdest.org/*
// @match        *://lootlinks.co/*
// @match        *://direct-link.net/*
// @match        *://links-loot.com/*
// @match        *://lootlinks.com/*
// @match        *://link-target.org/*
// @match        *://loot-labs.com/*
// @match        *://lootlabs.com/*
// @match        *://link-hub.net/*
// @match        *://lootdest.info/*
// @match        *://link-target.net/*
// @match        *://lootlink.org/*
// @match        *://linkvertise.com/*/*
// @match        https://pandadevelopment.net/getkey?*
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

(async () => {
    'use strict';
    
    if (window.top !== window.self) return;

    const hostname = window.location.hostname;

    if (hostname.includes('pandadevelopment.net')) {
        
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
                    } catch (e) {}
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
        
        return;
    }

    const config = {
        time: 1,
        key: '',
        safeMode: true
    };

    function createContainer() {
        const container = document.createElement('div');
        container.id = 'userscript-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #121212;
            color: #e0e0e0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px;
            z-index: 2147483647;
            font-family: 'Arial', sans-serif;
            overflow: auto;
            box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
            pointer-events: auto;
        `;
        container.innerHTML = `
            <h2 style="font-size: 2em; margin-bottom: 15px; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">BYPASS.VIP USERSCRIPT</h2>
            <p style="margin-bottom: 30px; font-size: 1.1em; color: #b0b0b0;">Click the button below to proceed to the bypassed link.</p>
            <div id="countdown" style="font-size: 1.3em; margin-bottom: 30px; padding: 10px; background: #1e1e1e; border-radius: 8px; width: 80%; max-width: 600px;"></div>
            <button id="nextBtn" type="button" style="
                padding: 12px 24px;
                background-color: #1E88E5;
                color: #ffffff;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.2s;
                font-size: 1.1em;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                position: relative;
                z-index: 2147483647;
                pointer-events: auto;
            ">Next</button>
            <div id="errorMsg" style="color: #ff4d4d; margin-top: 30px; display: none; font-size: 1.1em; background: #2a2a2a; padding: 10px; border-radius: 8px;"></div>
            <div id="spinner" style="border: 5px solid #333333; border-top: 5px solid #1E88E5; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; display: none; margin-top: 20px;"></div>
            <style>
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                #nextBtn:hover { background-color: #1565C0; transform: translateY(-2px); }
                #nextBtn:active { transform: translateY(0); }
                #nextBtn:disabled {
                    pointer-events: none;
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            </style>
        `;
        return container;
    }

    function showError(message) {
        const errorEl = document.getElementById('errorMsg');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        console.error(message);
    }

    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runScript, { once: true });
        } else {
            runScript();
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
                        throw new Error('Invalid redirect URL after decoding');
                    }
                } catch (err) {
                    showError('Error: Invalid or malformed redirect URL. Please try again.');
                    return;
                }
            }

            const container = createContainer();
            if (document.body) {
                document.body.appendChild(container);
            } else {
                document.documentElement.appendChild(container);
            }

            const countdownEl = container.querySelector('#countdown');
            const btn = container.querySelector('#nextBtn');
            const spinner = container.querySelector('#spinner');

            const newBtn = btn;
            const hasHash = (url) => {
                try {
                    return new URL(url).searchParams.has('hash') || url.includes('hash=');
                } catch {
                    return url.includes('hash=');
                }
            };

            if (hasHash(redirectUrl)) {
                let time = 8;
                countdownEl.style.color = '#ff4d4d';
                countdownEl.style.fontWeight = 'bold';
                const interval = setInterval(() => {
                    countdownEl.textContent = `YOU HAVE EXACTLY ${time} SECONDS TO CLICK THE BUTTON BEFORE YOUR HASH EXPIRES`;
                    time--;
                    if (time < 0) {
                        clearInterval(interval);
                        countdownEl.textContent = 'HASH EXPIRED. RETRYING...';
                        countdownEl.style.color = '';
                        countdownEl.style.fontWeight = '';
                        newBtn.disabled = true;
                        spinner.style.display = 'block';
                        setTimeout(() => {
                            location.replace(location.href.split('?')[0]);
                        }, 3500);
                    }
                }, 1000);
            } else {
                countdownEl.style.display = 'none';
            }

            const performRedirect = () => {
                if (!redirectUrl || newBtn.disabled) return;
                try {
                    newBtn.disabled = true;
                    spinner.style.display = 'block';
                    setTimeout(() => {
                        try {
                            window.location.assign(redirectUrl);
                        } catch (err) {
                            window.location.href = redirectUrl;
                        }
                    }, 60);
                } catch (err) {
                    showError('Redirect failed. Please copy and open the link manually: ' + redirectUrl);
                    newBtn.disabled = false;
                    spinner.style.display = 'none';
                }
            };

            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                performRedirect();
            }, { passive: false });

            newBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                performRedirect();
            }, { passive: false });

            container.addEventListener('click', (e) => {
                if (e.target && e.target.id === 'nextBtn') return;
            });

            try {
                newBtn.setAttribute('aria-label', 'Proceed to link');
                newBtn.tabIndex = 0;
            } catch (err) {}
        }
    } catch (err) {
        console.error('Userscript error:', err);
        if (document.body) {
            document.body.innerHTML = `<div style="color: #ff4d4d; text-align: center; padding: 40px; background: #121212; height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 1.2em;">Error in bypass script: ${err && err.message ? err.message : err}. Please reload the page.</div>`;
        }
    }
})();
