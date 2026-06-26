const { pool } = require('../config/db');

// POST /videos
const uploadVideoMetadata = async (req, res, next) => {
  try {
    const { title, description, category, file_path } = req.body;
    
    if (!title || !file_path) {
      return res.status(400).json({ message: 'Title and file_path are required' });
    }

    const newVideo = await pool.query(
      'INSERT INTO videos (title, description, category, file_path) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, category, file_path]
    );

    res.status(201).json({
      message: 'Video metadata created successfully',
      video: newVideo.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// GET /videos
const getVideos = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM videos ORDER BY created_at DESC');
    res.status(200).json({ videos: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /videos/:id
const getVideoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }

    res.status(200).json({ video: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// POST /videos/:id/like
const likeVideo = async (req, res, next) => {
  const client = await pool.connect();
  try {
    const { id: video_id } = req.params;
    const user_id = req.user.id;

    await client.query('BEGIN');

    // Check if like exists
    const likeCheck = await client.query('SELECT * FROM likes WHERE user_id = $1 AND video_id = $2', [user_id, video_id]);
    
    if (likeCheck.rows.length > 0) {
      // Unlike: remove like and decrement count
      await client.query('DELETE FROM likes WHERE user_id = $1 AND video_id = $2', [user_id, video_id]);
      await client.query('UPDATE videos SET like_count = like_count - 1 WHERE id = $1', [video_id]);
      await client.query('COMMIT');
      return res.status(200).json({ message: 'Video unliked' });
    }

    // Like: insert like and increment count
    await client.query('INSERT INTO likes (user_id, video_id) VALUES ($1, $2)', [user_id, video_id]);
    await client.query('UPDATE videos SET like_count = like_count + 1 WHERE id = $1', [video_id]);
    
    await client.query('COMMIT');
    res.status(200).json({ message: 'Video liked' });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// POST /videos/:id/comment
const addComment = async (req, res, next) => {
  try {
    const { id: video_id } = req.params;
    const user_id = req.user.id;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newComment = await pool.query(
      'INSERT INTO comments (user_id, video_id, content) VALUES ($1, $2, $3) RETURNING *',
      [user_id, video_id, content]
    );

    res.status(201).json({ message: 'Comment added', comment: newComment.rows[0] });
  } catch (error) {
    next(error);
  }
};

// GET /videos/:id/comments
const getComments = async (req, res, next) => {
  try {
    const { id: video_id } = req.params;
    
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.username 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.video_id = $1 
       ORDER BY c.created_at DESC`,
      [video_id]
    );

    res.status(200).json({ comments: result.rows });
  } catch (error) {
    next(error);
  }
};

// POST /videos/:id/bookmark
const bookmarkVideo = async (req, res, next) => {
  try {
    const { id: video_id } = req.params;
    const user_id = req.user.id;

    // Check if bookmark exists
    const check = await pool.query('SELECT * FROM bookmarks WHERE user_id = $1 AND video_id = $2', [user_id, video_id]);
    
    if (check.rows.length > 0) {
      // Remove bookmark
      await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND video_id = $2', [user_id, video_id]);
      return res.status(200).json({ message: 'Bookmark removed' });
    }

    // Add bookmark
    await pool.query('INSERT INTO bookmarks (user_id, video_id) VALUES ($1, $2)', [user_id, video_id]);
    res.status(201).json({ message: 'Video bookmarked' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadVideoMetadata,
  getVideos,
  getVideoById,
  likeVideo,
  addComment,
  getComments,
  bookmarkVideo
};
