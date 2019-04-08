# IOT Capteur de température

_BIGEARD Robin - DAVID Marceau_

## Sommaire

1. [Introduction](#Introduction)  
   1.2. [Connexion à la Raspberry en SSH](#Connexion-à-la-Raspberry-en-SSH)  
   1.3. [Matériel](#Matériel)  
   1.4. [Câblage](#Câblage)  
   1.5. [Script Python](#Script-Python)
2. [BDD MongoDB](#BDD-MongoDB)
3. [Application Web Express.js](#Application-Web-Express.js)
4. [Graphique Chart.js](#Graphique-Chart.js)
5. [Lancement automatique des scripts](#Lancement-automatique-des-scripts)

## Introduction

Ce projet est un projet étudiant d'IoT, dont l'objectif était de créer un dispositif de mesure de la température en utilisant des technologies tel que la Raspberry, Node.js, Python et MongoDB.

### Connexion à la Raspberry en SSH

Par défaut, SSH est installé sur la Raspberry Pi, mais est désactivé pour des raisons de sécurité. La première chose à faire sera donc d’activer SSH sur votre Raspberry Pi.

Pour cela, il vous suffit de brancher la carte MicroSD de votre Raspberry Pi sur votre ordinateur, de vous rendre sur la carte, et de créer un fichier nommé ssh dans la partition boot.

**Client :**

```bash
ssh-keygen -t rsa
ssh-copy-id -i id_rsa.pub pi@192.168.2.2
```

**Raspberry :**

```bash
cp /home/pi/.ssh/authorized_key /root/.ssh/
reboot
```

**Client :**

```bash
root@192.168.2.2
```

**Par Default :**

- Username: pi
- Password: raspberry

### Matériel

- DHT11  
  ![dht11 sensor](/img/DHT11.jpg "DHT11")

- Raspberry Pi 3 Modèle B (OS Raspbian)  
  ![raspberry](/img/raspberry.jpg "Raspberry Pi 3 Modèle B")

- 3 Cables  
  ![raspberry](/img/cables.jpg "Cables")

## Script Python

### Câblage

Pour le Câblage il faudra mettre le brachement comme présenter sur le schéma.
![alt text](/img/schema.png "schema")
![alt text](/img/schem.png "schem")

### Code Python

La premiere étape l'installation de Python 3, Pip 3 et Adafruit_DHT.

```bash
sudo apt-get update
sudo apt-get upgrade
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

Code Python pour le DHT11

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

La base de données utilisé la DaaS (Database as a Service) de MongoDB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

Script Python supportant la BDD :

```python
#!/usr/bin/python
import sys
import Adafruit_DHT
from time import time, sleep
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

    sleep(59)
```

Fichier : [dht11.py](https://github.com/marceaudavid/iot-sensor/blob/master/dht11.py)

## Application Web Express.js

Fichier : [server.js](https://github.com/marceaudavid/iot-sensor/blob/master/server.js)

L'application est réalisé avec node.js et utilise le framework [express.js](https://expressjs.com/), le client mongodb et la librairie socket.io pour échanger les données en temps réel avec le protocole WebSocket.

L'application s'appuie sur les streams mongoDB qui permettent de détecter en temps réel les changements dans la base de donnée. Lors d'une insertion en BDD, nous récupérons les 20 dernières entrée dans la base et les envoyons au client via socket.io.

```javascript
const stream = db.collection("data").watch();
stream.on("change", change => {
  if (change.operationType === "insert") {
    db.collection("data")
      .find()
      .sort({ _id: -1 })
      .limit(20)
      .toArray((err, result) => {
        if (err) return console.log(err);
        console.log(result);
        io.emit("data", result);
      });
  }
});
```

## Graphique Chart.js

Fichiers : [index.html](https://github.com/marceaudavid/iot-sensor/blob/master/public/index.html), [main.js](https://github.com/marceaudavid/iot-sensor/blob/master/public/js/main.js)

Pour générer le graphique nous utilisons la librairie [chart.js](https://www.chartjs.org/).

A chaque envoi de données le client va rafraîchir les données affichées et créer un nouveau graphique avec les données à jour.

![website screenshot](/img/graph.png "Graphique")

## Lancement automatique des scripts

```bash
sudo nano /etc/rc.local
```

```bash
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

Ligne de commande pour le debug:

```bash
sudo bash -c 'python /home/pi/iot-express/dht11.py > /home/pi/iot-express/dht11.log 2>&1' &
```
