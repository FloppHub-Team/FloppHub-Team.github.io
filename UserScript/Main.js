// ==UserScript==
// @name         PandaDevelopment + PunkX Exclusive Bypass
// @namespace    PandadevBypass
// @version      1.0
// @description  Exklusiver Bypass für PandaDevelopment.net & PunkX Executor
// @icon         https://flopphub-team.github.io/UserScript/Rip-Pandadevelopment-Lol.jpg
// @updateURL    https://flopphub-team.github.io/UserScript/Main.js
// @downloadURL  https://flopphub-team.github.io/UserScript/Main.js
// @author       Mw_Anonymous | Non.time
// @match        https://pandadevelopment.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-end
// @connect      linkvertise.com
// @connect      short-jambo.com
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ========== Dienstprogramme ==========
    
    function handleError(error) {
        const errorText = error.message ? error.message : error;
        console.error('Pandadev Bypass Fehler:', errorText);
        GM_notification({
            text: errorText,
            title: "FEHLER",
            silent: true,
        });
        alert(errorText);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function notification(message, timeout) {
        const config = {
            text: message,
            title: "INFO",
            silent: true,
        };
        if (timeout) config.timeout = timeout;
        GM_notification(config);
    }

    function linkvertiseSpoof(link) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: link,
                headers: { Referer: 'https://linkvertise.com/' },
                onload: response => resolve(response.responseText),
                onerror: error => reject(error)
            });
        });
    }

    async function getTurnstileResponse() {
        notification('Bitte löse das Captcha', 3000);
        const notif = setInterval(() => notification('Bitte löse das Captcha', 5000), 6000);
        let res = '';
        while (true) {
            try {
                res = turnstile.getResponse();
                if (res) break;
            } catch (e) {}
            await sleep(1000);
        }
        clearInterval(notif);
        return res;
    }

    // ========== Bypass Hauptprogramm ==========

    async function pandadevelopment() {
        // Anti-Adblock alle 500ms entfernen
        const antiAdblockRemover = setInterval(removeAntiAdblock, 500);

        // Wenn wir bereits den Schlüssel haben, beenden
        if (document.documentElement.innerHTML.includes('you got the key')) {
            notification('Bypass erfolgreich abgeschlossen!', 5000);
            clearInterval(antiAdblockRemover);
            return;
        }

        // Wenn kein Formular vorhanden ist, suchen wir nach einem unterstützten Anbieter
        if (!document.getElementsByTagName('form').length) {
            let providers = Array.from(document.getElementsByTagName('a'));
            let supportedProviders = ['Linkvertise', 'Short Jambo'];
            for (let provider of providers) {
                let providerName = provider.firstChild?.innerHTML;
                if (providerName && supportedProviders.includes(providerName)) {
                    window.location.assign(provider.href);
                    return;
                }
            }
            throw new Error('Es wurde kein unterstützter Ad-Anbieter gefunden');
        }

        // Link des Werbeanzeige-Formulars abrufen
        function getAdLink() {
            let form = document.getElementsByTagName('form')[0];
            let data = new FormData(form);
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: form.action,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Referer': window.location.href,
                    },
                    data: new URLSearchParams(data).toString(),
                    onload: response => resolve(response.finalUrl),
                    onerror: error => reject(error)
                });
            });
        }

        // Ziel-URL decodieren
        function getDestUrl(link) {
            let url = new URL(encodeURI(link));
            switch (url.hostname) {
                case 'linkvertise.com':
                    return atob(url.searchParams.get('r'));
                case 'short-jambo.com':
                    return url.search.split('&url=')[1];
                default:
                    if ((new URL(window.location.href)).searchParams.get('provider')) {
                        return false;
                    } else {
                        throw new Error('Nicht unterstützter Ad-Anbieter: ' + url.hostname);
                    }
            }
        }

        // Anti-Adblock-Overlay entfernen
        function removeAntiAdblock() {
            try {
                let antiAdblock = document.getElementsByClassName('adblock_title')[0];
                if (!antiAdblock) return;
                while (antiAdblock.parentElement && antiAdblock.parentElement !== document.body) {
                    antiAdblock = antiAdblock.parentElement;
                }
                if (antiAdblock.parentElement === document.body) {
                    antiAdblock.remove();
                    clearInterval(antiAdblockRemover);
                }
            } catch (e) {}
        }

        // Benutzerdefinierte Wartezeiten nach Dienst
        const customSleepTimes = {
            'vegax': 11000,
            'laziumtools': 11000,
            'adelhub': 11000,
            'neoxkey': 16000,
        };

        try {
            // URL-Parameter abrufen
            let currentUrl = new URL(window.location.href);
            let hwid = currentUrl.searchParams.get('hwid');
            let service = currentUrl.searchParams.get('service');
            let token = currentUrl.searchParams.get('sessiontoken');
            let provider = currentUrl.searchParams.get('provider');

            // Turnstile-Captcha lösen, falls vorhanden
            if (document.getElementById('cf-turnstile')) {
                await getTurnstileResponse();
            }

            // Werbeanzeigen-Link und Ziel abrufen
            let adUrl = await getAdLink();
            let dest = getDestUrl(adUrl);
            
            // Wenn kein Ziel vorhanden ist, ohne Provider zurückkehren
            if (!dest) {
                window.location.assign(`https://pandadevelopment.net/getkey?hwid=${hwid}&service=${service}`);
                return;
            }

            // Benutzerdefinierte Wartezeit anwenden
            let sleepTime = 3000;
            Object.keys(customSleepTimes).forEach(key => {
                if (service === key) {
                    sleepTime = customSleepTimes[key];
                }
            });
            await sleep(sleepTime);

            // Referer spoofen und Stage abschließen
            await linkvertiseSpoof(dest);
            notification('Stage abgeschlossen', 3000);

            await sleep(3000);

            // URL für nächsten Checkpoint erstellen
            let newUrl = new URL(dest);
            token = newUrl.searchParams.get('sessiontoken');
            let nextCheckpoint = `https://pandadevelopment.net/getkey?hwid=${hwid}&service=${service}&sessiontoken=${token}`;
            if (provider) {
                nextCheckpoint += `&provider=${provider}`;
            }
            window.location.assign(nextCheckpoint);

        } catch (e) {
            clearInterval(antiAdblockRemover);
            handleError(e);
        }
    }

    // ========== Start ==========

    // Initiale Benachrichtigung
    GM_notification({
        text: 'PandaDevelopment Bypass wird gestartet...',
        title: "INFO",
        silent: false,
        timeout: 3000
    });

    // Bypass mit anfänglicher Verzögerung ausführen
    setTimeout(async () => {
        try {
            await pandadevelopment();
        } catch (error) {
            handleError(error);
        }
    }, 2000);

})();
