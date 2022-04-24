const express = require('express');
const cors  = require('cors');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config(); 

//middleware 
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server running');
})

//MONGODB 
// username:db-user1
// pass:bjqZUGVNUOUcNP3P


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zf9ug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async() =>{
    try{
      await client.connect();
      const database = client.db('ecommerce-store');
      const productCollection = database.collection('product-collection');

      app.get('/products', async(req, res) =>{
          
        //getting query details from client side
          const page = parseInt(req.query.page);
          const size = parseInt(req.query.size);
        
          const query = {};
          const cursor = productCollection.find(query);
          let products;

          //pagination
          if(page || size){
            products = await cursor.skip(page * size).limit(size).toArray();

          }else{
           
            products = await cursor.toArray();
          }
         
          res.send(products)
      })

      app.get('/productsCount', async(req, res) =>{
          const count = await productCollection.estimatedDocumentCount();
          res.send({count});
      });

      app.post('/productsById', async (req, res)=>{
          const keys = req.body;
          const ids = keys.map(id => ObjectId(id))
          console.log(keys);
          const query = {_id: {$in: ids}}
          const cursor = productCollection.find(query);
          const products = await cursor.toArray();
          res.send(products);
      })



    }
    finally{




    }
}

run().catch(console.dir)








app.listen(port, ()=>{
    console.log('listening on port', port)
});