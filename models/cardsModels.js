const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const cardsSchema = new mongoose.Schema({
  bizName: {
    type: String,
    minlength: 2,
    maxlength: 255,
    required: true,
  },
  bizDescription: {
    type: String,
    minlength: 2,
    maxlength: 1024,
    required: true,
  },
  bizAddress: {
    type: String,
    minlength: 2,
    maxlength: 400,
    required: true,
  },
  bizPhoneNumber: {
    type: String,
    minlength: 9,
    maxlength: 10,
    required: true,
    unique: true,
  },
  bizImage: {
    type: String,
    minlength: 11,
    maxlength: 1024,
    required: true,
  },
  bizIdNumber: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Card = mongoose.model("Card", cardsSchema, "cards");

function cardValidation(card) {
  const schema = Joi.object({
    bizName: Joi.string().min(2).max(255).required(),
    bizDescription: Joi.string().min(2).max(1024).required(),
    bizAddress: Joi.string().min(2).max(400).required(),
    bizPhoneNumber: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
    bizImage: Joi.string().min(11).max(1024).uri(),
  });

  return schema.validate(card);
}

async function generateBizNumber(Card) {
  while (true) {
    let randomNum = _.random(100, 999999999999999);

    const card = await Card.findOne({ bizIdNumber: randomNum });
    if (!card) {
      return String(randomNum);
    }
  }
}

module.exports = {
  Card,
  cardValidation,
  generateBizNumber,
};
