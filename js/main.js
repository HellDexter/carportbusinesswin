/**
 * CARPORTbusiness - Hlavní JavaScript soubor
 */

// Zajištění, že se kód spustí až po načtení DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializace všech komponent
    initNavbar(); // Přidáno zpět - nový moderní navbar
    initSmoothScroll();
    initROICalculator();
    initContactForm();
    animateOnScroll(); // Přidáno volání animační funkce
    initScrollToTopButton(); // Přidáno volání funkce pro tlačítko návratu nahoru
    initHighlightGlow(); // Přidáno volání funkce pro glow efekt u zvýrazněných textů
    initScrollDownButton(); // Přidáno volání funkce pro animované scroll-down tlačítko
    // initAboutVideo() - odstraněno
    
    // Odstraněno volání funkce handleScrollDirection, která byla odstraněna
    
    // Přehrávání videa o konstrukci
    const constructionVideo = document.getElementById('constructionVideo');
    if (constructionVideo) {
        constructionVideo.play().catch((error) => {
            console.log("Video autoplay failed:", error);
        });
    }
    
    // Lightbox pro galerii
    // Vytvořit lightbox element pokud ještě neexistuje
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const lightboxImg = document.createElement('img');
        lightbox.appendChild(lightboxImg);
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        lightbox.appendChild(closeBtn);
        
        document.body.appendChild(lightbox);
        
        // Událost pro zavření lightboxu
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
        
        // Zavřít lightbox také při kliknutí kamkoli v lightboxu
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
    
    // Přidat event listener pro všechny items v galerii
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    
    for (const item of galleryItems) {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'block';
        });
    }
});

// Funkce initNavbar byla kompletně odstraněna

/**
 * Inicializace plynulého posunu při kliknutí na odkaz v menu
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    for (const anchor of anchors) {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Přidáváme offset, aby se zobrazila celá sekce a nebyla vidět část hero sekce
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
                
                // Kód pro zavření mobilního menu odstraněn
            }
        });
    }
}

/**
 * Inicializace a funkce ROI kalkulačky
 */
