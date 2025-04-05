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

const path = __dirname + '/view/';
const port = 8085;

router.use(function (req,res,next) {
  console.log('/' + req.method);
  next();
});
router.get('/test/:lat/:lon', function(req,res)
{
  console.log(req.params.lat, req.params.lon)
  res.send("testing... ");
  console.log("log");
  console.info("info");
}
); 
router.get('/', function(req,res){
  res.sendFile(path + 'index.html');
});

router.get('/newSecret/:secret', async function(req,res){
  let asv = "";
  const client = new MongoClient(yourConnectionURI);
  try {
    //Connect to the MongoDB cluster
    await client.connect();

    const database = await  client.db("db");
    const secret = await database.collection("secret")
    await secret.updateOne({find: 'a'},{ $set: {val: req.params.secret} } );
    const collection = await database.collection("heron");
    await collection.drop()
  } catch (e) {
    console.error(e);
} finally {
    await client.close();
}
res.send(asv);
});

router.get('/sendData/:lat/:lon/:head/:temp/:secret', async function(req,res){
  let asv = "";
  //console.log(req.params.lat, req.params.lon)
  const client = new MongoClient(yourConnectionURI);
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const database = await  client.db("db");
    const secret = await database.collection("secret")
    code = await secret.findOne({},{})
    if (code.val != req.params.secret){
      console.log("no auth")
      await client.close();
      res.send(asv)
      return
    }
    console.log("auth")
    const collection = await database.collection("heron");
    //yyyy-mm-dd:hh:mm:ss'
    const doc  = {"metadata":{"id":20,"type":"temperature"},
                  "timestamp":Date.now(),//moment().format("yyyy-MM-DDThh:mm:ss.000+00:00"),
                  "temp":10,
                  "intensity":req.params.temp,
                  "latitude":req.params.lat,
                  "longitude": req.params.lon,
                  "heading": req.params.head
                 }
    result = await collection.insertOne(doc)
    //console.log(asv)

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
