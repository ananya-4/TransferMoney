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

const personalInfoSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  CurrentBalance: Number,
  NoOfPayments: Number
});

const transactionSchema = new mongoose.Schema({
  idFrom: String,
  idTo: String,
  amount: Number
});

const PersonalInfo = mongoose.model('PersonalInfo', personalInfoSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/api/data', async (req, res) => {
  try {
    const data = await PersonalInfo.find();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/submit', async (req, res) => {
  const { idFrom, idTo, amount } = req.body;

  try {
    const transaction = new Transaction({ idFrom, idTo, amount });
    await transaction.save();
    res.status(201).json({ message: 'Transaction created' });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.patch('/updatePersonalInfo/:id', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const updatedUser = await PersonalInfo.findByIdAndUpdate(
      id,
      { $inc: { CurrentBalance: -amount, NoOfPayments: 1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


