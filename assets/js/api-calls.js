/**
 * API Keys for calls - can't wait until we store these outside of the code.
 */
const FINNHUB_API_KEY = "coc8hu9r01qj8q79pm00coc8hu9r01qj8q79pm0g";
const IEX_API_KEY = "pk_7907b557e46e45bfab6c65968ecd4be5";

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
    let url = `https://api.iex.cloud/v1/data/core/news`;

    if (stockSymbol !== null) {
        url += `/${stockSymbol}`;
    }

    url += `?limit=${limit}&token=${IEX_API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(error));
}

/**
 * Retrieve commodities data - NOTE: you can make 1 call with all the commodities passed in a comma separated list.
 * @param commodities
 */
function getCommoditiesInfo(commodities) {
    return fetch(`https://api.iex.cloud/v1/data/core/energy/${commodities.map(commodity => commodity.symbol).toString()}?token=${IEX_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}