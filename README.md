# FnbSignup

# Fullstack application designed and devloped by Darian Steyn

![image](https://user-images.githubusercontent.com/39791440/211010354-df7751b6-f00d-4c44-8676-ae1a055f7494.png)

Mongo DB setup

Make sure you have the MongoDB.Driver nuget package installed.

Add Mongo to docker by running the following in your terminal - docker pull mongo

Create a container with the mongo image in detached mode so that it is still interactive on your system: docker run -p 27017:27017 --name mongo_example -d mongo

In your Mongo GUI, create a Database with the following struvture based on the appsettings below -

AuthDb > Users

"DatabaseSettings": { "ConnectionString": "mongodb://localhost:27017", "DatabaseName": "AuthDb", "CollectionName": "Users" }

Data structure would be -
{ "_id": { "$oid": "63b6ba0c6ab80f50290347d7" }, "Name": "Darian22", "Surname": "Steyn", "Email": "Test", "Password": "Test" }

![image](https://user-images.githubusercontent.com/39791440/211009668-fb1a93d7-dcbe-45a7-a318-71998b2b08b1.png)

Start mongo container on docker UI or in terminal. Run Services solution (https://github.com/DarianSteynDesign/fnbSignupServices). Clone and run Angular UI locally (https://github.com/DarianSteynDesign/fnbSignup), make sure ports align between services "ConnectionString": "mongodb://localhost:27017" and local mongoDB ports.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
