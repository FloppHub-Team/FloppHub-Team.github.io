// ==UserScript==
// @name         Bypass.city Ad Redirect Blocker
// @namespace    bypass-city-ad-blocker
// @version      1.0.0
// @description  Blocks all ad redirects on bypass.city except pandadevelopment.net
// @match        https://bypass.city/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    const ALLOWED_HOST = 'pandadevelopment.net';
    
    // Block window.open popups
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
        if (url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                if (urlObj.hostname.includes(ALLOWED_HOST)) {
                    return originalWindowOpen.call(window, url, target || '_blank', features);
                }
            } catch (e) {}
        }
        console.log('[AdBlocker] Blocked popup:', url);
        return null;
    };
    
    // Block location redirects
    let locationBlocked = false;
    Object.defineProperty(window.location, 'href', {
        get: function() { return locationBlocked ? window.location.href : window.location.href; },
        set: function(url) {
            try {
                const urlObj = new URL(url, window.location.origin);
                if (urlObj.hostname.includes(ALLOWED_HOST)) {
                    locationBlocked = true;
                    window.location.assign(url);
                } else {
                    console.log('[AdBlocker] Blocked location redirect:', url);
                }
            } catch (e) {
                console.log('[AdBlocker] Blocked invalid URL:', url);
            }
        },
        configurable: false,
        enumerable: true
    });
    
    // Block link clicks
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        if (target && target.href) {
            try {
                const urlObj = new URL(target.href, window.location.origin);
                if (!urlObj.hostname.includes(ALLOWED_HOST)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    console.log('[AdBlocker] Blocked link click:', target.href);
                }
            } catch (e) {}
        }
    }, true);
    
    // Block form submissions that lead to ads
    const originalFormSubmit = HTMLFormElement.prototype.submit;
    HTMLFormElement.prototype.submit = function() {
        try {
            const actionUrl = this.action || window.location.href;
            const urlObj = new URL(actionUrl, window.location.origin);
            if (!urlObj.hostname.includes(ALLOWED_HOST)) {
                console.log('[AdBlocker] Blocked form submission:', actionUrl);
                return;
            }
        } catch (e) {}
        originalFormSubmit.call(this);
    };
    
    // Clean up any existing ad iframes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IFRAME' || node.tagName === 'SCRIPT') {
                    try {
                        const src = node.src || '';
                        if (src && !new URL(src).hostname.includes(ALLOWED_HOST)) {
                            node.remove();
                            console.log('[AdBlocker] Removed ad element:', src);
                        }
                    } catch (e) {}
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
    
    console.log('[AdBlocker] Initialized - Only allowing redirects to', ALLOWED_HOST);
})();
