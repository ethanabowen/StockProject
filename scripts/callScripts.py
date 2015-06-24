import sys
import logging
import traceback
import getYahooArticles
import getGoogleArticles
import getCNNArticles

logger = logging.getLogger('Global Scrapper')
fh = logging.FileHandler('errors.log')
fh.setLevel(logging.DEBUG)
logger.addHandler(fh)

tickers = []
with open("nasdaqlisted.txt") as f:
    for line in f:
        tickerFromFile = line.split("|")[0].strip()
        if(len(tickerFromFile) == 4):
            tickers.append(tickerFromFile)
            
def scrap(source, scrapper, ticker):
    try:
        scrapper.main(ticker)
        print('\t' + source + ' successful.')
    except Exception:
        print(source + ': ' + ticker + ' failed.')
        logger.warning(traceback.format_exc())

for ticker in tickers:
    print('Ticker: ' + ticker)
    scrap('Yahoo', getYahooArticles, ticker)
    scrap('Google', getGoogleArticles, ticker)
    scrap('CNN', getCNNArticles, ticker)
