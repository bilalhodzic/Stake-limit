# Stake-limit

## Installing and running  
To run this project you will need:  
-Node.js  
-Code editor (I use visual studio code)  
-Xampp to run database (if you don't have it you can download it from [here](https://www.apachefriends.org/index.html)

Download the project from github, open terminal and run **npm install**  
Open Xampp and start MySQL. Go to [localhost](http://localhost/phpmyadmin/index.php) and **import** database from root folder(stake-limit.sql)  
In terminal run **npm start**

## Structure of the app
|-controllers  
|  --queries to a database  
|-routes  
|  --POST/GET/PUT/DELETE routes  
|-index.js


### Diagram flow when ticketMessage is sent
<img  src="https://github.com/bilalhodzic/Stake-limit/blob/main/diagram%20flow-sendTicket.png" width=500 height=700>  </br>

## Documentation
**POST("/sendTicket)** accepts ticketMessage payload sent in the body as following:  
```
{
"id": "7d570ef0-0bef-41e9-baea-2535bd08b58f" //need to be valid UUID
"deviceId": "7d570ef0-0bef-41e9-baea-2535bd08b58f //valid UUID
"stake": 14 //must be a number
}
```
Enpoint will return one of the following statuses:
```
- OK :: Ticket can be accepted, since no limit has been applied.
- HOT :: Ticket can be accepted, but status serves as a warning that device
is close to being blocked
- BLOCKED :: Signals that device is blocked from accepting tickets
```
**POST("/configure)** accepts configuration option payload sent in the body as following example:  
```
{
    "timeDuration": "600", //Time period in which limiting is being applied (in seconds)
    "stakeLimit": "1000", //Amount after which device should be blocked (sum all stakes in
“Time duration”)
    "hotPercentage": '80', //Percentage of “Stake limit” value, after which
device should be declared as HOT
    "restrictionExpires": '300', //Time after blocked device is automatically unblocked (in
seconds):
}
```
**POST("/configure/:deviceId)** adds stake limit configuration to deviceId given in the parametres. Route accepts option payload sent in the body same as the previous one.  

**POST("/device)**  Inserts new device with configuration(see in the diagram) with given deviceId in the body  
``` 
{
"deviceId": "9b9bf7df-cd65-452f-b6cc-48bf40319c84"
} 
```
 **GET("/device")** returns all devices from database  
 **GET("/device/:id")** returns all details about device and it's tickets from database  
 **GET("/tickets")** returns all tickets from database  
 
 **DELETE("/tickets")** delete all tickets from database  
 **DELETE("/tickets/:id")** delete tickets with given id in parameters from database  
 

 
 


