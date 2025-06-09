// Vercel Analytics
(function() {
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  
  // Přidání skriptu pro Vercel Analytics
  var script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();

// Funkce pro sledování navigace na stránce
function trackPageView(pageName) {
  if (window.va) {
    window.va('event', {
      name: 'page_view',
      page: pageName || window.location.pathname
    });
  }
}

// Funkce pro sledování kliknutí na odkazy
function trackClick(element, category) {
  if (window.va) {
    window.va('event', {
      name: 'click',
      category: category || 'link',
      label: element.innerText || element.href
    });
  }
}

// Automatické sledování navigace
document.addEventListener('DOMContentLoaded', function() {
  // Sledování počáteční stránky
  trackPageView();
  
  // Sledování kliknutí na odkazy
  document.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      trackClick(this);
    });
  });
  
  // Sledování kliknutí na tlačítka
  document.querySelectorAll('button').forEach(function(button) {
    button.addEventListener('click', function() {
      trackClick(this, 'button');
    });
  });
});

// Export funkcí pro použití v jiných souborech
window.analytics = {
  trackPageView: trackPageView,
  trackClick: trackClick
};
