
document.addEventListener("DOMContentLoaded", function() {
    const apiKey = '422aacebf29458307ae0ba4524dfcc61';
    const url = `https://data.fixer.io/api/symbols?access_key=${apiKey}`;

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
    const url = `https://data.fixer.io/api/latest?access_key=${apiKey}&symbols=${fromCurrency},${toCurrency}`;

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

