const express = require("express");

const app = express();
const connectDB = require("./db");
const dotenv = require("dotenv");
const userRouter = require('./backend/routes/index');

dotenv.config();

connectDB();
app.use(express.json())
app.use('/api/v1', apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});