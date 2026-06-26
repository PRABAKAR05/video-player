const { pool } = require('../config/db');

const insertVideos = async () => {
  try {
    const query = `
      INSERT INTO videos (title, description, category, file_path) VALUES 
      ('Introduction to German', 'Learn the basics of German.', 'Education', 'Introduction_German.mp4'),
      ('Learning German', 'Tips and tricks to master the language.', 'Education', 'Learning_German.mp4'),
      ('German Story Time', 'A short story to practice listening.', 'Entertainment', 'Story_German.mp4')
    `;
    
    await pool.query(query);
    console.log('Successfully inserted video records!');
  } catch (error) {
    console.error('Error inserting videos:', error);
  } finally {
    pool.end();
  }
};

insertVideos();
