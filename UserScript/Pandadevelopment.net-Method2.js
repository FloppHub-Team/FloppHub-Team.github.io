// ==UserScript==
// @name         PunkX & Pandadev Bypass - AutoCopy Key
// @namespace    pandadevelopment.net-bypass-exclusive


// @version      1.0.3
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
            this.maxTotalAttempts = 20;
            this.attemptsPerButton = 5;
            this.delayBetweenAttempts = 150;
            this.totalAttempts = 0;
        }

        start() {
            this.scanAndClick();
            this.setupObserver();
        }

        setupObserver() {
            const observer = new MutationObserver(() => {
                this.scanAndClick();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        scanAndClick() {
            if (this.totalAttempts >= this.maxTotalAttempts) return;
            
            const button = this.findButton();
            if (button) {
                this.clickMultipleTimes(button);
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

        clickMultipleTimes(button) {
            let clickCount = 0;
            const interval = setInterval(() => {
                if (clickCount >= this.attemptsPerButton || this.totalAttempts >= this.maxTotalAttempts) {
                    clearInterval(interval);
                    return;
                }
                
                this.simulateRealClick(button);
                clickCount++;
                this.totalAttempts++;
            }, this.delayBetweenAttempts);
        }

        simulateRealClick(button) {
            const events = [
                new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }),
                new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }),
                new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }),
                new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 })
            ];
            
            events.forEach(event => button.dispatchEvent(event));
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
 
