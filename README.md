# IOT Express 


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
