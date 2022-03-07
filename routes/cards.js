const express = require("express");
const router = express.Router();
const {
  Card,
  cardValidation,
  generateBizNumber,
} = require("../models/cardsModels");
const auth = require("../middleware/auth");
const _ = require("lodash");

router.get("/my-cards", auth, async (req, res) => {
  if (!req.user.biz) {
    return res.status(400).send("Access Denied");
  }

  const cards = await Card.find({ user_id: req.user._id });

  res.json(cards);
});

router.post("/", auth, async (req, res) => {
  const { error } = cardValidation(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let card = new Card({
    ...req.body,
    bizImage: req.body.bizImage
      ? req.body.bizImage
      : "https://www.pngarts.com/files/10/Default-Profile-Picture-PNG-Transparent-Image.png",
    bizIdNumber: await generateBizNumber(Card),
    user_id: req.user._id,
  });

  post = await card.save();

  res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
  const { error } = cardValidation(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const card = await Card.findOneAndRemove(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body
  );
  if (!card) {
    res.status(404).send("The card and id are not correlated");
    return;
  }
  res.json(card);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = cardValidation(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  let card = await Card.findOneAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body
  );
  if (!card) {
    res.status(404).send("The card and id are not correlated");
    return;
  }
  card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  res.json(card);
});

router.get("/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("The card and id are not correlated");
    return;
  }

  res.json(card);
});

router.get("/:id/all", auth, async (req, res) => {
  const userCards = await Card.find({ user_id: req.user._id });

  return res.send(userCards);
});

module.exports = router;
