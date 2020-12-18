const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
    //Validating Data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;
    //Check if email exists
    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).send("Email already exists!");
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (e) {
        res.status(400).send(e);
    }
});
router.post("/login", async (req, res) => {
    //Validating Data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    //Check if email exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Email does not exist!");

    //Checking if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Password is not correct!");

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);
});

module.exports = router;
