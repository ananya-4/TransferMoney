const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

const uri = 'mongodb://localhost:27017/transferMoney';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

app.use(cors());
app.use(bodyParser.json());

// ... other middleware

const personalInfo = new mongoose.Schema({
  Name: String,
  Email: String,
  CurrentBalance: Number,
  NoOfPayments: Number
});

const transactions = new mongoose.Schema({
  idFrom: String,
  idTo: String,
  amount: Number
});

const PersonalInfo = mongoose.model('PersonalInfo', personalInfo);
const Transaction = mongoose.model('Transaction', transactions);


app.get("/api/data", async (req, res) => {
  try {
    const data = await PersonalInfo.find();
    

    const formattedData = data.map((item) => ({
      _id: item._id.toString(),
      Name: item.Name,
      Email: item.Email,
      CurrentBalance: item.CurrentBalance,
      NoOfPayments: item.NoOfPayments,
    }));
    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.post('/submitTransaction', async (req, res) => {
  const { idFrom, idTo, amount } = req.body;

  try {
    const transaction = new Transaction({ idFrom, idTo, amount });
    await transaction.save();

    // Update the CurrentBalance and NoOfPayments of the sender
    await PersonalInfo.findByIdAndUpdate(
      idFrom,
      { $inc: { CurrentBalance: -amount, NoOfPayments: 1 } },
      { new: true }
    );

    // Update the CurrentBalance of the receiver
    await PersonalInfo.findByIdAndUpdate(
      idTo,
      { $inc: { CurrentBalance: amount } },
      { new: true }
    );

    res.status(201).json({ message: 'Transaction created' });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.patch('/updateTransaction/:id', async (req, res) => {
  const { id } = req.params;
  const { idFrom, idTo, amount } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { idFrom, idTo, amount },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Update the CurrentBalance and NoOfPayments of the sender
    await PersonalInfo.findByIdAndUpdate(
      idFrom,
      { $inc: { CurrentBalance: -amount, NoOfPayments: 1 } },
      { new: true }
    );

    // Update the CurrentBalance of the receiver
    await PersonalInfo.findByIdAndUpdate(
      idTo,
      { $inc: { CurrentBalance: amount } },
      { new: true }
    );

    res.json(updatedTransaction);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


