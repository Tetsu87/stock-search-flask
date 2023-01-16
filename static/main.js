document.getElementById("formInput").addEventListener("keypress", function(e) {
    let userInput = document.getElementById("formInput").value;
    if (e.key === "Enter") {
        e.preventDefault();
        if (userInput.length != 0) {
            update();
        }
    }
});


document.getElementById("test").addEventListener("submit", function(e) {
    e.preventDefault();
    update();
});

document.getElementById("clear-button").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("clear starts");
    let text = document.getElementById("clear-button");
    console.log("clear button ends");
    text.value = '';
    console.log("demo ends");
    deleteError();
    toInvisible();
    removeForm();
});

function showError() {
    const error = document.getElementById("error");
    error.style.display = "block";
}

function deleteError() {
    document.getElementById("error").style.display = "none";
}

function toInvisible() {
    const contents = document.getElementById("switch");
    contents.style.display = "none";
}

function toVisible() {
    const contents = document.getElementById("switch");
    contents.style.display = "block";
}

function removeForm() {
    let textForm = document.querySelector("input");
    textForm.value = "";
}

function update() {
    let userInput = document.getElementById("formInput").value;
    // fetch('http://127.0.0.1:5000/company?ticker_name=' + userInput)
        fetch('https://trade-platform-2022.wl.r.appspot.com/company?ticker_name=' + userInput)
        .then(response => response.json())
        .then(json => {
            let isExist = json.name;
            if (isExist != null) {
                deleteError();
                toVisible();
                dataFeed();
            } else {
                showError();
                toInvisible();
                console.log("isExist was false!!");
            }
        })
}

