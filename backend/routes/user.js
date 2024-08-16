const express = require("express");
const router = express.Router();
const { User } = require("../db/User");
const zod = require("zod");
const JWT_SECRET = require("../config");

router.use(express.json());

const signUpSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

router.post("/signup", async (req, res) => {
  const body = req.body;
  const result = signUpSchema.safeParse(body);
  if (!result.success) {
    res.status(400).json({ message: "Email already taken / Incorrect inputs" });
  }

  const existingUser = await User.findOne({
    username: body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const user = await User.create({
    username: body.username,
    password: body.password,
    firstName: body.firstName,
    lastName: body.lastName,
  });
  const userId = user._id;
  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });

});



router.post("/login", (req, res) => {
  const { email, password } = req.body;
});

router.put("/update", (req, res) => {
  const { name, email, password } = req.body;
});

module.exports = router;
