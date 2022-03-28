const express = require("express");
const cors = require("cors");
const bp = require('body-parser')
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

var jsonParser = bp.json();

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function checkServerStatus() {
  try {
    await client.connect();
    await client.db("blockchain").command({ ping: 1 });
  } finally {
    console.log("Connected successfully to server");
    await client.close();
  }
}
checkServerStatus().catch(console.dir);

app.post("/login", jsonParser, (req, res) => {

  console.log("Logging in...")
  const [username, password] = [req.body.username, req.body.password]; 

  loginUser(username, password).then((result) => {
    if(!result) return res.json({validCredentials: false})  
    bcrypt.compare(password, result).then(function(validCredentials) {
      if (validCredentials) {
        res.json({validCredentials: true, username: username})
      }
      else {
        res.json({validCredentials: false})
      }
    });
  });
});

app.post("/addwallet", jsonParser, (req, res) => {

  console.log("Adding new wallet ...")

  const [username, wallet, name] = [req.body.username, req.body.wallet, req.body.name]; 

  console.log(username + wallet + name)

  addWalletTracking(username, wallet, name).then((result) => {
    if(result) {
      console.log("Found")
      res.json({walletAdded: true})
    }
    else {
      res.json({walletAdded: false})
    }
  });
});

app.post("/removewallet", jsonParser, (req, res) => {

  console.log("Removing tracking for wallet ...")

  const [username, wallet] = [req.body.username, req.body.wallet]; 

  removeWalletTracking(username, wallet).then((result) => {
      res.json({walletRemoved: true})
  });
});

app.get("/api/stats/:id", (req, res) => {

  var id = req.params.id;

  getStats(id).then((result) => {  

    if (!result) {
      console.log("No results found for query");
      return res.sendStatus(404);
    } 
    else {
      console.log(result)
      res.json(result)
    }            

  });
});

app.get("/api/latest", (req, res) => {

  var id = req.params.id;

  console.log("Query called -> " + id);

  getLatestBlocks().then((result) => {  

    if (!result) {
      console.log("No results found for query");
      return res.sendStatus(404);
    } 
    else {
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

app.get("/api/trackedwallets/:id", (req, res) => {
  var id = req.params.id;
  getTrackedWallets(id).then((result) => {  
    if (!result) {
      return res.sendStatus(404);
    } 
    else {
      res.json(result)
    }            
  });
});

app.post("/marknotifications", jsonParser, (req, res) => {

  const username = req.body.username 

  markAsRead(username).then((result) => {
    console.log(result)
    res.json({notificationsMarked: true})
  });
});


app.get("/api/notifications/:id", (req, res) => {
  var id = req.params.id;
  getNotifications(id).then((result) => {  
    if (!result) {
      console.log("No results found for query");
      return res.sendStatus(404);
    } 
    else {
      console.log(result)
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

app.get("/api/price/:id", (req, res) => {

  var id = req.params.id;

  if(id.startsWith('0') || id.startsWith('1') || id.startsWith('2') || id.startsWith('3') || id == 'historical') {
    getHistoricalPrice(id).then((result) => {  
      if (!result) {
        console.log("Price data not found");
      } 
      else {
        res.json(result)
      }
    }); 
  }
  else {
    console.log("Blocked invalid request: " + id)
    return res.sendStatus(204);
  }
});

async function getHistoricalPrice(date) {
  let result;
  let query = (date == 'historical') ? {} : {"date": date}
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    result = await blockchaindb.collection("historical_price_data").find(query).sort({"timestamp_unix": 1}).toArray();
  } finally {
    return (result);
  }
}

async function getStats(type) {
  let result;
  const limit = (type == 'today') ? 1 : 10000
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    result = await blockchaindb.collection("stats").find({}).sort({"timestamp_unix": -1}).limit(limit).toArray();
  } finally {
    return result;
  }
}


async function getAddressTransactions(address) {
  let result_to;
  let result_from;
  let result;
  console.log("Looking for " + address + " transactions");
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    result_to = await blockchaindb.collection("blocks").find({"tx.outputs.to": address}).project({ _id: 0, "tx.$": 1 }).sort({"tx.time": -1}).toArray();
    result_from = await blockchaindb.collection("blocks").find({"tx.inputs.from": address}).project({ _id: 0, "tx.$": 1 }).sort({"tx.time": -1}).toArray();
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
    block_headers = await blockchaindb.collection("block_headers").find({}).sort({"_id" : -1}).limit(5).toArray();
    block_full = await blockchaindb.collection("blocks_full").find({}).sort({"_id" : -1}).limit(1).toArray();
  } finally {
    return {
      "block_headers": block_headers,
      "block_full": block_full 
    };
  }
}

async function loginUser(username, password) {
  let user;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain");
    user = await blockchaindb.collection("user_info").findOne({"username": username});
  }
  finally {
    if (!user) return false;
    return user.password;
  }
}

async function addWalletTracking(username, wallet, name) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain");
    result = await blockchaindb.collection("tracked_wallets").findOne({"username": username});
  }
  finally {
    if (!result) {
      try {
        await client.connect();
        let blockchaindb = await client.db("blockchain");
        result = await blockchaindb.collection("tracked_wallets").insertOne({"username": username, "tracked_wallets": [{wallet: wallet, name: name}]});
      }
      finally {
        return true
      }
    }
    else {
      try {
        await client.connect();
        let blockchaindb = await client.db("blockchain");
        result = await blockchaindb.collection("tracked_wallets").updateOne({"username": username}, {"$addToSet": {"tracked_wallets": {wallet: wallet, name: name}}});
      }
      finally {
        if (result.modifiedCount == 0) {
          console.log("Record already exists")
          return false
        }
        else {
          return true
        }
      }
    }
  }
}

async function removeWalletTracking(username, wallet, name) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain");
    result = await blockchaindb.collection("tracked_wallets").updateOne({"username": username}, { "$pull" : { "tracked_wallets": { wallet: wallet } } });
  }
  finally {
    console.log(result)
    return true
  }
}

async function getTrackedWallets(username) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain");
    result = await blockchaindb.collection("tracked_wallets").findOne({"username": username});
  }
  finally {
    return result;
  }
}

async function markAsRead(username) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain");
    result = await blockchaindb.collection("tracked_wallets").updateMany({"username": username, "notifications.read": false}, {'$set': { 'notifications.$.read': true}});
  }
  finally {
    return result;
  }
}

/*
async function getLatestTransactions(count) {
  let result;
  try {
    await client.connect();
    let blockchaindb = await client.db("blockchain")
    console.log("Looking for latest " + count + " transactions");
    result = await blockchaindb.collection("embedded_txs").find({"tx": 1}).limit(5).toArray();
  } finally {
    return (result);
  }
}
*/

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});