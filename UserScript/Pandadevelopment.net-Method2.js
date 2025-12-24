// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    pandadevelopment.net-bypass-exclusive


// @version      1.0.1
// @description  Automatische Key-Kopierung ohne Klick-System
// @author       Mw_Anonymous | Bypass.vip

// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/Pandadevelopment.net-Method2.js
// @downloadURL  https://flopphub-team.github.io/UserScript/Pandadevelopment.net-Method2.js
// @require      https://flopphub-team.github.io/UserScript/Bypassvip.js
// @require      https://update.greasyfork.org/scripts/397070/Anti-AdBlocker%20Fuckoff.user.js


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


// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard


// @connect      *


// @run-at       document-start
// ==/UserScript==


(function() {
    'use strict';
    
    class AutoContinue {
        constructor() {
            this.targetText = 'Continue to Next Step';
        }

        async start() {
            const button = await this.waitForButton();
            if (button) {
                this.clickButton(button);
            }
        }

        waitForButton() {
            return new Promise(resolve => {
                let attempts = 0;
                const maxAttempts = 50;
                
                const check = () => {
                    attempts++;
                    const button = this.findButton();
                    
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

        findButton() {
            const selectors = ['button', 'input[type="button"]', 'a.btn', 'a.button'];
            
            for (let selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (let el of elements) {
                    if (el.textContent.trim() === this.targetText || el.value === this.targetText) {
                        return el;
                    }
                }
            }
            return null;
        }

        clickButton(button) {
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                button: 0
            });
            button.dispatchEvent(clickEvent);
        }
    }

    const autoContinue = new AutoContinue();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => autoContinue.start());
    } else {
        autoContinue.start();
    }
})();

