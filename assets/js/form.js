const stockSearchFormEl = $("#stock-search-form");
const searchInputEl = $("#stock-symbol-input");
const newsEl = $("#financial-news");

stockSearchFormEl.on("submit", handleForm);

async function handleForm(event) {
    event.preventDefault();

    const searchInput = searchInputEl.val().trim().toUpperCase();
    if (searchInput !== "") {
        const previousSearches = JSON.parse(localStorage.getItem("previous-searches")) ?? [];

        if (previousSearches.indexOf(searchInput) === -1) {
            previousSearches.push(searchInput);

            localStorage.setItem("previous-searches", JSON.stringify(previousSearches));
        }

        displayPreviousSearchButtons();

        let data = await getStockInfo(searchInput);

        const cardEl = createStockCard(searchInput, data);

        $("#financial-news").empty();

        newsEl.prepend(cardEl);

        await displayStockNews(searchInput);

        stockSearchFormEl.trigger("reset");
    }
}

function createStockCard(stockSymbol, stockData) {
    const cardDiv = $("<div></div>");
    cardDiv.prop("class", "card stock-card mb-6");

    const cardHeader = createStockCardHeader(stockSymbol, stockData);
    const cardContent = createStockCardContent(stockData);
    const cardFooter = createStockCardFooter(stockData);

    cardDiv.append(cardHeader);
    cardDiv.append(cardContent);
    cardDiv.append(cardFooter);

    return cardDiv;
}

function createStockCardHeader(stockSymbol, stockData) {
    const cardHeaderDiv = $("<div></div>");
    cardHeaderDiv.prop("class", "card-header");

    const cardHeaderTitleDiv = $("<div></div>");
    cardHeaderTitleDiv.prop("class", "card-header-title is-centered");

    const h3 = $("<h3></h3>");
    h3.prop("class", "mr-3 bold");
    h3.text(stockSymbol);

    const h4 = $("<h4></h4>");
    h4.prop("class", "mr-3 bold");
    h4.text(formatter.format(stockData.c));

    const priceChange = $("<h6></h6>");
    priceChange.prop("class", "mr-3 price-change bold");

    const percentChange = $("<h6></h6>");
    percentChange.prop("class", "price-change bold");

    if (stockData.d > 0) {
        priceChange.text("+" + formatter.format(stockData.d));
        percentChange.text("+" + formatter.format(stockData.dp) + "%");
    } else if (stockData.d < 0) {
        priceChange.addClass("negative");
        priceChange.text(formatter.format(stockData.d));

        percentChange.addClass("negative");
        percentChange.text(formatter.format(stockData.dp) + "%");
    } else {
        priceChange.text(formatter.format(stockData.d));
        percentChange.text(formatter.format(stockData.dp) + "%");
    }

    cardHeaderTitleDiv.append(h3);
    cardHeaderTitleDiv.append(h4);
    cardHeaderTitleDiv.append(priceChange);
    cardHeaderTitleDiv.append(percentChange);
    cardHeaderDiv.append(cardHeaderTitleDiv);

    return cardHeaderDiv;
}

function createStockCardContent(stockData) {
    const cardContentDiv = $("<div></div>");
    cardContentDiv.prop("class", "card-content is-flex is-justify-content-center is-align-items-center");

    const openDiv = $("<div></div>");
    openDiv.prop("class", "is-flex-direction-column mr-6");

    const openP1 = $("<p></p>");
    openP1.prop("class", "bold");
    openP1.text("Open: ");

    const openValueP1 = $("<p></p>");
    openValueP1.text(formatter.format(stockData.o));

    openDiv.append(openP1);
    openDiv.append(openValueP1);

    const highDiv = $("<div></div>");
    highDiv.prop("class", "is-flex-direction-column mr-6");

    const highP1 = $("<p></p>");
    highP1.prop("class", "bold");
    highP1.text("High: ");

    const highValueP1 = $("<p></p>");
    highValueP1.text(formatter.format(stockData.h));

    highDiv.append(highP1);
    highDiv.append(highValueP1);

    const lowDiv = $("<div></div>");
    lowDiv.prop("class", "is-flex-direction-column mr-6");

    const lowP1 = $("<p></p>");
    lowP1.prop("class", "bold");
    lowP1.text("Low: ");

    const lowValueP1 = $("<p></p>");
    lowValueP1.text(formatter.format(stockData.l));

    lowDiv.append(lowP1);
    lowDiv.append(lowValueP1);

    const previousCloseDiv = $("<div></div>");
    previousCloseDiv.prop("class", "is-flex-direction-column");

    const previousCloseP1 = $("<p></p>");
    previousCloseP1.prop("class", "bold");
    previousCloseP1.text("Previous Close: ");

    const previousCloseValueP1 = $("<p></p>");
    previousCloseValueP1.text(formatter.format(stockData.pc));

    previousCloseDiv.append(previousCloseP1);
    previousCloseDiv.append(previousCloseValueP1);

    cardContentDiv.append(openDiv);
    cardContentDiv.append(highDiv);
    cardContentDiv.append(lowDiv);
    cardContentDiv.append(previousCloseDiv);

    return cardContentDiv;
}

function createStockCardFooter() {
    const footerDiv = $("<div></div>");
    footerDiv.prop("class", "card-footer");

    const footerTitleDiv = $("<div></div>");
    footerTitleDiv.prop("class", "card-footer-item");

    const p = $("<p></p>");
    p.prop("class", "bold");
    p.text("As of: " + dayjs().format("YYYY-MM-DD"));

    footerTitleDiv.append(p);
    footerDiv.append(footerTitleDiv);

    return footerDiv;
}

function displayPreviousSearchButtons() {
    const searchHistory = $("#search-history");
    searchHistory.empty();

    let previousSearches = localStorage.getItem("previous-searches");

    if (previousSearches === null) previousSearches = [];
    else previousSearches = JSON.parse(previousSearches).sort();

    for (let symbol of previousSearches) {
        const button = $("<button></button>");

        button.prop("class", "button is-link mb-3");
        button.text(symbol.toUpperCase());
        button.on("click", handlePreviousSymbolSearch);

        searchHistory.append(button);
    }
}

/**
 * Sets the input to be the stock symbol of the button clicked and triggers the form submit to populate
 * the stock data for that symbol.
 * @param event
 */
function handlePreviousSymbolSearch(event) {
    event.preventDefault();

    searchInputEl.val(event.target.textContent);
    stockSearchFormEl.trigger("submit");
}