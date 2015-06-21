import sys
import pymongo
import datetime
import urllib.request
from bs4 import BeautifulSoup # To get everything
from pymongo import MongoClient
import json


ticker = sys.argv[1]
#ticker = "TASR"
sourceSite = 'Yahoo'
url = 'http://finance.yahoo.com/q/h?s=' + ticker
print(url)
response = urllib.request.urlopen(url)

#Parse and store Article information from Yahoo
articles = []
soup = BeautifulSoup(response)
ul = soup.find('div',
        { 'class' : 'mod yfi_quote_headline withsky'})
q = ul.findNext('ul')
for q in ul.findAll('ul'):
    w = q.find('li')
    if(w is not None):
        title = w.a.string
        link = w.a['href']
        cite = w.cite.text.replace(w.cite.span.text, '')
        date = w.cite.span.text
        article = [title, link, cite, date]
        articles.append(article)
        


#Setup for storage in Mongodb
insertValue = { "ticker" : ticker,
                "Articles" : [],
                "last_updated": datetime.datetime.utcnow()
              }
for article in articles:
    jsonArticle = {}
    jsonArticle['title'] = article[0]
    jsonArticle['url'] = article[1]
    jsonArticle['cite'] = article[2]
    jsonArticle['date'] = article[3]
    jsonArticle['source'] = sourceSite
    jsonArticle['weight'] = "0"
    insertValue['Articles'].append(jsonArticle)
#print(insertValue)



client = MongoClient()
db = client.Stocks
collection = db.Articles

#Document, in the form of a Python dictionary....it's just JSON...
#insertValue = { "ticker": "MSFT",
	  #"Articles": [
			#{ "url": "http://www.wsj.com/articles/u-s-chinese-universities-to-launch-technology-design-program-1434657616?ru=yahoo?mod=yahoo_itp",
                          #"title": "U.S., Chinese Universities to Launch Technology, Design Program",
                          #"date": "June 18, 2015 4:00 p.m. ET",
                          #"cite": "",
                          #"weight": "1"}
		    #],
	  #"last_updated": datetime.datetime.utcnow()
#	}
#Insert into Mongo, store the ID used (for test purposes only)
insertIDValue = collection.insert_one(insertValue).inserted_id
print(insertIDValue)
print(collection)
print(collection.find_one({'ticker': ticker}))
#