function initROICalculator() {
    const roiForm = document.getElementById('roi-calculator');
    if (!roiForm) return;

    roiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Získání hodnot z formuláře
        const parkingSpotsEl = document.getElementById('parking-spots');
        const solarPowerEl = document.getElementById('solar-power');
        const electricityPriceEl = document.getElementById('electricity-price');
        
        if (!parkingSpotsEl || !solarPowerEl || !electricityPriceEl) {
            console.error('Některé prvky formuláře nebyly nalezeny');
            return;
        }
        
        const parkingSpots = Number.parseFloat(parkingSpotsEl.value);
        const solarPower = Number.parseFloat(solarPowerEl.value);
        const electricityPrice = Number.parseFloat(electricityPriceEl.value);
        
        // Kontrola, zda jsou všechna pole platná
        if (Number.isNaN(parkingSpots) || Number.isNaN(solarPower) || Number.isNaN(electricityPrice) || 
            !Number.isFinite(parkingSpots) || !Number.isFinite(solarPower) || !Number.isFinite(electricityPrice)) {
            const lang = document.documentElement.lang || 'cs';
            alert(lang === 'en' 
                ? 'Please fill all fields with valid numbers.' 
                : lang === 'de' 
                    ? 'Bitte füllen Sie alle Felder mit gültigen Zahlen aus.'
                    : 'Prosím, vyplňte všechna pole platnými čísly.');
            return;
        }
        
        // Konstanty pro výpočet (přizpůsobte podle reálných hodnot)
        const areaPerSpot = 15; // m² na jedno parkovací místo
        const efficiencyFactor = 0.18; // účinnost solárních panelů (18%)
        const installationCostPerM2 = 5000; // Kč za m² instalace
        const daysPerYear = 365;
        const co2PerKWh = 0.5; // kg CO2 na kWh
        
        // Výpočty
        const totalArea = parkingSpots * areaPerSpot;
        const dailyEnergyProduction = totalArea * solarPower * efficiencyFactor;
        const annualEnergyProduction = dailyEnergyProduction * daysPerYear;
        const annualSavings = annualEnergyProduction * electricityPrice;
        const totalInstallationCost = totalArea * installationCostPerM2;
        const roiYears = totalInstallationCost / annualSavings;
        const annualCO2Reduction = annualEnergyProduction * co2PerKWh;
        
        // Zobrazení výsledků
        const lang = document.documentElement.lang || 'cs';
        const isEnglish = lang === 'en';
        const isGerman = lang === 'de';
        
        const annualSavingsEl = document.getElementById('annual-savings');
        const roiYearsEl = document.getElementById('roi-years');
        const annualEnergyEl = document.getElementById('annual-energy');
        const co2ReductionEl = document.getElementById('co2-reduction');
        const roiResultEl = document.getElementById('roi-result');
        
        if (!annualSavingsEl || !roiYearsEl || !annualEnergyEl || !co2ReductionEl || !roiResultEl) {
            console.error('Některé prvky výsledku nebyly nalezeny');
            return;
        }
        
        annualSavingsEl.textContent = isEnglish 
            ? `$${annualSavings.toLocaleString('en-US', {maximumFractionDigits: 0})}`
            : isGerman
                ? `${annualSavings.toLocaleString('de-DE', {maximumFractionDigits: 0})} €`
                : `${annualSavings.toLocaleString('cs-CZ', {maximumFractionDigits: 0})} Kč`;
        
        roiYearsEl.textContent = isEnglish
            ? `${roiYears.toLocaleString('en-US', {maximumFractionDigits: 1})} years`
            : isGerman
                ? `${roiYears.toLocaleString('de-DE', {maximumFractionDigits: 1})} Jahre`
                : `${roiYears.toLocaleString('cs-CZ', {maximumFractionDigits: 1})} let`;
        
        annualEnergyEl.textContent = isEnglish
            ? `${annualEnergyProduction.toLocaleString('en-US', {maximumFractionDigits: 0})} kWh`
            : isGerman
                ? `${annualEnergyProduction.toLocaleString('de-DE', {maximumFractionDigits: 0})} kWh`
                : `${annualEnergyProduction.toLocaleString('cs-CZ', {maximumFractionDigits: 0})} kWh`;
        
        co2ReductionEl.textContent = isEnglish
            ? `${annualCO2Reduction.toLocaleString('en-US', {maximumFractionDigits: 0})} kg`
            : isGerman
                ? `${annualCO2Reduction.toLocaleString('de-DE', {maximumFractionDigits: 0})} kg`
                : `${annualCO2Reduction.toLocaleString('cs-CZ', {maximumFractionDigits: 0})} kg`;
        
        // Zobrazení výsledkového kontejneru
        roiResultEl.style.display = 'block';
    });
}

/**
 * Inicializace kontaktního formuláře
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validace formuláře
        const nameEl = document.getElementById('name');
        const emailEl = document.getElementById('email');
        const messageEl = document.getElementById('message');
        
        if (!nameEl || !emailEl || !messageEl) {
            console.error('Některé prvky formuláře nebyly nalezeny');
            return;
        }
        
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const message = messageEl.value.trim();
        
        const lang = document.documentElement.lang || 'cs';
        
        if (!name || !email || !message) {
            alert(lang === 'en' 
                ? 'Please fill in all required fields.' 
                : lang === 'de'
                    ? 'Bitte füllen Sie alle Pflichtfelder aus.'
                    : 'Prosím, vyplňte všechna povinná pole.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert(lang === 'en' 
                ? 'Please enter a valid email address.' 
                : lang === 'de'
                    ? 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
                    : 'Prosím, zadejte platnou e-mailovou adresu.');
            return;
        }
        
        // Simulace odeslání formuláře (zde by byl AJAX požadavek na backend)
        alert(lang === 'en' 
            ? 'Thank you for your message. We will contact you soon!' 
            : lang === 'de'
                ? 'Vielen Dank für Ihre Nachricht. Wir werden uns bald bei Ihnen melden!' 
                : 'Děkujeme za Vaši zprávu. Budeme Vás brzy kontaktovat!');
        
        // Reset formuláře
        contactForm.reset();
    });
}

/**
 * Pomocná funkce pro validaci e-mailu
 */
function isValidEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Animace při scrollování - prvky se objevují postupně
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (elements.length === 0) return;
    
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    const handleScroll = () => {
        for (const element of elements) {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Spuštění při načtení stránky
}

/**
 * Inicializace nového moderního navbaru
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarLinks = document.querySelector('.navbar-links');
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const navLinks = document.querySelectorAll('.navbar-link');
    
    if (!navbar || !navbarToggle || !navbarLinks) return;
    
    // Funkce pro aktualizaci aktivního odkazu v navbaru podle aktuální pozice na stránce
    const updateActiveNavLink = () => {
        const scrollPosition = window.scrollY;
        
        // Získání všech sekcí
        const sections = document.querySelectorAll('section[id]');
        
        // Procházení sekcí a kontrola, zda jsou viditelné
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset pro lepší UX
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            // Speciální případ pro sekci kontakt
            if (sectionId === 'contact') {
                // Pokud jsme v sekci kontakt, vždy zvýrazníme odkaz na kontakt
                if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionTop + sectionHeight) {
                    // Odstranění aktivní třídy ze všech odkazů
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Přidání aktivní třídy na odkaz kontakt
                    const contactLink = document.querySelector('.navbar-link[href="#contact"]');
                    if (contactLink) {
                        contactLink.classList.add('active');
                    }
                    return; // Ukončíme procházení, protože jsme našli aktivní sekci
                }
            } else if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Odstranění aktivní třídy ze všech odkazů
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Přidání aktivní třídy na odkaz odpovídající aktuální sekci
                const activeLink = document.querySelector(`.navbar-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
        
        // Změna stylu navbaru při scrollování
        if (scrollPosition > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    // Sledování události scrollování pro aktualizaci aktivního odkazu
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Počáteční nastavení aktivního odkazu
    updateActiveNavLink();
    
    // Přepínání mobilního menu
    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarLinks.classList.toggle('active');
    });
    
    // Zavření mobilního menu po kliknutí na odkaz
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarToggle.classList.remove('active');
            navbarLinks.classList.remove('active');
        });
    });
    
    // Ovládání jazykového dropdown menu
    if (languageBtn && languageDropdown) {
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // Zavření dropdown menu po kliknutí mimo něj
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
            }
        });
    }
    
    console.log('Moderní navbar inicializován');
}

/**
 * Inicializace tlačítka pro návrat na začátek stránky
 */
function initScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollToTopBtn) return;
    
    // Zobrazení a skrytí tlačítka podle pozice scrollování
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // Akce po kliknutí na tlačítko
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Inicializace glow efektu pro zvýrazněné texty při najetí do jejich blízkosti
 */
function initHighlightGlow() {
    // Najít všechny elementy s třídou highlight
    const highlights = document.querySelectorAll('.highlight');
    
    for (const highlight of highlights) {
        // Zkontrolovat, zda element již není obalen v highlight-container
        if (!highlight.parentElement.classList.contains('highlight-container')) {
            // Vytvořit obalový element s větší aktivní oblastí
            const container = document.createElement('span');
            container.className = 'highlight-container';
            
            // Nahradit highlight element kontejnerem se stejným obsahem
            highlight.parentNode.insertBefore(container, highlight);
            container.appendChild(highlight);
        }
    }
    
    console.log('Highlight glow efekt aktivován při najetí do blízkosti textu');
}

/**
 * Inicializace scrollovacího tlačítka v hero sekci
 */
function initScrollDownButton() {
    const scrollDownBtn = document.querySelector('.scroll-down-btn');
    if (!scrollDownBtn) return;

    scrollDownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            window.scrollTo({
                top: aboutSection.offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

/**
 * Funkce initAboutVideo byla odstraněna
 * Video již není automaticky ovládáno při scrollování
 */

// Globální proměnné pro sledování scrollování byly odstraněny - souvisely s navbarem
