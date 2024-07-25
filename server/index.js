const express = require('express');
const connectDB = require('./config/testDB');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const authenticate = require ('./middlewares/authenticate');


dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Ace Academy!');
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
