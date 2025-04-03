const express = require('express');
const app = express();
const router = express.Router();
const { MongoClient } = require('mongodb');
const moment = require('moment');

USER_NAME = "alfre"
PASSWD = "Pollux11"
CLUSTER = "testcluster.5llwwjg"
DOMAIN = "mongodb.net"
user_name=  USER_NAME
password = PASSWD
cluster_url = CLUSTER
db_url = cluster_url+"."+DOMAIN
yourConnectionURI= "mongodb+srv://"+user_name+":"+password+"@"+db_url+"/?retryWrites=true&w=majority"

const client = new MongoClient(yourConnectionURI);


const path = __dirname + '/view/';
const port = 8085;

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});
router.get('/test', function(req,res)
{
  res.send("testing...");
  console.log("log");
  console.info("info");
}
); 
router.get('/', function(req,res){
  res.sendFile(path + 'index.html');
});

router.get('/sendData', async function(req,res){
  let asv = "";
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const database = await  client.db("db");
    const collection = await database.collection("swarm2");
    //yyyy-mm-dd:hh:mm:ss'
    const doc  = {"metadata":{"asvid":20,"type":"temperature"},
                  "timestamp":moment().format("yyyy-MM-DDThh:mm:ss.000+00:00"),
                  "temp":12,
                  "latitude":25.824617,
                  "longitude": -80.156593
                 }
    result = await collection.insertOne(doc)
    console.log(asv)

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
  res.send(asv);
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})
