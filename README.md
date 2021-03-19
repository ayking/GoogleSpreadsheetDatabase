Google Spreadsheet Database
---------------

A project to convert Google Spreadsheet into realtime database with API endpoint

Getting started (2 setps)
---------------

### Google spreadsheet

Create a new google spreadsheet and config the share settings as follow

![Share config 1](/assets/01.png)

Find the spreadsheet id 

![Share config 2](/assets/02.png)

Find the gid per sheet

![Share config 3](/assets/03.png)

### Run server

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose) will be automatically installed.

Update the spreadsheet id and gid in config.json (you can update it anytime when the server is running)
```
server/config/config.json 
```

Run in this directory:
```
docker-compose up -- build
```
The app will be running at [http://localhost:8080](http://localhost:8080).

* Register the IP whitelist [http://localhost:8080/letmein?k=password](http://localhost:8080/letmein?k=password)
* Vist the API endpoint by [http://localhost:8080/data/all](http://localhost:8080/data/all)


