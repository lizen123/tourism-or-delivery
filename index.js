const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()



const cors = require('cors');
const port = process.env.PORT || 5000;

// middle wire 
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yvumd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); 


async function run() {
    try {
      
      await client.connect();
      const database = client.db('insertDB');
      const planCollection = database.collection("plans");
      const bookingCollection = database.collection("booking");

       // get tourist api 

       app.get('/plans', async (req, res) => {
        const cursor = planCollection.find({});
        const plans = await cursor.toArray();
        res.send(plans)
    });

    //  get single api 
    app.get('/plans/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const plan = await planCollection.findOne(query)
        res.json(plan);
    });


    // add booking 
    app.post('/booking', async (req, res) => {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        res.json(result)
    });



    // get all booking admin 


    app.get('/allBookings', async (req, res) => {
        const result = await bookingCollection.find({}).toArray();
        res.send(result);
    });

    // delete bookings admin
    app.delete("/deleteAllBooking/:id", async (req, res) => {
        console.log(req.params.id);
        const result = await bookingCollection.deleteOne({
            _id: ObjectId(req.params.id),
        });
        res.send(result);
    });

    } 
    
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('what can u do and anything else');
});

app.listen(port, () => {
    console.log('server is running 1', port)
})