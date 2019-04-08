# IOT Capteur de température

## Sommaire

1. [Introduction](#Introduction)
2. [Matériel](#Matériel)
3. [Câblage](#Câblage)
4. [Présenetation du code Python](#Présenetation-du-code-Python)
5. [Database Mongodb](#Database-Mongodb)
6. [Server Web Express](#Server-Web-Express)
7. [Graphique-ChartJs](#Graphique-ChartJs)
8. [L'ancement automatique des scripts](#L'ancement-automatique-des-scripts)

## Introduction

## Matériel

## Câblage

## Présenetation du code Python

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
