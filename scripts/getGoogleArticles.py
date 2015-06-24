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

def main(arg1):
	#Query site for HTML
	ticker = arg1
	sourceSite = 'Google'
	url = 'https://www.google.com/finance/company_news?q=NASDAQ%3A' + ticker
	#nyseurl = 'https://www.google.com/finance/company_news?q=NYSE%3A' + ticker
	#print(url)
	response = urllib.request.urlopen(url)
	html = ''
	for line in response.fp:
		html += line.decode('utf-8')
	#print(html)
	#Parse and store Article information from Yahoo
	htmlArticles = []
	soup = BeautifulSoup(html)
	ul = soup.find('div', { 'class' : 'sfe-break-right'})
	for q in ul.find_all('div', { 'class' : 'g-section news sfe-break-bottom-16' } ): #All articles for a day
		w = q
		while(w is not None and hasattr(w, 'a')): #Iterate through each article
			#print("w\t",w)
			title = w.a.string
			link = w.a['href']
			citeSoup = w.find('div', { 'class' : 'byline' })
			cite = citeSoup.span.text
			date = citeSoup.text.replace(citeSoup.span.text, '')
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
		#print(jsonArticle,'\n')
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
