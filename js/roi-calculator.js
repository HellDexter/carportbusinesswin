/**
 * ROI Calculator for CARPORTbusiness
 * Calculates return on investment for different CARPORTbusiness models
 * Supports both CZK and EUR currencies
 */

document.addEventListener("DOMContentLoaded", () => {
    // Check if ROI calculator elements exist on the page
    const roiCalculator = document.getElementById('roi-calculator');
    if (!roiCalculator) return;

    // Set up ROI calculator functionality
    initRoiCalculator();
});

/**
 * Initialize ROI calculator based on language/currency
 */
function initRoiCalculator() {
    // Get all range inputs and connect them to their output elements
    const rangeInputs = document.querySelectorAll('.roi-calculator-range');
    
    for (const range of rangeInputs) {
        const output = document.getElementById(range.dataset.output);
        if (output) {
            // Set initial value
            output.textContent = range.value;
            
            // Update value when range is changed
            range.addEventListener('input', () => {
                output.textContent = range.value;
                calculateROI();
            });
        }
    }

    // Setup carport model selection via tiles if present
    const carportOptions = document.querySelectorAll('.carport-option');
    if (carportOptions.length > 0) {
        // Handle tile selection
        for (const option of carportOptions) {
            // Apply active state to initial default selection
            if (option.dataset.value === '0') {
                option.classList.add('active');
                option.style.borderColor = '#07ff01';
                option.style.backgroundColor = 'rgba(7, 255, 1, 0.05)';
            }
            
            option.addEventListener('click', (e) => {
                // Remove active state from all options
                for (const opt of carportOptions) {
                    opt.classList.remove('active');
                    opt.style.borderColor = '#e6e6e6';
                    opt.style.backgroundColor = 'transparent';
                }
                
                // Add active state to selected option
                option.classList.add('active');
                option.style.borderColor = '#07ff01';
                option.style.backgroundColor = 'rgba(7, 255, 1, 0.05)';
                
                // Update hidden input value
                const modelInput = document.getElementById('carport-model');
                if (modelInput) {
                    modelInput.value = option.dataset.value;
                    calculateROI();
                }
            });
        }
    } else {
        // Get the model selector and attach change event (old method)
        const modelSelector = document.getElementById('carport-model');
        if (modelSelector) {
            modelSelector.addEventListener('change', calculateROI);
        }
    }
    
    // Initial calculation
    calculateROI();
}

/**
 * Calculate ROI based on selected parameters
 */
function calculateROI() {
    // Get currency and pricing schema from data attributes
    const calculatorElement = document.getElementById('roi-calculator');
    const currency = calculatorElement.dataset.currency;
    const pricingSchema = calculatorElement.dataset.pricing;
    
    // Get input values
    const modelSelector = document.getElementById('carport-model');
    const acChargingsPerDay = Number.parseInt(document.getElementById('ac-chargings').value, 10);
    const dcChargingsPerDay = Number.parseInt(document.getElementById('dc-chargings').value, 10);
    const gridElectricityPrice = Number.parseFloat(document.getElementById('electricity-price').value);
    
    // Get model price based on selection
    const modelIndex = Number.parseInt(modelSelector.value, 10);
    const modelPrices = JSON.parse(calculatorElement.dataset.modelPrices);
    const modelPrice = modelPrices[modelIndex];
    
    // Set constants based on pricing schema (CZK or EUR)
    let acChargeKwh;
    let dcChargeKwh;
    const averageChargeKwh = 70; // Average charge in kWh, same for all currencies
    
    if (pricingSchema === 'czk') {
        acChargeKwh = 10;  // CZK per kWh for AC
        dcChargeKwh = 16; // CZK per kWh for DC
    } else { // EUR
        acChargeKwh = 0.4;  // EUR per kWh for AC
        dcChargeKwh = 0.64;  // EUR per kWh for DC
    }
    
    // Daily electricity cost for charging
    const dailyElectricityCost = (acChargingsPerDay + dcChargingsPerDay) * averageChargeKwh * gridElectricityPrice;
    
    // Revenue calculations
    const dailyRevenueAC = acChargingsPerDay * averageChargeKwh * acChargeKwh;
    const dailyRevenueDC = dcChargingsPerDay * averageChargeKwh * dcChargeKwh;
    const dailyRevenue = dailyRevenueAC + dailyRevenueDC;
    
    // Daily profit (revenue minus electricity cost)
    const dailyProfit = dailyRevenue - dailyElectricityCost;
    
    // Annual calculations
    const annualIncome = dailyProfit * 365;
    
    // ROI in years
    const roiYears = modelPrice / annualIncome;
    
    // Total income in 30 years
    const totalIncomeIn30Years = annualIncome * 30;
    
    // Format currency and update results
    updateResults({
        dailyIncome: dailyProfit,
        annualIncome: annualIncome,
        roiYears: roiYears,
        totalIncomeIn30Years: totalIncomeIn30Years
    }, currency);
}

