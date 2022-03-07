const express = require("express");
const router = express.Router();
const {
  User,
  userValidation,
  cardsValidation,
} = require("../models/usersModels");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const { Card } = require("../models/cardsModels");

const getCards = async (cardsArray) => {
  const cards = await Card.find({ bizNumber: { $in: cardsArray } });
  return cards;
};

router.get("/cards", auth, async (req, res) => {
  if (!req.query.numbers) {
    res.status(400).send("Missing numbers data");

    let data = {};
    data.cards = req.query.numbers.split(",");

    const cards = await getCards(data.cards);
    res.send(cards);
  }
});

router.patch("/cards", auth, async (req, res) => {
  const { error } = cardsValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const cards = await getCards(req.body.cards);
  if (cards.length != req.body.cards.length) {
    return res.status(400).send("Card numbers don't mutch");
  }

  let user = await User.findById(req.user._id);
  user.cards = req.body.cards;
  user = await user.save();
  res.send(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  res.json(user);
});

router.post("/", async (req, res) => {
  const { error } = userValidation(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already Exist");
    return;
  }

  user = new User(
    _.pick(req.body, ["name", "email", "password", "biz", "cards"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, ["name", "email", "_id"]));
});

module.exports = router;
