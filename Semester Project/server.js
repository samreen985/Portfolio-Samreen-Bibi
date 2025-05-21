require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a simple FlightBooking schema
const flightBookingSchema = new mongoose.Schema({
  from: String,
  to: String,
  date: String,
  passengerName: String,
  email: String,
  createdAt: { type: Date, default: Date.now },
});

const FlightBooking = mongoose.model('FlightBooking', flightBookingSchema);

// Routes

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// POST route to save booking
app.post('/book-flight', async (req, res) => {
  try {
    const bookingData = req.body;
    const newBooking = new FlightBooking(bookingData);
    await newBooking.save();
    res.status(201).json({ message: 'Booking saved successfully', booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: 'Error saving booking', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
