const express = require("express");
const router = express.Router();
const { User } = require("../db/User");
const zod = require("zod");
const JWT_SECRET = require("../config");
const { authMiddleWare } = require("../middleware");

router.use(express.json());

const signUpSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const updateSchema = zod.object({
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

const loginSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
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


// Self Login route
router.post("/login", async (req, res) => {
  const body = req.body;
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    res.status(400).json({ message: "Incorrect inputs" });
  }

  try {
    const user = await User.findOne({ username: body.username });
    const userId = user._id;
    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );
  } catch {
    return res.status(500).json({ message: "User not Exist, Try Signup" });
  }

  res.json({
    message: "User logged in successfully",
    token: token,
  });
});

router.put("/", authMiddleWare, async (req, res) => {
  const body = req.body;
  const result = updateSchema.safeParse(body);
  if (!result.success) {
    res.status(400).json({ message: "Incorrect inputs" });
  }

  await User.findOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "User updated successfully",
  });
});

// I have added authMiddleware In below case .. Check may need to get removed
router.get("/bulk", authMiddleWare, async (req, res) => {
  const filter = req.query.filter || "";

  // Handle empty filter (optional)
  if (!filter) {
    return res.json({ users: [] }); // Empty array or specific message
  }

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  // Below code handles the Case insensitivity situation :
  // const users = await User.find({
  //   $or: [
  //     { firstName: { "$regex": filter, "i": true } },
  //     { lastName: { "$regex": filter, "i": true } },
  //   ],
  // });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
    })),
  });
});

module.exports = router;
