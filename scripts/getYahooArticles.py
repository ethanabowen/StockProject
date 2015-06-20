import pymongo
import datetime
from pymongo import MongoClient

client = MongoClient()
db = client.Stocks
collection = db.Articles

#Document, in the form of a Python dictionary....it's just JSON...
insertValue = { "ticker": "MSFT",
	  "Articles": [
			{ "url": "http://www.wsj.com/articles/u-s-chinese-universities-to-launch-technology-design-program-1434657616?ru=yahoo?mod=yahoo_itp", "title": "U.S., Chinese Universities to Launch Technology, Design Program", "date": "June 18, 2015 4:00 p.m. ET", "weight": "1"},
			{ "url": "http://www.wsj.com/articles/virtual-reality-gets-real-for-sony-1434650475?ru=yahoo?mod=yahoo_itp", "title": "irtual Reality Gets Real for Sony", "date": "June 18, 2015 2:01 p.m. ET", "weight": "0"}
		    ],
	  "last_updated": datetime.datetime.utcnow()
	}

#Insert into Mongo, store the ID used (for test purposes only)
insertIDValue = collection.insert_one(insertValue).inserted_id
print(insertIDValue)
print(collection)
print(collection.find_one({'ticker':'MSFT'}))
