const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.rfaan6v.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {

        const database = client.db('simple-ecommerce');
        const productCollection = database.collection("productCollection")
        const userCollection = database.collection("userCollection")

        app.get('/products', async (req, res) => {
            try {
                const result = await productCollection.find().toArray()
                res.send(result)
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "something went worng",
                    err: error
                })
            }
        })

        app.get('/products/:id', async (req, res) => {
            try {
                const id = req.params.id
                const query = { _id: new ObjectId(id) }
                const result = await productCollection.findOne(query)
                res.send(result)
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "something went worng",
                    err: error.message
                })
            }
        })

        app.post('/users', async(req,res) => {
            const user = req.body;
            const query = { Email:user.Email}
            const exestingUser = await userCollection.findOne(query)
            if(exestingUser){
              return res.send({message:'user allready added'})
            }
            const result =await userCollection.insertOne(user);
            res.send(result)
          })



        let cart = [];

        app.post('/cart', (req, res) => {
            const { product } = req.body;
            cart.push(product); 
            res.json({ cart });
        });




        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})