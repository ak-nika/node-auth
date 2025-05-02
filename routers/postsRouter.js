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
  .patch(identifier, postsController.updatePost)
  .delete(identifier, postsController.deletePost);

module.exports = router;
