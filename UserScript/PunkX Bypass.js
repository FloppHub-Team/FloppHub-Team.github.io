// ==UserScript==
// @name         PunkX & Pandadev Bypass
// @namespace    punkX-bypass-exclusive


// @version      1.0
// @description  Exklusive Umgehung für PunkX (Pandadev) 
// @author       Mw_Anonymous | TheRealBanHammer


// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js
// @downloadURL  https://flopphub-team.github.io/UserScript/PunkX%20Bypass.js


// @match        https://pandadevelopment.net/getkey?*
// @match        https://linkvertise.com/*
// @match        https://short-jambo.com/*
// @match        https://loot-link.com/s?*
// @match        https://loot-links.com/s?*
// @match        https://lootlink.org/s?*
// @match        https://lootlinks.co/s?*


// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab


// @connect      pandadevelopment.net
// @connect      linkvertise.com
// @connect      short-jambo.com
// @connect      loot-link.com
// @connect      loot-links.com
// @connect      lootlink.org
// @connect      lootlinks.co


// @run-at       document-end
// ==/UserScript==

console.log('[Pandadev Bypass] Skript geladen auf:', window.location.href);

// === WICHTIGE HELPER-FUNKTIONEN ===

function handleError(error) {
    const errorText = error.message ? error.message : error;
    alert('[Pandadev Bypass] ' + errorText);
    GM_notification({
        text: errorText,
        title: "Pandadev Bypass FEHLER",
        url: '',
        silent: true,
    });
    GM.openInTab('');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function linkvertiseSpoof(link) {
    return new Promise((resolve, reject) => {
        console.log('[Pandadev Bypass] Spoofe Linkvertise:', link);
        GM.xmlhttpRequest({
            method: "GET",
            url: link,
            headers: { Referer: 'https://linkvertise.com/' },
            onload: response => {
                console.log('[Pandadev Bypass] Spoof erfolgreich:', response.status);
                resolve(response.responseText);
            },
            onerror: error => {
                console.error('[Pandadev Bypass] Spoof fehlgeschlagen:', error);
                reject(error);
            }
        });
    });
}

async function getTurnstileResponse() {
    notification('Bitte löse das Turnstile-Captcha', 3000);
    const notif = setInterval(() => notification('Bitte löse das Turnstile-Captcha', 5000), 6000);
    let res = '';
    while (true) {
        try {
            res = turnstile.getResponse();
            if (res) {
                clearInterval(notif);
                notification('Captcha gelöst!', 2000);
                break;
            }
        } catch (e) { }
        await sleep(1000);
    }
    return res;
}

function notification(message, timeout) {
    const config = {
        text: message,
        title: "Pandadev Bypass",
        silent: true
    };
    if (timeout) config.timeout = timeout;
    GM_notification(config);
    console.log('[Pandadev Bypass] Benachrichtigung:', message);
}

function base64decode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
}

// === ADSPOOF FÜR UMLEITUNG MIT HEADERS ===

function adSpoof(url, referrer) {
    return new Promise((resolve, reject) => {
        console.log('[Pandadev Bypass] adSpoof() leitet weiter zu:', url);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            anonymous: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; GO3C Build/OPM2.171019.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.4324.141 Mobile Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                "Referer": referrer,
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1"
            },
            onload: function(response) {
                console.log('[Pandadev Bypass] adSpoof erfolgreich, leite weiter zu:', url);
                window.location.href = url;
                resolve();
            },
            onerror: function(error) {
                console.error('[Pandadev Bypass] adSpoof fehlgeschlagen:', error);
                reject(error);
            }
        });
    });
}

// === LVDL - VERWALTET WEITERLEITUNG VON LINKVERTISE/LOOTLINK ===

