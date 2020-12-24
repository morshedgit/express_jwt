const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
    //Validating Data
    const { error } = registerValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({
                error: true,
                from: "Validation Check",
                message: error.details[0].message,
            });

    const { name, email, password } = req.body;
    //Check if email exists
    const emailExist = await User.findOne({ email });
    if (emailExist)
        return res
            .status(400)
            .send({
                error: true,
                from: "Email Exists Check",
                message: "Email already exists!",
            });
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
        res.status(400).send({
            error: true,
            from: "Save Check",
            message: e.message,
        });
    }
});
router.get("/:id", async (req, res) => {
    //Check if user exists
    try {
        const user = await User.findById(req.params.id).select(['name','email']).populate("posts");
        if (!user)
            return res
                .status(400)
                .send({
                    error: true,
                    from: "query",
                    message: "User does not exist!",
                });
        return res.json(user);
    } catch (e) {
        return res
            .status(400)
            .send({
                error: true,
                from: "query",
                message: "User does not exist!",
            });
    }
});
router.post("/login", async (req, res) => {
    //Validating Data
    const { error } = loginValidation(req.body);
    if (error)
        return res
            .status(400)
            .send({
                error: true,
                from: "Validation",
                message: error.details[0].message,
            });

    const { email, password } = req.body;
    //Check if email exists
    const user = await User.findOne({ email });
    if (!user)
        return res
            .status(400)
            .send({
                error: true,
                from: "query",
                message: "Email does not exist!",
            });

    //Checking if password is valid
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
        return res
            .status(400)
            .send({
                error: true,
                from: "Checking password",
                message: "Password is not correct!",
            });

    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send({
        error: false,
        from: "Creating token",
        message: "Logged in",
        token,
        user_id: user._id,
    });
});

module.exports = router;
