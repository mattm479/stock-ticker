const ALPHAVANTAGE_API_KEY = "WKJPLDP0ARARLE1V";
const POLYGON_API_KEY = "2zuDZ7z67L4BdulP6Rf0fEVoU9qfAkAM";

const STOCK_TICKER_SYMBOLS = ["AAPL", "AMZN", "GOOG", "META", "NFLX"];

const stockTickerEl = $("#stock-ticker");
stockTickerEl.on("animationstart", displayStockTicker);

async function displayStockTicker() {
    let stockData = [];

    for (const stock of STOCK_TICKER_SYMBOLS) {
        stockData.push(await getStockInfo(stock));
    }

    const ul = $("<ul></ul>");
    ul.prop("class", "is-flex mt-4");

    for (const stock of stockData) {
        const li = $("<li></li>");
        li.prop("class", "stock is-flex mr-6");

        const h5 = $("<h5></h5>");
        h5.prop("class", "mr-2");
        h5.text(stock["Global Quote"]["01. symbol"]);

        const price = $("<p></p>");
        price.prop("class", "mr-2");
        price.text(stock["Global Quote"]["05. price"]);

        const change = $("<p></p>");
        change.prop("class", "price-change");
        change.text(stock["Global Quote"]["09. change"]);

        if (stock["Global Quote"]["09. change"][0] === "-") {
            change.prop("class", "negative");
        }

        li.append(h5);
        li.append(price);
        li.append(change);

        ul.append(li);
    }
}

function getStockInfo(stockSymbol) {
    return fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${ALPHAVANTAGE_API_KEY}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}

// Modal functionality
const modal = $("#my-modal");
const span = $(".close");

// Show the modal when the page loads
$(document).ready(function() {
    modal.css("display", "block");
});

// Close the modal when the user clicks on the close button
span.click(function() {
    modal.css("display", "none");
});

// Close the modal when the user clicks outside of it
$(window).click(function(event) {
    if (event.target === modal[0]) {
        modal.css("display", "none");
    }
});

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

