# *** THIS IS FOR DEVELOPMENT ONLY *** 


Google Spreadsheet Database
---------------

A project to convert Google Spreadsheet into realtime database with API endpoint

![Demo](/assets/demo.gif)

Getting started (2 setps)
---------------

### Google spreadsheet

Create a new google spreadsheet and config the share settings as follow 

![Share config 1](/assets/01.png)

Find the spreadsheet id 

![Share config 2](/assets/02.png)

Find the gid per sheet

![Share config 3](/assets/03.png)

Here is the [Sample spreadsheet](https://docs.google.com/spreadsheets/d/1-kQ1wREmYaQ0qCbaQKHrWZmpaesHoKgDU1O1nbL1ofQ/edit#gid=0) with the following assumptions 

* Each row as a record
* First row must be the header and also used as the key in API
* If the column name started with * will be shipped in the API

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

### Unity

I will recommend to use the following asset to get the data [
Rest Client for Unity](https://assetstore.unity.com/packages/tools/network/rest-client-for-unity-102501)


```
RestClient.Get<APIData>(domain + "data/all");
```

APIData.cs
```c#
[System.Serializable]
public class APIData
{
  public Data1[] demo;
}
```

Data1.cs
```c#
[System.Serializable]
public class Data1
{
  public int ID;
  public string Name;
  public int Str;
  public int Int;
  public int Dex;
}
```

Data2.cs
```c#
[System.Serializable]
public class Data2
{
  public int ID;
  public string MapName;
  public int NumberOfEnemies;
}

