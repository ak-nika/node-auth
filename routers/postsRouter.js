const router = require("express").Router();
const postsController = require("../controllers/postsController");
const { identifier } = require("../middlewares/identification");

router
  .route("/")
  .get(postsController.getAllPosts)
  .post(identifier, postsController.createPost);

router
  .route("/:id")
  .get(postsController.getPostById)
  .put(postsController.updatePost)
  .delete(postsController.deletePost);

module.exports = router;
