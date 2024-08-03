const express = require("express");
const router = express.Router();

router.use(express.json())


router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
});

router.put("/update", (req, res) => {
  const { name, email, password } = req.body;
});

module.exports = router;