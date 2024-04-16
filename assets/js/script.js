const FINNHUB_API_KEY = "coc8hu9r01qj8q79pm00coc8hu9r01qj8q79pm0g";
const FMP_API_KEY = "ta4F40KXBNiO37e4v1FN7Wj9NDUsY807";

const STOCK_TICKER_SYMBOLS = ["AAPL", "AMZN", "GOOG", "META", "NFLX"];

const stockTickerEl = $("#stock-ticker");
stockTickerEl.on("animationstart", displayStockTicker);

const stockSearchFormEl = $("#stock-search-form");
stockSearchFormEl.on("submit", handleForm);

const newsEl = $("#financial-news");

async function handleForm(event) {
    event.preventDefault();

    const searchInput = $("#stock-symbol-input").val().trim().toUpperCase();
    if (searchInput !== "") {
        let data = await getStockInfo(searchInput);

        const cardEl = createStockCard(searchInput, data);

        newsEl.prepend(cardEl);

        stockSearchFormEl.trigger("reset");
    }
}

async function displayStockTicker() {
    let stockData = [];

    for (const stock of STOCK_TICKER_SYMBOLS) {
        let data = await getStockInfo(stock);
        data.symbol = stock;
        stockData.push(data);
    }

    const ul = $("<ul></ul>");
    ul.prop("class", "is-flex mt-4");

    for (const stock of stockData) {
        const li = $("<li></li>");
        li.prop("class", "stock is-flex mr-6");

        const h5 = $("<h5></h5>");
        h5.prop("class", "mr-2");
        h5.text(stock.symbol);

        const price = $("<p></p>");
        price.prop("class", "mr-2");
        price.text(stock.c);

        const change = $("<p></p>");
        change.prop("class", "price-change");

        const priceChange = (Math.round(stock.d * 100) / 100).toFixed(2);
        if (priceChange < 0) {
            change.prop("class", "negative");
            change.text(priceChange);
        } else if (priceChange > 0) {
            change.text("+" + priceChange);
        } else {
            change.text(priceChange);
        }

        li.append(h5);
        li.append(price);
        li.append(change);

        ul.append(li);
        stockTickerEl.append(ul);
    }
}

function getStockInfo(stockSymbol) {
    return fetch(`https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${FINNHUB_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}

$(document).ready(function() {
  if (JSON.parse(localStorage.getItem("display-modal")) !== false){
    const modalEl = $("#my-modal");
    modalEl.addClass("is-active");
    modalEl.on("click", function(event){
      modalEl.removeClass("is-active");
    });
    localStorage.setItem("display-modal", JSON.stringify(false)); 
  }
  
});
