const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const cors = require("cors");
app.use(cors());

const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' });

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";
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

app.get("/api/latest", (req, res) => {

  var id = req.params.id;

  console.log("Query called -> " + id);

  getLatestBlocks().then((result) => {  

    if (!result) {
      console.log("No results found for query");
      return res.sendStatus(404);
    } 
    else {
      console.log(JSON.stringify(result))
      res.json(result)
    }

  });
});

app.get("/api/tx/:id", (req, res) => {

  var id = req.params.id;

  if (isNaN(id)){
    if((!id.startsWith('0'))){
      console.log("Blocked invalid request: " + id)
      return res.sendStatus(204);
    }
  } 

  console.log("Fetching latest blocks -> " + id);
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

app.get("/api/address/:id", (req, res) => {

  var id = req.params.id;

  if(id.startsWith('1') || id.startsWith('3') || id.startsWith('b')) {
    getAddressTransactions("1517uEBW1DZCzYotyvhps2bFXTqt5WDSPT").then((result) => {  
      if (!result) {
        console.log("No results found for wallet");
      } 
      else {
        console.log(result)
        res.json(result)
      }
    }); 
  }
  else {
    console.log("Blocked invalid request: " + id)
    return res.sendStatus(204);
  }
});

//.project({ _id: 0, "tx.$": 1 }); .project({"tx.$": 1})

async function getAddressTransactions(address) {
  let result_to;
  let result_from;
  let result;
  console.log("Looking for " + address + " transactions");
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    result_to = await blockchaindb.collection("blocks").find({"tx.outputs.to": address}).project({ _id: 0, "tx.$": 1 }).toArray();
    result_from = await blockchaindb.collection("blocks").find({"tx.inputs.from": address}).project({ _id: 0, "tx.$": 1 }).toArray();
    result = {
      "received": result_to,
      "spent": result_from
    }
  } finally {
    return (result);
  }
}

async function getBlockData(query, identifier) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    console.log("Looking for " + identifier + " of " + query);
    if (identifier == 'height') {
      result = await blockchaindb.collection("blocks").findOne({[identifier]:parseInt(query)});
    }
    else {
      result = await blockchaindb.collection("blocks").findOne({[identifier]:query});
    }
  } finally {
    console.log(result)
    return (result);
  }
}

async function getLatestBlocks() {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    result = await blockchaindb.collection("block_headers").find({}).sort({height : -1}).limit(5).toArray();
  } finally {
    return result;
  }
}

// async function getLatestTransactions(count) {
//   let result;
//   try {
//     await client.connect();
//     let blockchaindb = await client.db("blockchain")
//     console.log("Looking for latest " + count + " transactions");
//     result = await blockchaindb.collection("embedded_txs").find({"tx": 1}).limit(5).toArray();
//   } finally {
//     return (result);
//   }
// }

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  // getLatestBlocks().then((result) => {  
  //   if (!result) {
  //     console.log("No results found for blocks");
  //   } 
  //   else {
  //     console.log(result);
  //   }
  // });

  // getAddressTransactions("1517uEBW1DZCzYotyvhps2bFXTqt5WDSPT").then((result) => {  
  //   if (!result) {
  //     console.log("No results found for wallet");
  //   } 
  //   else {
  //     console.log(result);
  //   }
  // });
});