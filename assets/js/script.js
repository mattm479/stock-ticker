const ALPHAVANTAGE_API_KEY = "WKJPLDP0ARARLE1V";

function getStockInfo(stockSymbol) {
    return fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${ALPHAVANTAGE_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}
