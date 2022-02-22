const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const cors = require("cors");
app.use(cors());

const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' });

const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://admin:admin@blockchaininstance.3ti8e.mongodb.net/test?authSource=admin&readPreference=primary&ssl=true";
const client = new MongoClient(uri);

/*async function checkServerStatus() {
  try {
    await client.connect();
    await client.db("blockchain").command({ ping: 1 });
  } finally {
    console.log("Connected successfully to server");
    await client.close();
  }
}
checkServerStatus().catch(console.dir);
*/
app.get("/api/:id", (req, res) => {

  var id = req.params.id;

  if (isNaN(id)){
    if((!id.startsWith('0'))){
      console.log("Blocked invalid request: " + id)
      return res.sendStatus(204);
    }
  } 

  console.log("Query called -> " + id);

  let identifier;

  if(id.startsWith('0x') || id.startsWith('00')) {
    identifier = 'hash'
  }
  else {
    identifier = 'height'
  }
  getBlockData(id, identifier).then((result) => {  

    if (!result) {
      console.log("No results found for query");
      return res.sendStatus(404);
    } 
    else {
      console.log("Returned result");
      res.json(result)
    }

  });
});

async function getBlockData(query, identifier) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    console.log("Looking for " + identifier + " of " + query);
    result = await blockchaindb.collection("embedded_txs").findOne({[identifier]:parseInt(query)});
  } finally {
    console.log(result)
    return (result);
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});