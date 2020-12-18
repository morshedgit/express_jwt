const router = require("express").Router();
const verify = require("../verifytoken");
const Post = require("../model/Post");
const { postValidation } = require("../validation");

router.get("/", async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});
router.get("/:id", async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        console.log(posts);
        res.json(posts);
    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
});
router.post("/",verify, async (req, res) => {
    try {
        const { title, content } = req.body;

        //Validating Data
        const { error } = postValidation(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        // const { title, content } = req.body;

        const post = new Post({
            title,
            content,
        });

        const savedPost = await post.save();
        res.send(savedPost);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

router.put("/:id", verify, async (req, res) => {
    const error = [];

    try {
        const { title, content } = req.body;

        //Validating Data
        const { validation_error } = postValidation(req.body);
        if (validation_error)
            return res
                .status(400)
                .send({
                    error: true,
                    from: "validation",
                    message: error.details[0].message,
                });

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                .status(400)
                .send({ error: true, from: "query", message: "Not found" });
        }

        post.title = title;
        post.content = content;

        const savedPost = await post.save();
        res.send(savedPost);
    } catch (e) {
        res.status(400).send({
            error: true,
            from: "saving",
            message: e.message,
        });
    }
});
router.delete("/:id", verify, async (req, res) => {
    const error = [];

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                .status(400)
                .send({ error: true, from: "query", message: "Not found" });
        }

        const result = await post.delete();
        res.send(result);
    } catch (e) {
        res.status(400).send({
            error: true,
            from: "deleting",
            message: e.message,
        });
    }
});

module.exports = router;
