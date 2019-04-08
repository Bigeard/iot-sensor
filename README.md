# IOT Capteur de température
*BIGEARD Robin - DAVID Marceau*

## Sommaire

1. [Introduction](#Introduction)    
1.2 [Matériel](#Matériel)   
1.3 [Câblage](#Câblage)   
1.4 [Présenetation du code Python](#Présenetation-du-code-Python)
2. [Database Mongodb](#Database-Mongodb)
3. [Server Web Express](#Server-Web-Express)
4. [Graphique-ChartJs](#Graphique-ChartJs)
5. [L'ancement automatique des scripts](#L'ancement-automatique-des-scripts)

## Introduction

### Matériel
  - DHT11   
  ![alt text](/img/DHT11.jpg "DHT11")

  - Raspberry Pi 3 Modèle B (OS Raspbian)   
  ![alt text](/img/raspberry.jpg "Raspberry Pi 3 Modèle B")

  - 3 Cables  
  ![alt text](/img/cables.jpg "Cables")
### Câblage
Pour le Câblage il faudra mettre le brachement comme présenter sur le schéma.

  ![alt text](/img/schema.jpg "schema")
  ![alt text](/img/schem.jpg "schem")
### Code Python

La premiere étape l'installation de Python 3, Pip 3 et Adafruit_DHT.
```bash
sudo apt-get update
sudo apt-get upgarde
sudo apt-get install python3
sudo apt-get install python3-pip
sudo python3 -m pip install --upgrade pip setuptools wheel
```
```bash
sudo pip install Adafruit_DHT
```
```bash
sudo python3 dht11.py install
```

Code Python
```python
#!/usr/bin/python
import sys
import Adafruit_DHT
from time import time, sleep
import datetime

while True:
    humidity, temperature = Adafruit_DHT.read_retry(11, 4)
    print 'Temp: {0:0.1f} C  Humidity: {1:0.1f} %'.format(temperature, humidity)
    sleep(59)
```


## Database Mongodb

## Server Web Express

## Graphique ChartJs

## L'ancement automatique des scripts

`sudo nano /etc/rc.local`


```
#!/bin/sh -e
#
# rc.local
#
# This script is executed at the end of each multiuser runlevel.
# Make sure that the script will "exit 0" on success or any other
# value on error.
#
# In order to enable or disable this script just change the execution
# bits.
#
# By default this script does nothing.

# Print the IP address
_IP=$(hostname -I) || true
if [ "$_IP" ]; then
  printf "My IP address is %s\n" "$_IP"
fi

python /home/pi/iot-express/dht11.py &
node /home/pi/iot-express/server.js &

exit 0
```
Line for see bug: 

`sudo bash -c 'python /home/pi/iot-express/dht11.py > /home/pi/iot-express/dht11.log 2>&1' &`
