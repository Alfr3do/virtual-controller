const express = require('express');
const app = express();
const router = express.Router();
const { MongoClient } = require('mongodb');

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
  
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await  listDatabases(client);
    text = "";
    databasesList.databases.forEach(db => text += ` - ${db.name}`);

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
  res.send(text);
});

app.use(express.static(path));
app.use('/', router);

app.listen(port, function () {
  console.log('Example app listening on port 8080!')
})
