import sys
import traceback
import getYahooArticles
import getGoogleArticles
import getCNNArticles

tickers = []
with open("nasdaqlisted.txt") as f:
    for line in f:
        tickerFromFile = line.split("|")[0].strip()
        if(len(tickerFromFile) == 4):
            tickers.append(tickerFromFile)
            
for ticker in tickers:
    print('Ticker: ' + ticker)
    try:
        getYahooArticles.main(ticker)
        print('\tYahoo successful.')
    except Exception:
        print('Yahoo:' + ticker + ' failed.')
        print(traceback.format_exc())

    try:
        getGoogleArticles.main(ticker)
        print('\tGoogle successful.')
    except Exception:
        print('Google:' + ticker + ' failed.')
        print(traceback.format_exc())
        
    try:
        getCNNArticles.main(ticker)
        print('\tCNN successful.')
    except Exception:
        print('CNN:' + ticker + ' failed.')
        print(traceback.format_exc())
