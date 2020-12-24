const router = require("express").Router();
const verify = require("../verifytoken");
const Post = require("../model/Post");
const User = require("../model/User");
const Comment = require("../model/Comment");
const { postValidation, commentValidation } = require("../validation");

router.get("/", async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate({
                path: "comments",
                model: "Comment",
                populate: [
                    {
                        path: "replys",
                        model: "Comment",
                        populate:{
                            path:"author",
                            model:"User",
                            select:"name"
                        }
                    },
                    {
                        path: "author",
                        model: "User",
                        select: "name",
                    },
                ],
            })
            .populate("author");
        res.json(post);
    } catch (e) {
        res.status(400).send({
            error: true,
            from: "query",
            message: e.message,
        });
    }
});
router.post("/", verify, async (req, res) => {
    try {
        const { title, content, author, tags } = req.body;
        //Validating Data
        const { error } = await postValidation(req.body);
        if (error)
            return res.status(400).json({
                error: true,
                from: "validation",
                message: error.details[0].message,
            });

        const post = new Post({
            title,
            content,
            author,
            tags,
        });

        const savedPost = await post.save();
        const user = await User.findById(author);
        user.posts.push(savedPost);
        await user.save();
        thatUser = await User.findById(author).populate("posts");
        res.send({ savedPost });
    } catch (e) {
        res.status(400).json({
            error: true,
            from: "query",
            message: e.message,
        });
    }
});
router.post("/comment", async (req, res) => {
    try {
        const { user: author, post, text, parentComment } = req.body;
        //Validating Data
        const { error } = await commentValidation({ author, post, text });
        if (error)
            return res.status(400).json({
                error: true,
                from: "validation",
                message: error.details[0].message,
            });

        console.log({ author });

        const comment = new Comment({
            text,
            post,
            author,
        });

        const savedComment = await comment.save();

        if (parentComment) {
            const theParentComment = parentComment._id
                ? await Comment.findById(parentComment._id)
                : await Comment.findById(parentComment);
            theParentComment.replys.push(savedComment);
            await theParentComment.save();
        } else {
            const thePost = post._id
                ? await Post.findById(post._id)
                : await Post.findById(post);
            thePost.comments.push(savedComment);
            await thePost.save();
        }
        res.send({ savedComment });
    } catch (e) {
        res.status(400).json({
            error: true,
            from: "Create Comment",
            message: e.message,
        });
    }
});
router.put("/:id", verify, async (req, res) => {
    const error = [];

    try {
        const { title, content } = req.body;

        //Validating Data
        const { validation_error } = postValidation(req.body);
        if (validation_error) {
            return res.status(400).send({
                error: true,
                from: "validation",
                message: error.details[0].message,
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                .status(400)
                .send({ error: true, from: "query", message: "Not found" });
        }

        if (post.author != req.user._id) {
            // console.log({a:JSON.stringify(post.author)})
            // console.log({b:req.user._id})
            return res
                .status(400)
                .send({ error: true, from: "query", message: "Not Allowed" });
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
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                .status(400)
                .send({ error: true, from: "query", message: "Not found" });
        }

        if (post.author != req.user._id) {
            return res
                .status(400)
                .send({ error: true, from: "query", message: "Not Allowed" });
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
