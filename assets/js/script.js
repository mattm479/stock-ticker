const STOCK_TICKER_SYMBOLS = ["AAPL", "AMZN", "DIS", "GOOG", "MSFT", "META", "NFLX", "NVDA", "SMCI", "TSLA", "TSM"];
const CRYPTO_SYMBOLS = ["BTC", "BCH", "BSV", "LTC", "PYPL", "SOL"];
const COMMODITIES_SYMBOLS = [{symbol: "GASDESW", name: "Diesel"}, {
    symbol: "GASREGCOVW",
    name: "Gas"
}, {symbol: "DJFUELUSGULF", name: "Jet Fuel"}, {symbol: "DHHNGSP", name: "Natural Gas"}, {
    symbol: "DCOILWTICO",
    name: "Oil"
}, {symbol: "DPROPANEMBTX", name: "Propane"}];
const stockTickerEl = $("#stock-ticker");
const marqueeEl = $(".marquee");
const formatter = Intl.NumberFormat("en-us", {
    style: "decimal", useGrouping: false, minimumFractionDigits: 2, maximumFractionDigits: 4
});

/**
 * Function to display the stock ticker on the page. It retrieves the data via API call and dynamically creates the HTML
 * to be displayed.
 */
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
        price.text(formatter.format(stock.c));

        const change = $("<p></p>");
        change.prop("class", "price-change");

        const priceChange = formatter.format(stock.d);
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

/**
 * Function to display the news feed. If you pass a symbol, the news feed will be related to that symbol otherwise
 * the default is to pick a symbol at random from the list of ticker symbols.
 * @param stockSymbol
 */
async function displayStockNews(stockSymbol = null) {
    const stockNews = await getStockNews(stockSymbol);
    const financialNews = $("#financial-news");
    const newsFeed = $("<div></div>");
    newsFeed.prop("id", "news-feed");

    const ul = $("<ul></ul>");

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
        ul.append(li);
    }

    newsFeed.append(ul);
    financialNews.append(newsFeed);
}

/**
 * Function to fetch and display info about crypto stocks. The HTML is dynamically generated and appended to the placeholder div.
 */
async function displayCryptoInfo() {
    const cardDiv = $("#crypto-values");

    const headerDiv = $("<div></div>");
    headerDiv.prop("class", "card-header");

    const headerTitleDiv = $("<div></div>");
    headerTitleDiv.prop("class", "card-header-title is-centered");

    const h3 = $("<h3></h3>");
    h3.prop("class", "bold");
    h3.text("Crypto Prices");

    headerTitleDiv.append(h3);
    headerDiv.append(headerTitleDiv);
    cardDiv.append(headerDiv);

    const contentDiv = $("<div></div>");
    contentDiv.prop("class", "card-content columns is-multiline");

    for (const symbol of CRYPTO_SYMBOLS) {
        const data = await getStockInfo(symbol);
        const div = $("<div></div>");
        div.prop("class", "column");

        const h5 = $("<h5></h5>");
        h5.prop("class", "bold");
        h5.text(symbol);

        const price = $("<h6></h6>");
        price.text(formatter.format(data.c));

        const change = $("<h6></h6>");
        change.prop("class", "price-change");

        const priceChange = formatter.format(data.d * 100);
        if (priceChange < 0) {
            change.prop("class", "negative");
            change.text(priceChange);
        } else if (priceChange > 0) {
            change.text("+" + priceChange);
        } else {
            change.text(priceChange);
        }

        div.append(h5);
        div.append(price);
        div.append(change);

        contentDiv.append(div);
    }

    cardDiv.append(contentDiv);
}

/**
 * Function to fetch and display info about commodities. The HTML is dynamically generated and appended to the placeholder div.
 */
async function displayCommoditiesInfo() {
    const commoditiesData = await getCommoditiesInfo(COMMODITIES_SYMBOLS);
    const cardDiv = $("#commodity-values");

    const headerDiv = $("<div></div>");
    headerDiv.prop("class", "card-header");

    const headerTitleDiv = $("<div></div>");
    headerTitleDiv.prop("class", "card-header-title is-centered");

    const h3 = $("<h3></h3>");
    h3.prop("class", "bold");
    h3.text("Commodity Prices");

    headerTitleDiv.append(h3);
    headerDiv.append(headerTitleDiv);
    cardDiv.append(headerDiv);

    const contentDiv = $("<div></div>");
    contentDiv.prop("class", "card-content columns is-multiline");

    for (const commodity of commoditiesData) {
        const div = $("<div></div>");
        div.prop("class", "column");

        const object = COMMODITIES_SYMBOLS.filter(obj => obj.symbol === commodity.key);
        const h5 = $("<h5></h5>");
        h5.prop("class", "bold");
        h5.text(object[0].name);

        const h6 = $("<h6></h6>");
        h6.text(formatter.format(commodity.value));

        div.append(h5);
        div.append(h6);

        contentDiv.append(div);
    }

    cardDiv.append(contentDiv);
}

/**
 * Event Listener to pause the stock ticker when the mouse is hovering over it.
 */
stockTickerEl.on("mouseover", function () {
    marqueeEl[0].style.animationPlayState = "paused";
})

/**
 * Event Listener to start running the ticker once the mouse is no longer hovering over it.
 */
stockTickerEl.on("mouseout", function () {
    marqueeEl[0].style.animationPlayState = "running";
});

/**
 * Event Listener to clear the previous ticker data then refresh with updated values before running the animation again
 */
marqueeEl.on("animationiteration", async function () {
    marqueeEl[0].empty();
    await displayStockTicker();
});

$(document).ready(async function () {
    /**
     * Check localStorage to see if we need to display the welcome modal for the user
     */
    if (JSON.parse(localStorage.getItem("display-modal")) !== false) {
        const modalEl = $("#my-modal");
        modalEl.addClass("is-active");
        modalEl.on("click", function () {
            modalEl.removeClass("is-active");
        });

        localStorage.setItem("display-modal", JSON.stringify(false));
    }

    displayPreviousSearchButtons();

    await displayStockTicker();

    const randomSymbol = Math.floor(Math.random() * STOCK_TICKER_SYMBOLS.length);
    await displayStockNews(STOCK_TICKER_SYMBOLS[randomSymbol].toLowerCase());
    await displayCryptoInfo();
    await displayCommoditiesInfo();
});