async function lvdl() {
    console.log('[Pandadev Bypass] lvdl() prüft auf r-Parameter...');
    const url = new URL(window.location.href);
    const rParam = url.searchParams.get("r");
    
    if (rParam) {
        try {
            const decodedUrl = atob(rParam);
            console.log('[Pandadev Bypass] r-Parameter gefunden, dekodierte URL:', decodedUrl);
            notification('Bypassiere Ad-Link...', 3000);
            await adSpoof(decodedUrl, window.location.hostname);
            return true;
        } catch (e) {
            console.error('[Pandadev Bypass] Fehler beim Dekodieren des r-Parameters:', e);
            handleError(e);
            return true; // Verhindert weitere Ausführung
        }
    }
    
    // Verwalte auch das Format &url= für short-jambo und Varianten
    const urlParam = url.search.split('&url=')[1];
    if (urlParam) {
        console.log('[Pandadev Bypass] url-Parameter gefunden:', urlParam);
        notification('Bypassiere Ad-Link...', 3000);
        await adSpoof(decodeURIComponent(urlParam), window.location.hostname);
        return true;
    }
    
    console.log('[Pandadev Bypass] Kein r/url-Parameter gefunden, fahre fort...');
    return false;
}

// === HAUPTFUNKTION PANDADEV ===

async function pandadevelopment() {
    console.log('[Pandadev Bypass] Führe pandadevelopment() aus');
    let antiAdblockRemover = setInterval(removeAntiAdblock, 500);

    if (document.documentElement.innerHTML.includes('you got the key')) {
        notification('Bypass erfolgreich abgeschlossen! Du hast den Schlüssel erhalten.', 5000);
        console.log('[Pandadev Bypass] Schlüssel erhalten, stoppe...');
        return;
    }
    
    // Wenn kein Formular vorhanden ist, suche manuell nach Provider-Links
    if (!document.getElementsByTagName('form').length) {
        console.log('[Pandadev Bypass] Kein Formular gefunden, suche nach Provider-Links...');
        let providers = Array.from(document.getElementsByTagName('a'));
        let supportedProviders = ['Linkvertise', 'Short Jambo'];
        
        for (let provider of providers) {
            let providerName = provider.firstChild?.innerHTML;
            if (supportedProviders.includes(providerName)) {
                console.log('[Pandadev Bypass] Provider-Link gefunden:', providerName, '->', provider.href);
                notification(`Weiterleitung zu ${providerName}...`, 2000);
                window.location.assign(provider.href);
                return;
            }
        }
        throw new Error('Kein unterstützter Ad-Provider gefunden');
    }
    
    function getAdLink() {
        let form = document.getElementsByTagName('form')[0];
        let data = new FormData(form);
        console.log('[Pandadev Bypass] Sende Formular an:', form.action);
        return new Promise(async (resolve, reject) => {
            GM.xmlhttpRequest({
                method: "POST",
                url: form.action,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': window.location.href,
                },
                data: new URLSearchParams(data),
                onload: function (response) {
                    console.log('[Pandadev Bypass] Formular gesendet, finale URL:', response.finalUrl);
                    resolve(response.finalUrl);
                },
                onerror: function (error) {
                    console.error('[Pandadev Bypass] Formular-Sendung fehlgeschlagen:', error);
                    reject(error);
                }
            });
        });
    }
    
    function getDestUrl(link) {
        let url = new URL(encodeURI(link));
        console.log('[Pandadev Bypass] Extrahiere Ziel von:', url.hostname, link);
        
        switch (url.hostname) {
            case 'linkvertise.com': {
                const r = url.searchParams.get('r');
                if (!r) throw new Error('Kein r-Parameter in Linkvertise-URL');
                return atob(r);
            }
            case 'short-jambo.com': {
                const parts = url.search.split('&url=');
                if (parts.length < 2) throw new Error('Kein url-Parameter in Short-Jambo-URL');
                return parts[1];
            }
            default: {
                // Verwalte Loot-Link-Varianten, wenn sie als Provider kommen
                if (new URL(window.location.href).searchParams.get('provider')) {
                    console.log('[Pandadev Bypass] Provider-Parameter erkannt, gebe false zurück');
                    return false;
                }
                throw new Error(`Nicht unterstützter Ad-Provider: ${url.hostname}`);
            }
        }
    }
    
    function removeAntiAdblock() {
        try {
            let antiAdblock = document.getElementsByClassName('adblock_title')[0];
            if (antiAdblock) {
                while (antiAdblock.parentElement && antiAdblock.parentElement !== document.body) {
                    antiAdblock = antiAdblock.parentElement;
                }
                if (antiAdblock.parentElement === document.body) {
                    antiAdblock.remove();
                    clearInterval(antiAdblockRemover);
                    console.log('[Pandadev Bypass] Anti-Adblock entfernt');
                }
            }
        } catch (e) { }
    }
    
    const customSleepTimes = {
        'vegax': 11000,
        'laziumtools': 11000,
        'adelhub': 11000,
        'neoxkey': 16000,
    };
    
    try {
        let currentUrl = new URL(window.location.href);
        let hwid = currentUrl.searchParams.get('hwid');
        let service = currentUrl.searchParams.get('service');
        let token = currentUrl.searchParams.get('sessiontoken');
        let provider = currentUrl.searchParams.get('provider');

        console.log('[Pandadev Bypass] Parameter - HWID:', hwid, 'Service:', service, 'Token:', token, 'Provider:', provider);

        if (document.getElementById('cf-turnstile')) {
            console.log('[Pandadev Bypass] Turnstile-Captcha erkannt, warte...');
            await getTurnstileResponse();
        }

        let adUrl = await getAdLink(hwid, service, token);
        let dest = getDestUrl(adUrl);
        
        if (!dest) {
            console.log('[Pandadev Bypass] Keine Ziel-URL, kehre zurück zu Pandadev...');
            window.location.assign(`https://pandadevelopment.net/getkey?hwid=${hwid}&service=${service}`);
            return;
        }

        let sleepTime = customSleepTimes[service] || 3000;
        console.log('[Pandadev Bypass] Schlafe für:', sleepTime, 'ms');
        await sleep(sleepTime);

        console.log('[Pandadev Bypass] Spoofe Ad-Ansicht...');
        await linkvertiseSpoof(dest);
        notification(`Stufe abgeschlossen (${service})`, 3000);

        await sleep(3000);

        let newUrl = new URL(dest);
        token = newUrl.searchParams.get('sessiontoken');
        let nextCheckpoint = `https://pandadevelopment.net/getkey?hwid=${hwid}&service=${service}`;
        if (token) nextCheckpoint += `&sessiontoken=${token}`;
        if (provider) nextCheckpoint += `&provider=${provider}`;
        
        console.log('[Pandadev Bypass] Kehre zurück zu Checkpoint:', nextCheckpoint);
        window.location.assign(nextCheckpoint);
    }
    catch (e) {
        handleError(e);
    }
}

