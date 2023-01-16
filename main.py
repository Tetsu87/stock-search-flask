from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from dateutil.relativedelta import relativedelta
import requests

app = Flask(__name__)
CORS(app, supports_credential=True)
API_KEY = "c7tntuiad3i8dq4u9na0"


@app.route("/qr42sd42.html")
def display_html():
    return app.send_static_file("qr42sd42.html")

# get company info
@app.route("/company", methods=["GET"])
def company():
    ticker = request.args["ticker_name"]
    url_company = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + ticker.upper(
    ) + '&token=' + API_KEY
    response_company = requests.get(url_company)
    return response_company.json()


@app.route("/stock_summary", methods=['GET'])
def display_stock_summary():
    ticker = request.args["ticker_name"]
    url_price = 'https://finnhub.io/api/v1/quote?symbol=' + ticker.upper(
    ) + '&token=' + API_KEY
    response_price = requests.get(url_price)
    return response_price.json()

    # sample url_price = "https://finnhub.io/api/v1/quote?symbol=TLA&token=c7tntuiad3i8dq4u9na0"

@app.route("/indicator", methods=['GET'])
def display_indicator():
    ticker = request.args["ticker_name"]
    url_indicator = 'https://finnhub.io/api/v1/stock/recommendation?symbol=' + ticker.upper(
    ) + '&token=' + API_KEY
    response_indicator = requests.get(url_indicator)
    return jsonify(response_indicator.json())


@app.route("/charts", methods=['GET'])
def display_charts():
    ticker = request.args["ticker_name"]
    FROM = datetime.now() + relativedelta(months=-6, days=-1)
    TO = datetime.now()
    timestamp_from = int(round(FROM.timestamp()))
    timestamp_to = int(round(TO.timestamp()))

    # sample url_charts =  'https://finnhub.io/api/v1/stock/candle?symbol=TSLA&resolution=D&from=1629453436&to=1645441036&token=c7tntuiad3i8dq4u9na0'
    url_charts = 'https://finnhub.io/api/v1/stock/candle?symbol=' + ticker.upper(
    ) + '&resolution=D&from=' + str(timestamp_from) + '&to=' + str(
        timestamp_to) + '&token=' + API_KEY
    response_charts = requests.get(url_charts)
    return response_charts.json()

@app.route("/news", methods=['GET'])
def display_news():
    ticker = request.args["ticker_name"]
    # Displaying Latest News Tab
    FROM = datetime.now() + relativedelta(days=-30)
    TO = datetime.now()
    timestamp_from = FROM.strftime('%Y-%m-%d')
    timestamp_to = TO.strftime('%Y-%m-%d')

    url_news = 'https://finnhub.io/api/v1/company-news?symbol=' + ticker.upper(
    ) + '&from=' + str(timestamp_from) + '&to=' + str(
        timestamp_to) + '&token=' + API_KEY

    response_news = requests.get(url_news)
    return jsonify(response_news.json())

    # https://finnhub.io/api/v1/company-news?symbol=AAPL&from=2022-02-01&to=2022-02-05&token=c7tntuiad3i8dq4u9na0


if __name__ == '__main__':
    app.run(debug=True)
