const { ca } = require('date-fns/locale');
const pool = require('../../database');
// FOR POST METHODS ONLY
// for POST reviews

module.exports = {
    // pranjal
    postReview: async (req, res) => {
        try {
            const car_id = req.params.id;
            const { user_id, rating, review_text } = req.body;
            const insertReviewQuery = 'INSERT INTO ratings (user_id, car_id, rating, review_text, date_posted)VALUES ($1, $2, $3, $4, NOW()) RETURNING *;';

            const newReview = await pool.query(insertReviewQuery, [user_id, car_id, rating, review_text]);

            res.json(newReview.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

}