// === AUTOMATISCHE AUSFÜHRUNGSLOGIK ===

(async function() {
    console.log('[Pandadev Bypass] Auto-Ausführung gestartet für Hostname:', window.location.hostname);
    
    // 1. Zuerst lvdl() versuchen (für Linkvertise/Lootlink mit r-Parameter)
    const handledByLvdl = await lvdl();
    if (handledByLvdl) {
        console.log('[Pandadev Bypass] Ausführung von lvdl() behandelt, stoppe...');
        return;
    }
    
    // 2. Wenn es nicht lvdl ist, führe funktionsspezifische Funktion nach Hostname aus
    const hostname = window.location.hostname;
    
    if (hostname === 'pandadevelopment.net') {
        console.log('[Pandadev Bypass] pandadevelopment.net erkannt, starte Bypass...');
        notification('Pandadev-Bypass gestartet', 3000);
        await pandadevelopment();
    } else if (hostname.includes('linkvertise.com') || 
               hostname.includes('loot-link.com') || 
               hostname.includes('loot-links.com') || 
               hostname.includes('lootlink.org') || 
               hostname.includes('lootlinks.co')) {
        console.log('[Pandadev Bypass] Ad-Link erkannt, aber kein r-Parameter, warte...');
        // Wenn wir hier ankommen, sind wir auf einer Ad-Link-Seite ohne r-Parameter
        // Dies könnte bedeuten, dass wir warten oder neu laden müssen
        notification('Ad-Link erkannt, verarbeite...', 2000);
    } else {
        console.log('[Pandadev Bypass] Nicht unterstützter Hostname:', hostname);
    }
    
    console.log('[Pandadev Bypass] Auto-Ausführung abgeschlossen');
})();
 
