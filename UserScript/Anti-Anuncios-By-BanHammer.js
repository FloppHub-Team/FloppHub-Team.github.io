// ==UserScript==
// @name         Bypass.city Ad Redirect Blocker
// @namespace    bypass-city-ad-blocker
// @version      1.0.2
// @description  Blocks all ad redirects on bypass.city except pandadevelopment.net and bypass.city
// @match        https://bypass.city/*
// @match        
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    const ALLOWED_HOSTS = ['pandadevelopment.net', 'bypass.city', 'adbypass.org'];
    
    const isAllowedUrl = (url) => {
        try {
            const urlObj = new URL(url, window.location.origin);
            return ALLOWED_HOSTS.some(host => urlObj.hostname.includes(host));
        } catch (e) {
            return false;
        }
    };
    
    window.open = new Proxy(window.open, {
        apply: function(target, thisArg, argumentsList) {
            const [url] = argumentsList;
            if (url && isAllowedUrl(url)) {
                return target.apply(thisArg, argumentsList);
            }
            console.log('[Blocker] Blocked:', url);
            return null;
        }
    });
    
    ['assign', 'replace'].forEach(method => {
        const original = window.location[method].bind(window.location);
        window.location[method] = function(url) {
            if (isAllowedUrl(url)) {
                return original(url);
            }
            console.log('[Blocker] Blocked location.' + method + ':', url);
        };
    });
    
    document.addEventListener('click', function(e) {
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        if (target && target.href && !isAllowedUrl(target.href)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('[Blocker] Blocked link:', target.href);
        }
    }, true);
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'IFRAME' || node.tagName === 'SCRIPT') {
                    const src = node.src || '';
                    if (src && !isAllowedUrl(src)) {
                        node.remove();
                        console.log('[Blocker] Removed element:', src);
                    }
                }
            });
        });
    });
    
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

