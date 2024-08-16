const express = require("express");

const app = express();
const cors = require("cors");
const connectDB = require("./db");
const dotenv = require("dotenv");
const apiRouter = require('./db')
dotenv.config();
connectDB();

app.use(cors()); // It will allow for all
// app.use(cors({
//     origin: 'http://your-frontend-domain.com',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//   }));

app.use(express.json());
app.use("/api/v1", apiRouter);
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
