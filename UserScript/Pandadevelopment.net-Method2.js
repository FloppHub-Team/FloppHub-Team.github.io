// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    pandadevelopment.net-bypass-exclusive


// @version      1.0.2
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
            this.targetTextPattern = /continue to next step/i;
            this.observer = null;
        }

        start() {
            this.waitForButton();
        }

        waitForButton() {
            this.observer = new MutationObserver(() => {
                const button = this.findButton();
                if (button) {
                    this.observer.disconnect();
                    this.clickButton(button);
                }
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            const existingButton = this.findButton();
            if (existingButton) {
                this.observer.disconnect();
                this.clickButton(existingButton);
            }
        }

        findButton() {
            const selectors = ['button', 'input[type="button"]', 'a', '[role="button"]', '.btn', '.button'];
            
            for (let selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    for (let el of elements) {
                        const text = (el.textContent || el.value || '').trim();
                        if (this.targetTextPattern.test(text)) {
                            return el;
                        }
                    }
                } catch (e) {}
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AutoContinue().start();
        });
    } else {
        new AutoContinue().start();
    }
})();
 
