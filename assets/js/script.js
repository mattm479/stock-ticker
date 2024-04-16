const STOCK_TICKER_SYMBOLS = ["AAPL", "AMZN", "DIS", "GOOG", "MSFT", "META", "NFLX", "NVDA", "SMCI", "TSLA", "TSM"];
const stockTickerEl = $("#stock-ticker");

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

async function displayStockNews(stockSymbol = null) {
    const stockNews = await getStockNews(stockSymbol);
    const financialNews = $("#financial-news");
    const newsFeed = $("<ul></ul>");
    newsFeed.prop("id", "news-feed");

    for (const news of stockNews) {
        const li = $("<li></li>");
        li.prop("class", "mb-6");

        const article = $("<article></article>");
        article.prop("class", "message is-success");

        const messageHeader = $("<div></div>");
        messageHeader.prop("class", "message-header");

        const h3 = $("<h3></h3>");
        h3.text(news.headline);

        messageHeader.append(h3);

        const messageBody = $("<div></div>");
        messageBody.prop("class", "message-body");

        const p = $("<p></p>");
        p.text(news.summary + "...");

        const link = $("<a></a>");
        link.prop("href", news.url);
        link.prop("target", "_blank");
        link.text("[Read More]");

        p.append(link);
        messageBody.append(p);

        article.append(messageHeader);
        article.append(messageBody);

        li.append(article);
        newsFeed.append(li);
    }

    financialNews.append(newsFeed);
}

async function displayMarketIndexValues() {
    const marketData = await getMarketIndexInfo();
    const marketValues = $("#market-values");
    const card = $("<div></div>");
    card.prop("class", "card");

    const cardContent = $("<div></div>");
    cardContent.prop("class", "card-content");

    const ul = $("<ul></ul>");
    ul.prop("class", "is-flex");

    for (const data of marketData) {
        const li = $("<li></li>");
        li.prop("class", "mr-5");

        const outerDiv = $("<div></div>");
        outerDiv.prop("class", "is-flex");

        const innerDiv = $("<div></div>");
        innerDiv.prop("class", "is-justify-content-center");

        const h5 = $("<h5></h5>");
        h5.prop("class", "mr-2");
        h5.text(data.name);

        const price = $("<h6></h6>");
        price.prop("class", "mr-2");
        price.text(data.price);

        const priceChange = $("<h6></h6>");
        priceChange.prop("class", "price-change");
        priceChange.text(data.change);

        innerDiv.append(h5);
        innerDiv.append(price);
        innerDiv.append(priceChange);
        outerDiv.append(innerDiv);
        li.append(outerDiv);
        ul.append(li);
    }

    cardContent.append(ul);
    card.append(cardContent);
    marketValues.append(card);
}

stockTickerEl.on("transitionend animationend", async function () {
    await displayStockTicker();
})

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
  
  const randomSymbol = Math.floor(Math.random() * STOCK_TICKER_SYMBOLS.length);

  await displayStockTicker();
  await displayStockNews(STOCK_TICKER_SYMBOLS[randomSymbol].toLowerCase());
  //await displayMarketIndexValues();
  //await getCommoditiesInfo();  
});
