const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcidc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000

// console.log(process.env.DB_USER)


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@cluster0.zcidc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProducts', (req, res)=>{
      const products = req.body;
      productsCollection.insertOne(products)
      // productsCollection.insertMany(products)
      .then(result =>{
        console.log(result);
        console.log(result.insertedCount)
        res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) =>{
    productsCollection.find({}).limit(20)
    .toArray((err, document) => {
        res.send(document)
    })
  })

  app.get('/product/:key', (req, res) =>{
    productsCollection.find({key: req.params.key})
    .toArray((err, document) => {
        res.send(document[0]);
    })
  })

  app.post('/productsByKeys', (req, res) =>{
    const productsKeys = req.body;
      productsCollection.find({key: { $in: productsKeys}})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
      console.log(result);
      res.send(result.insertedCount > 0)
  })
})
  

});

app.listen(port)