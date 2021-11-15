// MONGODB CONSTANTS

const {
    MongoClient
} = require('mongodb');

/**
 * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
 * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
 */
const uri = "mongodb+srv://owner:Space*117@cluster0.yhqmf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// EXPRESS WEBSERVER CONSTANTS

const express = require("express");
const app = express();
const port = 9999;

// EXPRESS WEBSERVER INCOMING API ENDPOINT REQUEST HANDLING

app.get("/api/people", (req, res) => {
    res.send("<p>Supported methods are:</p><p>/people/listall</p><p>/people/addnewperson</p>");
});

app.get("/api/people/listall", (req, res) => {

    listall().then(result => {
        finalData = result;
        res.setHeader('Content-Type', 'application/json');
        res.send(finalData);
    });

});

app.get("/api/people/addnewperson", (req, res) => {

    addnewperson(req);

    res.status(201);
    res.send("Test Acknowledged: addnewperson!");

});

app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});

// ADD NEW PERSON TO MONGO DB "children" COLLECTION

async function addnewperson(req) {

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await listDatabases(client);

        // Now we are going to create a new database called "family_members"
        async function createListing(client, newListing) {
            const result = await client.db("family_members").collection("children").insertOne(newListing);
            console.log(`New listing created with the following id: ${result.insertedId}`);
        }

        await createListing(client, {
            "name": req.param("name"),
            "age": parseInt(req.param("age")),
            "height": req.param("height"),
            "haircolour": req.param("haircolour")
        });

    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }

};

// LIST ALL MEMBERS OF MONGODB "children" COLLECTION

async function listall() {

    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await listDatabases(client);

        const bodytext = await client.db("family_members").collection("children").find({
                age: {
                    $gte: 0
                }
            }, {
                projection: {
                    _id: 0
                }
            }).toArray();

        console.log(`Our search has bought back the following results: ${JSON.stringify(bodytext)}`);

        var jsonoutput = JSON.stringify(bodytext);
        return jsonoutput;

    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }

};

// MAIN FUNCTION - UNUSED

async function main() {};

// SUPPLEMENTARY FUNCTION -- LIST ALL DATABASES WITHIN MONOGODB

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);
