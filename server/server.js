const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const cors = require("cors");
app.use(cors());

const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' });

app.get("/api", (req, res) => {
  getBlockData("000000000000000000068856ddd36a87d9307243b9c34ee4f3744ec980d342d1").then((value) => console.log(value))
  res.json(
    {
      height: '9',
      blockhash: '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f', 
      timestamp: '2022-01-22 18:41',
      txcount: '1',
      difficulty: '1.00',
      version: '2022-01-22 18:41',
      bits: '486,604,799',
      size: '285' 
    }
  )
});

async function getBlockData(blockhash) {

  let connection;
  try {
    connection = await oracledb.getConnection({ user: "ADMIN", password: "Blockchaindbpass1", connectionString: "blockchaindb_high"});
    const result = await connection.execute(`SELECT * FROM BLOCKCHAIN.BLOCK WHERE HASH='${blockhash}'`);
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});