const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', videoController.getVideos);
router.get('/:id', videoController.getVideoById);
router.get('/:id/comments', videoController.getComments);

// Protected routes
router.post('/', authMiddleware, videoController.uploadVideoMetadata);
router.post('/:id/like', authMiddleware, videoController.likeVideo);
router.post('/:id/comment', authMiddleware, videoController.addComment);
router.post('/:id/bookmark', authMiddleware, videoController.bookmarkVideo);

module.exports = router;
