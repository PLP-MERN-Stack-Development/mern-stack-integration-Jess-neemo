// server/routes/posts.js
const express = require('express');
const { 
  getAllPosts, 
  getPost, 
  createPost, 
  addComment, 
  updatePost, 
  deletePost 
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts          → get all posts
// POST /api/posts         → create new post (protected)
router.route('/')
  .get(getAllPosts)
  .post(protect, createPost);

// GET /api/posts/:idOrSlug → get single post by ID or slug
router.route('/:idOrSlug')
  .get(getPost);

// POST /api/posts/:postId/comments → add comment (protected)
router.route('/:postId/comments')
  .post(protect, addComment);

// PUT /api/posts/:id      → update post (protected)
// DELETE /api/posts/:id   → delete post (protected)
router.route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;