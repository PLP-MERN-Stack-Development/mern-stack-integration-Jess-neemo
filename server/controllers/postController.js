// server/controllers/postController.js
const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate('author', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.idOrSlug })
      .populate('author', 'name')
      .populate('category', 'name')
      .populate('comments.user', 'name');
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    await post.incrementViewCount();
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Helper to create clean slug
const slugify = (text) => {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // Remove special chars (keep letters, digits, spaces, hyphens)
    .replace(/[\s-]+/g, '-')    // Replace spaces & multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '');   // Trim leading/trailing hyphens
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category } = req.body;

    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and category are required',
      });
    }

    // Generate slug from title
    const slug = slugify(title);

    // Create post with all required fields
    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      category,
      author: req.user.id, // from auth middleware
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error('Create post error:', err);
    res.status(400).json({
      success: false,
      error: err.message || 'Failed to create post',
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    post.comments.push({
      user: req.user.id,
      content: req.body.content,
    });

    await post.save();
    res.status(201).json({ success: true, data: post.comments[post.comments.length - 1] });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body, slug: req.body.title ? slugify(req.body.title) : undefined },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};