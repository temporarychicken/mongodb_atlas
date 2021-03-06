# Simple API built against MongoDB Atlas
The API server runs in node js.

Prerequisites:
* Node JS
* Mongo Plugin for Node JS - Allows backend DB connection to Atlas
* Express Plugin for Node JS - Enables frontend API server

Instructions:

Run up the API application:
```node.exe connect_to_mongo.js```

The default listening port is 9999. You can retrieve an OAS3.0 spec of the API by hitting the following endpoint:
```http://localhost:9999/api/people```

From there, the API can be utilized to create new people in the database, and to retrieve a list of existing people.