/**
 * Update results in the UI
 * @param {Object} results - Result values
 * @param {string} currency - Currency code (CZK or EUR)
 */
function updateResults(results, currency) {
    // Define locale based on currency and page language
    let locale;
    let currencyDisplay;
    
    if (currency === 'czk') {
        locale = 'cs-CZ';
        currencyDisplay = 'CZK';
    } else { // EUR
        // Determine if we're on English or German page
        const htmlLang = document.documentElement.lang || document.querySelector('html').getAttribute('lang') || '';
        
        if (htmlLang.toLowerCase().includes('de')) {
            locale = 'de-DE';
        } else {
            locale = 'en-GB'; // Use British English for EUR formatting
        }
        currencyDisplay = 'EUR';
    }
    
    // Format currency values
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyDisplay,
        maximumFractionDigits: 0
    });
    
    // Format years with 1 decimal place
    const yearsFormatter = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
    
    // Update UI elements with formatted values
    document.getElementById('daily-income').textContent = formatter.format(results.dailyIncome);
    document.getElementById('annual-income').textContent = formatter.format(results.annualIncome);
    document.getElementById('roi-years').textContent = yearsFormatter.format(results.roiYears);
    document.getElementById('total-income-30-years').textContent = formatter.format(results.totalIncomeIn30Years);
    
    // Update ROI evaluation text if element exists
    const roiEvalElement = document.getElementById('roi-evaluation');
    if (roiEvalElement) {
        let evaluationText = '';
        
        // Determine evaluation text based on ROI years
        if (results.roiYears <= 2) {
            evaluationText = 'Výborná investice s rychlou návratností!';
            roiEvalElement.style.color = '#07ff01';
        } else if (results.roiYears <= 4) {
            evaluationText = 'Velmi dobrá investice s nadprůměrnou návratností.';
            roiEvalElement.style.color = '#07ff01';
        } else if (results.roiYears <= 6) {
            evaluationText = 'Dobrá investice s průměrnou návratností.';
            roiEvalElement.style.color = '#ffbf00';
        } else if (results.roiYears <= 8) {
            evaluationText = 'Přijatelná investice s delší návratností.';
            roiEvalElement.style.color = '#ffbf00';
        } else {
            evaluationText = 'Zvažte více nabíjení pro lepší návratnost.';
            roiEvalElement.style.color = '#ff6a00';
        }
        
        // Set evaluation text based on page language
        if (currency === 'eur') {
            const htmlLang = document.documentElement.lang || document.querySelector('html').getAttribute('lang') || '';
            
            if (htmlLang.toLowerCase().includes('de')) {
                // German translations
                if (results.roiYears <= 2) {
                    evaluationText = 'Ausgezeichnete Investition mit schnellem ROI!';
                } else if (results.roiYears <= 4) {
                    evaluationText = 'Sehr gute Investition mit überdurchschnittlichem ROI.';
                } else if (results.roiYears <= 6) {
                    evaluationText = 'Gute Investition mit durchschnittlichem ROI.';
                } else if (results.roiYears <= 8) {
                    evaluationText = 'Akzeptable Investition mit längerer Amortisationszeit.';
                } else {
                    evaluationText = 'Erwägen Sie mehr Ladevorgänge für besseren ROI.';
                }
            } else {
                // English translations
                if (results.roiYears <= 2) {
                    evaluationText = 'Excellent investment with fast ROI!';
                } else if (results.roiYears <= 4) {
                    evaluationText = 'Very good investment with above-average ROI.';
                } else if (results.roiYears <= 6) {
                    evaluationText = 'Good investment with average ROI.';
                } else if (results.roiYears <= 8) {
                    evaluationText = 'Acceptable investment with longer payback period.';
                } else {
                    evaluationText = 'Consider more charging sessions for better ROI.';
                }
            }
        }
        
        roiEvalElement.textContent = evaluationText;
    }
}
