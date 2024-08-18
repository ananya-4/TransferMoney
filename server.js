const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017/transferMoney";
const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

async function run() {
  try {
    await client.connect();
    const database = client.db("transferMoney");
    const collectionPer = database.collection("personalInfo");
    const collection = database.collection("transactions");

    app.get("/api/data", async (req, res) => {
      const data = await collectionPer.find().toArray();

      const formattedData = data.map((item) => ({
        _id: item._id.toString(),
        Name: item.Name,
        Email: item.Email,
      }));
      res.json(formattedData);
    });

    app.post("/submit", async (req, res) => {
      const { idFrom, idTo, amount } = req.body;
      console.log(`Received form data: ${idFrom}, ${idTo}, ${amount}`);

      const transaction_1 = {
        idFrom: idFrom,
        idTo: idTo,
        amount: parseInt(amount), // Ensure amount is stored as a number
      };

      try {
        // Update the sender's document

        const senderUpdate = await collectionPer.updateOne(
          { _id: new ObjectId(idFrom) },
          {
            $inc: {
              CurrentBalance: -parseInt(amount),
              NoOfPayments: 1,
            },
          }
        );

        // Update the receiver's document
        const receiverUpdate = await collectionPer.updateOne(
          { _id: new ObjectId(idTo) },
          {
            $inc: {
              CurrentBalance: parseInt(amount),
            },
          }
        );

        // Insert the transaction document
        const result = await collection.insertOne(transaction_1);
        console.log("Transaction inserted:", result.insertedId);
        res.send("Transaction successfully recorded");
      } catch (err) {
        console.error(
          "Error updating documents or inserting transaction:",
          err
        );
        res.status(500).send("Error recording transaction");
      }
    });
  } catch (err) {
    console.error(err);
  }
}

run().catch(console.error);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
