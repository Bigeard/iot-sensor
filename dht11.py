#!/usr/bin/python
import sys
import Adafruit_DHT
import datetime
from pymongo import MongoClient
# pprint library is used to make the output look more pretty
from pprint import pprint
# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient("mongodb://cronoses:nuggets@cluster0-shard-00-00-lrtb2.mongodb.net:27017,cluster0-shard-00-01-lrtb2.mongodb.net:27017,cluster0-shard-00-02-lrtb2.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true")
db=client.IOT
# Issue the serverStatus command and print the results
serverStatusResult=db.command("serverStatus")
pprint(serverStatusResult)

while True:

    humidity, temperature = Adafruit_DHT.read_retry(11, 4)

    print 'Temp: {0:0.1f} C  Humidity: {1:0.1f} %'.format(temperature, humidity)
    value = {
        'temperature' : temperature,
        'humidity' : humidity,
        'date' : datetime.datetime.now()
    }

    result=db.data.insert_one(value)