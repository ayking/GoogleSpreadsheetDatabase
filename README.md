Google Spreadsheet Database
---------------

A project to convert Google Spreadsheet into realtime database with API endpoint

Getting started
---------------

Download [Docker Desktop](https://www.docker.com/products/docker-desktop) for Mac or Windows. [Docker Compose](https://docs.docker.com/compose) will be automatically installed.

## Run server
Run in this directory:
```
docker-compose up -- build
```
The app will be running at [http://localhost:8080](http://localhost:8080).

* Register the IP whitelist [http://localhost:8080/letmein?k=password](http://localhost:8080/letmein?k=password)
* Vist the API endpoint by [http://localhost:8080/data/all](http://localhost:8080/data/all)
* You can update the **whitelist password/spreadsheet id/more data** in server/config/config.json 

