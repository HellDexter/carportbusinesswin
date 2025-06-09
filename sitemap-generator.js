/**
 * Jednoduchý generátor sitemap.xml pro web CARPORTbusiness
 * Tento skript vytvoří aktualizovaný sitemap.xml soubor
 */

const fs = require('fs');
const path = require('path');
const currentDate = new Date().toISOString().split('T')[0]; // Formát YYYY-MM-DD

// Konfigurace
const config = {
  baseUrl: 'https://www.carportbusiness.com',
  outputFile: 'sitemap.xml',
  pages: [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/de/', priority: '0.9', changefreq: 'weekly' },
    { url: '/en/', priority: '0.9', changefreq: 'weekly' },
    { url: '/cookies.html', priority: '0.5', changefreq: 'monthly' },
    { url: '/gdpr.html', priority: '0.5', changefreq: 'monthly' }
  ]
};

// Vytvoření XML obsahu
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

// Přidání URL do sitemap
config.pages.forEach(page => {
  xmlContent += `  <url>
    <loc>${config.baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
});

// Uzavření XML dokumentu
xmlContent += '</urlset>\n';

// Zápis do souboru
fs.writeFileSync(path.join(__dirname, config.outputFile), xmlContent);

console.log(`Sitemap byl úspěšně vygenerován do souboru ${config.outputFile}`);
