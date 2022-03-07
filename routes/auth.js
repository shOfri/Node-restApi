const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { User } = require("../models/usersModels");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("Worng email or password");
  }

  const vaildPassword = await bcrypt.compare(req.body.password, user.password);

  if (!vaildPassword) {
    return res.status(400).send("Worng email or password");
  }

  res.json({ token: user.generateAuthToken() });
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(req);
}
module.exports = router;
