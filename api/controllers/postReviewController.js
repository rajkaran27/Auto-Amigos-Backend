const { ca } = require('date-fns/locale');
const pool = require('../../database');
// FOR POST METHODS ONLY
// for POST reviews

module.exports = {
    // pranjal
    postReview: async (req, res) => {
        try {
            const car_id = req.params.id;
            const { user_id, rating, review_text, review_image } = req.body;
            const insertReviewQuery = 'INSERT INTO ratings (user_id, car_id, rating, review_text, review_image, date_posted)VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *;';

            const newReview = await pool.query(insertReviewQuery, [user_id, car_id, rating, review_text, review_image]);

            res.json(newReview.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

}
