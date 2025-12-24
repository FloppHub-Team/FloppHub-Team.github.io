// ==UserScript==
// @name          BYPASS.VIP BYPASSER
// @namespace     bypass.vip
// @version       1.4.4
// @author        bypass.vip
// @description   Bypass ad-links using the bypass.vip API and get to your destination without ads!
// @match         *://loot-link.com/*
// @match         *://loot-links.com/*
// @match         *://lootdest.com/*
// @match         *://direct-links.net/*
// @match         *://lootdest.org/*
// @match         *://lootlinks.co/*
// @match         *://direct-link.net/*
// @match         *://links-loot.com/*
// @match         *://lootlinks.com/*
// @match         *://link-target.org/*
// @match         *://loot-labs.com/*
// @match         *://lootlabs.com/*
// @match         *://link-hub.net/*
// @match         *://lootdest.info/*
// @match         *://link-target.net/*
// @match         *://lootlink.org/*
// @match         *://linkvertise.com/*/*
// @exclude       https://pandadevelopment.net/getkey?*
// @downloadURL   https://raw.githubusercontent.com/bypass-vip/userscript/master/bypass-vip.user.js
// @updateURL     https://raw.githubusercontent.com/bypass-vip/userscript/master/bypass-vip.user.js
// @homepageURL   https://bypass.vip
// @icon          https://www.google.com/s2/favicons?domain=bypass.vip&sz=64
// @run-at        document-start
// ==/UserScript==
(async () => {
    'use strict';
    if (window.top !== window.self) {return;};
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

            const newBtn = btn; // element is controlled by us; no need to clone
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
            } catch (err) { /* silent */ }
        }
    } catch (err) {
        console.error('Userscript error:', err);
        if (document.body) {
            document.body.innerHTML = `<div style="color: #ff4d4d; text-align: center; padding: 40px; background: #121212; height: 100vh; display: flex; align-items: center; justify-content: center; font-size: 1.2em;">Error in bypass script: ${err && err.message ? err.message : err}. Please reload the page.</div>`;
        }
    }
})();
