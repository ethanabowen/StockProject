import sys
import pymongo
import urllib.request
import json
import time
from datetime import datetime
from bs4 import BeautifulSoup # To get everything
from pymongo import MongoClient

#connect to MongoDB
client = MongoClient()
db = client.Stocks
articles = db.Articles


#Query site for HTML
#ticker = sys.argv[1]
ticker = "TASR"
sourceSite = 'Yahoo'
url = 'http://finance.yahoo.com/q/h?s=' + ticker
print(url)
response = urllib.request.urlopen(url)

#Parse and store Article information from Yahoo
htmlArticles = []
soup = BeautifulSoup(response)
ul = soup.find('div', { 'class' : 'mod yfi_quote_headline withsky'})
for q in ul.find_all('ul'): #All articles for a day
    #print("q\t",q)
    w = q.find('li') #First li
    while(w is not None): #Iterate through each article
        #print("w\t",w)
        title = w.a.string
        link = w.a['href']
        cite = w.cite.text.replace(w.cite.span.text, '')
        date = w.cite.span.text
        article = [title, link, cite, date]
        htmlArticles.append(article)
        w = w.next_sibling #Next Article

#Setup for storage in Mongodb
for article in htmlArticles:
    jsonArticle = {}
    jsonArticle['ticker'] = ticker
    jsonArticle['title'] = article[0]
    jsonArticle['url'] = article[1]
    jsonArticle['cite'] = article[2]
    jsonArticle['date'] = article[3]
    jsonArticle['source'] = sourceSite
    jsonArticle['weight'] = "0"
    jsonArticle['createTimeInMillis'] = datetime.now().microsecond

    articles.update({ 'ticker': ticker, 'url' : jsonArticle['url'] }, jsonArticle , upsert=True) #Insert into Mongo

#Document, in the form of a Python dictionary....it's just JSON...
#insertValue = {          "url": "http://www.wsj.com/articles/u-s-chinese-universities-to-launch-technology-design-program-1434657616?ru=yahoo?mod=yahoo_itp",
                          #"title": "U.S., Chinese Universities to Launch Technology, Design Program",
                          #"date": "June 18, 2015 4:00 p.m. ET",
                          #"cite": "",
                          #"weight": "1"
                          #"id": "0"
                          #ticker: ""
                          #"last_updated": datetime.datetime.utcnow()}

#print(articles.find_one({'ticker': ticker}))