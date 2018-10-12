$(function () {
    const stockList = [
        'GOOG', 'AAPL', 'PG'

    ];

    const validationList = [];
    $.ajax ({
        url: 'https://api.iextrading.com/1.0/ref-data/symbols',
        method: 'GET'
    }).then(function(response){
        response.forEach(function(element){
            validationList.push(element.symbol)
        });
    })
    const popButtons = function (arrayFun, classFun, areaFun) {
        $(areaFun).empty();

        arrayFun.forEach(function (stock) {
            const newButton = $('<button>').addClass(classFun).attr('data-type', stock).text(stock);
            $(areaFun).append(newButton);
        })
    }
    const buildArticle = function (article) {
        const title = $('<strong>').text(article.headline);
        const summary = $('<p>').text(article.summary);
        const articleDiv = $('<div>').addClass('stock-item');
        articleDiv.append(title, summary);

        return articleDiv;

    }
    const render = function(response) {
        const name = response.company.companyName;
        const price = response.price;
        const logo = response.logo.url;
        const desc = response.company.description;

        $('#stocks').append(
            $('<img>').attr('src', logo),
            $('<h1>').text(name),
            $('<h3>').text(desc),
            $('<h3>').text(`Current Price: ${price}`)
        );
        const news = response.news.slice(0,10);
        news.forEach(function(article) {
            $('#stocks-news').append(buildArticle(article));
        });
    }
    const search = function () {
        $('#search').empty();
        $('#stocks').empty();
        $('#stocks-news').empty();
        $('.stock-button').removeClass('active');
        $(this).addClass('active');

        const type = $(this).attr('data-type');
        const queryURL = `https://api.iextrading.com/1.0/stock/${type}/batch?types=quote,news,chart,logo,price,company`;

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(render);
    }
    const addButton = function (e) {
        e.preventDefault();
        const newStock = $("input").val().toUpperCase();

        if(validationList.includes(newStock) && !stockList.includes(newStock)){
            stockList.push(newStock);
            $('#stock-input').val('');

        }

        popButtons(stockList, 'stock-button', '#stock-buttons');

    }

//EVENT LISTENERS
    $('#stock-buttons').on('click', '.stock-button', search);
    $("#add-stock").on('click', addButton);
    popButtons(stockList, 'stock-button', '#stock-buttons');

});
