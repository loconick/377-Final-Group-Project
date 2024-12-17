// Supabase Initialization
import daily_supabase from './daily_exchange_supabaseClient.js';

// Function to Fetch and Show Currency Exchange Rates
async function showCurrency() {
    const selectedDate = document.getElementById("date-selection").value;
    const currencyPair = document.getElementById("Currency Exchange Selection").value;

    // Validate if a date is selected
    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    let baseCurrency, targetCurrency;
    let columnName = ''; // Initialize columnName to avoid undefined errors

    // Map selected option to base and target currencies
    switch (currencyPair) {
        case "euro_to_usd":
            columnName = "euro_to_usd";
            break;
        case "uk_pound_to_usd":
            columnName = "gbp_to_usd";
            break;
        case "canadian_dollar_to_usd":
            columnName = "cad_to_usd";
            break;
        case "mexican_peso_to_usd":
            columnName = "mxn_to_usd";
            break;
        default:
            alert("Invalid currency pair selected.");
            return;
    }

    try {
        // Query Supabase for the exchange rate for the selected date and column
        const { data, error } = await daily_supabase
            .from('exchange_rate_to_usdollar') 
            .select(`date, ${columnName}`)
            .eq('date', selectedDate);

        if (error) {
            console.error("Supabase Error:", error);
            alert("Failed to fetch the exchange rate.");
            return;
        }

        if (!data || data.length === 0 || data[0][columnName] === null) {
            alert("No exchange rate found for the selected date and currency pair.");
            document.getElementById("daily_exchange_result").innerText = "";
            return;
        }

        // Display the fetched exchange rate
        const exchangeRate = data[0][columnName];
        document.getElementById("daily_exchange_result").innerText =
            `Exchange Rate on ${selectedDate}: ${exchangeRate}`;
    } catch (error) {
        console.error("Error fetching the data:", error);
        alert("An error occurred while fetching the exchange rate.");
    }
}

window.showCurrency = showCurrency;
