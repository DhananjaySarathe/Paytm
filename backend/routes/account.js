const express = require("express");
const { authMiddleWare } = require("../middleware");
const { Account } = require("../db");
const { User } = require("../db");
const router = express.router();

router.get("/balance", authMiddleWare, async (req, res) => {
  const account = await Account.findOne({
    userId: req.userId,
  });

  res.json({
    balance: account.balance,
  });
});

// Bad transfer Money code : (we must use sessions)
/*
router.post("/transfer", authMiddleWare, async (req, res) => {
  const { amount, to } = req.body;

  const account = await User.findOne({
    userId: req.userId,
  });

  const toAccount = await User.findOne({
    userId: to,
  });

  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  // Deduction of amt
  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  );

  // Addition of amount
  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  );
});
*/

router.post("/transfer", authMiddleWare, async (req, res) => {
  const session = await mongoose.startsSession();
  session.startTransaction();
  const { amount, to } = req.body;
  const account = await User.findOne({ userId: req.userId }).session(session);

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insuficient Balance",
    });
  }

  const toAccount = await User.findOne({ userId: to }).session(session);
  if (!toAccount) {
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  // Deduction of amt
  await Account.updateOne(
    {
      userId: req.userId,
    },
    {
      $inc: {
        balance: -amount,
      },
    }
  ).session(session);

  // Addition of amount
  await Account.updateOne(
    {
      userId: to,
    },
    {
      $inc: {
        balance: amount,
      },
    }
  ).session(session);

  // commiting transaction
  await session.commitTransaction();
  res.json({
    message: "Transfer successfull",
  });
});

module.exports = router;