function dataFeed() {
    let userInput = document.getElementById("formInput").value;
    let ticker;
    // fetch('http://127.0.0.1:5000/company?ticker_name=' + userInput)
        fetch('https://trade-platform-2022.wl.r.appspot.com/company?ticker_name=' + userInput)
        .then(response => response.json())
        .then(json => {
            document.getElementById('Company-Name').innerHTML = json.name;
            ticker = json.ticker;
            document.getElementById('Stock-Ticker-Symbol').innerHTML = ticker;
            document.getElementById('Stock-Ticker-Symbol2').innerHTML = ticker;
            // document.getElementById('Stock-Ticker-Symbol').innerHTML = json.ticker;
            // document.getElementById('Stock-Ticker-Symbol2').innerHTML = json.ticker;
            document.getElementById('logo').src = json.logo;
            document.getElementById('Stock-Exchange-Code').innerHTML = json.exchange;
            document.getElementById('Company-Start-Date').innerHTML = json.ipo;
            document.getElementById('Category').innerHTML = json.finnhubIndustry;
        })


    // fetch('http://127.0.0.1:5000/indicator?ticker_name=' + userInput)
        fetch('https://trade-platform-2022.wl.r.appspot.com/indicator?ticker_name=' + userInput)
        .then(response => response.json())
        .then(json => {
            document.querySelector('.strongSell').innerHTML = json[0].strongSell;
            document.querySelector('.hold').innerHTML = json[0].hold;
            document.querySelector('.sell').innerHTML = json[0].sell;
            document.querySelector('.buy').innerHTML = json[0].buy;
            document.querySelector('.strongBuy').innerHTML = json[0].strongBuy;
        })

    // fetch('http://127.0.0.1:5000/stock_summary?ticker_name=' + userInput)
        fetch('https://trade-platform-2022.wl.r.appspot.com/stock_summary?ticker_name=' + userInput)
        .then(response => response.json())
        .then(json => {
            let date = new Date(json.t * 1000);
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let month_name = months[date.getMonth()];
            let displayDate = date.getDate() + " " + month_name + ", " + date.getFullYear();
            document.getElementById('Trading-Day').innerHTML = displayDate;
            document.getElementById('Previous-Closing-Price').innerHTML = json.pc;
            document.getElementById('Opening-Price').innerHTML = json.o;
            document.getElementById('High-Price').innerHTML = json.h;
            document.getElementById('Low-Price').innerHTML = json.l;
            let change = json.d;
            let change_percent = json.dp;
            document.getElementById('Change').innerHTML = change;
            document.getElementById('Change-Percent').innerHTML = change_percent;
            // change the arrow
            let numChange = Number(change);
            let numChangePercent = Number(change_percent);

            if (numChange > 0) {
                document.getElementById("arrow1").className = "upward_arrow";
                console.log(">0");
            } else if (numChange < 0) {
                document.getElementById("arrow1").className = "downward_arrow";
                console.log("<0");
            } else {
                document.getElementById("arrow1").className = "invisible_arrow";
                console.log("else");
            }

            if (numChangePercent > 0) {
                document.getElementById("arrow2").className = "upward_arrow";
            } else if (numChangePercent < 0) {
                document.getElementById("arrow2").className = "downward_arrow";
            } else {
                document.getElementById("arrow2").className = "invisible_arrow";
            }
        })

    // clear the previous images 
    for (let i = 1; i <= 5; i++) {
        document.getElementById('logo' + i).src = null;
    }

    // fetch('http://127.0.0.1:5000/news?ticker_name=' + userInput)
        fetch('https://trade-platform-2022.wl.r.appspot.com/news?ticker_name=' + userInput)
        .then(response => response.json())
        .then(json => {
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let i = 0;
            let success = 0;
            while (success < 5) {
                if (json[i].datetime.toString().length != 0 && json[i].headline.length != 0 && json[i].url.length != 0 && json[i].image.length != 0) {
                    let date = new Date(json[i].datetime * 1000);
                    let month_name = months[date.getMonth()];
                    let displayDate = date.getDate() + " " + month_name + ", " + date.getFullYear();
                    idNum = success + 1;
                    document.getElementById('Title' + idNum).innerHTML = json[i].headline;
                    document.getElementById('Date' + idNum).innerHTML = displayDate;
                    document.getElementById('Link' + idNum).href = json[i].url;
                    document.getElementById('logo' + idNum).src = json[i].image;
                    i++;
                    success++;
                } else {
                    i++;
                }
            }
        })

    // Highcharts.getJSON('http://127.0.0.1:5000/charts?ticker_name=' + userInput, function(data) {
    Highcharts.getJSON('https://trade-platform-2022.wl.r.appspot.com/charts?ticker_name=' + userInput, function(data) {
        let price = [];
        let volume = [];
        let myTickPositions = [];
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);

        let dataLength = data.c.length;
        for (let i = 0; i < dataLength; i++) {
            price.push([
                data.t[i] * 1000,
                data.c[i]
            ]);
            volume.push([
                data.t[i] * 1000,
                data.v[i]
            ]);
            myTickPositions.push([
                data.t[i] * 1000,
            ]);
        }

        console.log(price);

        // create the chart
        Highcharts.stockChart('container', {
            title: {
                text: 'Stock Price ' + userInput.toUpperCase() + " " + year + "-" + month + "-" + day
            },
            subtitle: {
                useHTML: true,
                text: '<a href =https://finnhub.io/ target="_blank">Source: Finnhub</a>',
                y: 50
            },
            xAxis: {
                type:'datetime',
                gapGridLineWidth: 0,
                tickInterval:24 * 3600 * 1000,
                // maxZoom:48 * 3600 * 1000
            },
            
            rangeSelector: {
                buttons: [{
                    type: 'day',
                    count: 7,
                    text: '7d'
                }, {
                    type: 'day',
                    count: 15,
                    text: '15d'
                }, {
                    type: 'month',
                    count: 1,
                    text: '1m'
                }, {
                    type: 'month',
                    count: 3,
                    text: '3m'
                }, {
                    type: 'month',
                    count: 6,
                    text: '6m'
                }],
                selected: 4,
                y: 20,
                inputEnabled: false
            },

            yAxis: [{
                title: {
                    text: 'Stock Price',
                },
                opposite: false,
            }, {
                title: {
                    text: 'Volume'
                },
                gridLineWidth: 1
            }],

            series: [{
                name: 'Stock Price',
                type: 'area',
                yAxis: 0,
                data: price,
                // gapSize:1,
                // pointPlacement: "on",
                tooltip: {
                    valueDecimals: 2
                },
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                threshold: null
            }, {
                name: 'Volume',
                type: 'column',
                pointWidth: 5,
                yAxis: 1,
                data: volume,
                gapSize: 5,
                pointPlacement: "on",
                tooltip: {
                    valueDecimals: 0
                },
                threshold: null
            }]
        });
    });
}