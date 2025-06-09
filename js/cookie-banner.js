// Jednoduchý, inteligentní cookie banner podle moderních standardů
// Lokalizace: čeština, angličtina, němčina (inteligentně podle jazyka webu)
document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('cookieConsent') === 'accepted') return;

    const lang = document.documentElement.lang || 'cs';
    let text = {
        cs: {
            message: 'Tento web používá cookies pro zlepšení uživatelského zážitku a analýzu návštěvnosti.',
            accept: 'Přijmout',
            more: 'Více informací'
        },
        en: {
            message: 'This website uses cookies to enhance your experience and analyze traffic.',
            accept: 'Accept',
            more: 'More info'
        },
        de: {
            message: 'Diese Website verwendet Cookies, um Ihr Erlebnis zu verbessern und den Datenverkehr zu analysieren.',
            accept: 'Akzeptieren',
            more: 'Mehr Infos'
        }
    };
    const t = text[lang] || text['cs'];

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
        <div style="position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #181818; color: #fff; padding: 18px 32px; border-radius: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.15); z-index: 9999; display: flex; align-items: center; gap: 18px; font-size: 1.05rem;">
            <span>${t.message}</span>
            <a href="/cookies.html" target="_blank" style="color: #07ff01; text-decoration: underline;">${t.more}</a>
            <button id="cookie-accept-btn" style="background: #07ff01; color: #181818; border: none; border-radius: 24px; padding: 8px 22px; font-weight: 700; margin-left: 12px; cursor: pointer; font-size: 1rem;">${t.accept}</button>
        </div>
    `;
    document.body.appendChild(banner);
    document.getElementById('cookie-accept-btn').onclick = function () {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.remove();
    };
});
