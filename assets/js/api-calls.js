/**
 * API Keys for calls - can't wait until we store these outside of the code.
 */
const FINNHUB_API_KEY = "coc8hu9r01qj8q79pm00coc8hu9r01qj8q79pm0g";
const ALPHA_VANTAGE_API_KEY = "WKJPLDP0ARARLE1V";

/**
 * Retrieve stock data for a specific symbol.
 * @param stockSymbol
 */
function getStockInfo(stockSymbol) {
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${FINNHUB_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}

/**
 * Retrieve news - if a stock symbol is passed, get news specific to that symbol.
 * @param stockSymbol
 */
function getStockNews(stockSymbol = null) {
    const limit = 10;
    let url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT`;

    if (stockSymbol !== null) {
        url += `&tickers=${stockSymbol}`;
    }

    url += `&limit=${limit}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(error));
}

/**
 * Retrieve commodities data
 * @param commodity
 */
function getCommoditiesInfo(commodity) {
    return fetch(`https://www.alphavantage.co/query?function=${commodity}&apikey=${ALPHA_VANTAGE_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}