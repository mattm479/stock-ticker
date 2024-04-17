const FINNHUB_API_KEY = "coc8hu9r01qj8q79pm00coc8hu9r01qj8q79pm0g";
const IEX_API_KEY = "pk_246b96a914264fde9aae4b20f851c261";

function getStockInfo(stockSymbol) {
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${FINNHUB_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}

function getStockNews(stockSymbol = null) {
    let url = `https://api.iex.cloud/v1/data/core/news`;

    if (stockSymbol !== null) {
        url += `/${stockSymbol}`;
    }

    url += `?limit=10&token=${IEX_API_KEY}`;

    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error(error));
}

function getMarketIndexInfo() {
    return fetch(`https://financialmodelingprep.com/api/v3/quotes/index?apikey=${FMP_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}

function getCommoditiesInfo(commodities) {
    return fetch(`https://api.iex.cloud/v1/data/core/energy/${commodities.map(commodity => commodity.symbol).toString()}?token=${IEX_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}