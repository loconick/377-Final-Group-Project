import supabase from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '422aacebf29458307ae0ba4524dfcc61';
    const url = `http://data.fixer.io/api/symbols?access_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const symbols = data.symbols;
                const fromSelect = document.getElementById('from');
                const toSelect = document.getElementById('to');

                for (const [code, name] of Object.entries(symbols)) {
                    const optionFrom = document.createElement('option');
                    const optionTo = document.createElement('option');
                    optionFrom.value = code;
                    optionTo.value = code;
                    optionFrom.textContent = `${code} - ${name}`;
                    optionTo.textContent = `${code} - ${name}`;
                    fromSelect.appendChild(optionFrom);
                    toSelect.appendChild(optionTo);
                }
            } else {
                alert('Unable to load currency symbols');
            }
        })
        .catch(error => {
            console.error('Error fetching currency symbols:', error);
            alert('Error loading currency symbols');
        });
});

function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('from').value;
    const toCurrency = document.getElementById('to').value;

    const apiKey = '422aacebf29458307ae0ba4524dfcc61';
    const url = `http://data.fixer.io/api/latest?access_key=${apiKey}&symbols=${fromCurrency},${toCurrency}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const rates = data.rates;
                const eurToFromRate = rates[fromCurrency];
                const eurToToRate = rates[toCurrency];

                const rate = eurToToRate / eurToFromRate;

                const result = amount * rate;

                document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
            } else {
                document.getElementById('result').innerText = 'Conversion rate not available';
            }
        })
        .catch(error => {
            document.getElementById('result').innerText = 'Error: Unable to get exchange rate';
            console.error('Error fetching the data:', error);
        });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('fetch-historical-data').addEventListener('click', async () => {
        const baseCurrency = document.getElementById('base-currency').value;
        const targetCurrency = document.getElementById('target-currency').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        if (!startDate || !endDate) {
            alert('Please select a valid date range.');
            return;
        }

        try {
            // Query Supabase for historical exchange rates
            const { data, error } = await supabase
                .from('historical_rates') // Replace with your actual table name
                .select('date, rate')
                .eq('base_currency', baseCurrency)
                .eq('target_currency', targetCurrency)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: true });

            if (error) {
                console.error('Supabase Error:', error);
                alert('Failed to fetch historical data.');
                return;
            }

            // Format and render data in the chart
            const rates = data.map(row => ({
                date: row.date,
                value: row.rate
            }));
            renderChart(rates, baseCurrency, targetCurrency);
        } catch (error) {
            console.error('Error fetching historical data:', error);
            alert('Error fetching historical data.');
        }
    });
});


function renderChart(rates, baseCurrency, targetCurrency) {
    const dates = rates.map(rate => rate.date);
    const values = rates.map(rate => rate.value);

    const ctx = document.getElementById('chart-container').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${baseCurrency} to ${targetCurrency} Exchange Rate`,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Exchange Rate'
                    }
                }
            }
        }
    });
}
