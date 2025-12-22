// ==UserScript==
// @name         WorkInk Bypass
// @namespace    workink.bypass
// @version      0.1
// @description  Bypass for work.ink and related domains
// @author       FloppHub Team
// @match        *://work.ink/*
// @grant        none
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    function hasCloudflare() {
        const pageText = document.body && document.body.innerText ? document.body.innerText : '';
        const pageHTML = document.documentElement && document.documentElement.innerHTML ? document.documentElement.innerHTML : '';
        return pageText.includes('Just a moment') || pageHTML.includes('Just a moment');
    }
    
    function extractAdsLuarmorUrl(value) {
        try {
            const s = typeof value === 'string' ? value : JSON.stringify(value || '');
            const m = s.match(/https:\/\/ads\.luarmor\.net[^\s"'<>]*/i);
            return m ? m[0] : null;
        } catch (e) {
            return null;
        }
    }
    
    function showCountdownRedirect(url, waitSeconds) {
        if (document.getElementById('countdown-modal')) return;
        const wrap = document.createElement('div');
        wrap.id = 'countdown-modal';
        wrap.style.position = 'fixed';
        wrap.style.top = '0';
        wrap.style.left = '0';
        wrap.style.width = '100%';
        wrap.style.height = '100%';
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.justifyContent = 'center';
        wrap.style.zIndex = '2147483647';
        wrap.style.background = 'rgba(0,0,0,0.6)';
        
        const box = document.createElement('div');
        box.style.width = 'min(520px,94%)';
        box.style.background = 'linear-gradient(180deg,#000,#0b0b0b)';
        box.style.color = 'white';
        box.style.borderRadius = '10px';
        box.style.padding = '18px';
        box.style.boxShadow = '0 14px 60px rgba(0,0,0,0.6)';
        box.style.border = '2px solid #000000';
        box.style.fontFamily = "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial";
        box.style.textAlign = 'center';
        
        const title = document.createElement('div');
        title.style.fontSize = '16px';
        title.style.fontWeight = '800';
        title.style.marginBottom = '8px';
        title.textContent = 'Wait to Redirect';
        
        const msg = document.createElement('div');
        msg.style.fontSize = '14px';
        msg.style.marginBottom = '12px';
        msg.style.color = 'white';
        msg.textContent = 'Wait ';
        
        const countdownNumber = document.createElement('span');
        countdownNumber.style.fontWeight = '800';
        countdownNumber.style.fontSize = '20px';
        countdownNumber.style.marginLeft = '8px';
        countdownNumber.textContent = String(waitSeconds);
        
        const msgSuffix = document.createElement('span');
        msgSuffix.textContent = ' seconds then click Next to redirect';
        
        msg.appendChild(countdownNumber);
        msg.appendChild(msgSuffix);
        
        const btnWrap = document.createElement('div');
        btnWrap.style.display = 'flex';
        btnWrap.style.justifyContent = 'center';
        btnWrap.style.gap = '10px';
        btnWrap.style.marginTop = '12px';
        
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = true;
        nextBtn.style.padding = '10px 16px';
        nextBtn.style.borderRadius = '8px';
        nextBtn.style.fontWeight = '800';
        nextBtn.style.cursor = 'not-allowed';
        nextBtn.style.border = 'none';
        nextBtn.style.background = 'linear-gradient(90deg,#999,#b5b5b5)';
        nextBtn.style.color = '#111';
        
        btnWrap.appendChild(nextBtn);
        box.appendChild(title);
        box.appendChild(msg);
        box.appendChild(btnWrap);
        wrap.appendChild(box);
        document.body.appendChild(wrap);
        
        let remaining = parseInt(waitSeconds, 10) || 8;
        countdownNumber.textContent = String(remaining);
        const interval = setInterval(() => {
            remaining -= 1;
            if (remaining < 0) remaining = 0;
            countdownNumber.textContent = String(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                nextBtn.disabled = false;
                nextBtn.style.cursor = 'pointer';
                nextBtn.style.background = 'linear-gradient(90deg,#ff4d4d,#ff7373)';
            }
        }, 1000);
        
        nextBtn.addEventListener('click', () => {
            if (nextBtn.disabled) return;
            clearInterval(interval);
            try {
                window.location.href = url;
            } catch (e) {
                const el = document.getElementById('countdown-modal');
                if (el && el.parentNode) el.parentNode.removeChild(el);
                alert('Redirect: ' + url);
            }
            const el = document.getElementById('countdown-modal');
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
    }
    
    function handleWorkInk() {
        if (hasCloudflare()) return;
        const currentFullUrl = window.location.href;
        const apiUrl = 'https://api-workink.vercel.app/bypass?url=' + encodeURIComponent(currentFullUrl);
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        })
        .then(r => r.json().catch(() => ({})))
        .then(data => {
            if (data && (data.status === 'success' || data.success === true)) {
                const resultVal = data.result;
                const adsUrl = extractAdsLuarmorUrl(resultVal);
                if (adsUrl) {
                    showCountdownRedirect(adsUrl, 8);
                    return;
                }
                if (typeof resultVal === 'string' && resultVal.trim().length > 0) {
                    const trimmed = resultVal.trim();
                    if (trimmed.match(/^https?:\/\//i)) {
                        try {
                            window.location.href = trimmed;
                        } catch (e) {
                            alert('Redirect: ' + trimmed);
                        }
                        return;
                    }
                    alert('Result: ' + trimmed);
                    return;
                }
                alert('Result: ' + JSON.stringify(resultVal, null, 2));
            } else {
                const errMsg = (data && (data.message || data.error || JSON.stringify(data))) || 'Unknown error';
                alert('Error: ' + String(errMsg));
            }
        })
        .catch(err => {
            alert('Bypass failed');
        });
    }
    
    function run() {
        if (hasCloudflare()) return;
        handleWorkInk();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
