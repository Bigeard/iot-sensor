# IOT Capteur de température

_BIGEARD Robin - DAVID Marceau_

## Sommaire

1. [Introduction](#Introduction)
2. [Matériel](#Matériel)
3. [Câblage](#Câblage)
4. [Script Python](#Script-Python)
5. [BDD MongoDB](#BDD-MongoDB)
6. [Application Web Express.js](#Application-Web-Express.js)
7. [Graphique Chart.js](#Graphique-Chart.js)
8. [Lancement automatique des scripts](#Lancement-automatique-des-scripts)

## Introduction

### Matériel

- DHT11  
  ![dht11 sensor](/img/DHT11.jpg "DHT11")

- Raspberry Pi 3 Modèle B (OS Raspbian)  
  ![raspberry](/img/raspberry.jpg "Raspberry Pi 3 Modèle B")

## Script Python

Fichier : [dht11.py](https://github.com/marceaudavid/iot-sensor/blob/master/dht11.py)

### Câblage

- 3 Cables  
  ![cables](/img/cables.jpg "Cables")

### Présentation du code Python

```bash
sudo apt-get update
sudo apt-get install python3-pip
sudo python3 -m pip install --upgrade pip setuptools wheel
```

```bash
sudo pip install Adafruit_DHT
```

```bash
sudo python3 dht11.py install
```

## BDD MongoDB

La base de données utilisé la DaaS (Database as a Service) de MongoDB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

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
