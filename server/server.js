const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

const cors = require("cors");
app.use(cors());

const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' });

app.get("/api", (req, res) => {
  getBlockData(req.queryPath).then((result) => {  
    rows = result.rows[0];
    res.json({
      hash: rows[0],
      confirmations: rows[1],
      strippedsize: rows[2],
      blocksize: rows[3],
      weight: rows[4],
      height: rows[5],
      version: rows[6],
      versionHex: rows[7],
      merkleroot: rows[8],
      time: rows[9],
      mediantime: rows[10],
      nonce: rows[11],
      bits: rows[12],
      difficulty: rows[13],
      chainwork: rows[14],
      ntx: rows[15],
      previousblockhash: rows[16],
      nextblockhash: rows[17],
    })
  });
});

async function getBlockData(blockhash) {

  let connection;
  try {
    connection = await oracledb.getConnection({ user: "ADMIN", password: "", connectionString: "blockchaindb_high"});
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