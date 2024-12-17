import historic_supabase from './historical_supabaseClient.js';

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
            const { data, error } = await historic_supabase
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