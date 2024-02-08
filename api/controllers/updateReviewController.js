const { ca } = require('date-fns/locale');
const pool = require('../../database');
// FOR UPDATE METHODS ONLY
// for UPDATE reviews

module.exports = {
    // pranjal
    updateReview: async (req, res) => {
        try {
            const car_id = req.params.id;
            const { user_id, rating, review_text, review_id, review_image } = req.body;
            const updateReviewQuery = `UPDATE ratings SET user_id = $1, car_id = $2, rating = $3,
             review_text = $4, review_image=$5,date_posted = NOW() WHERE review_id = $6 RETURNING *;`;

            const updatedReview = await pool.query(updateReviewQuery,
                [user_id, car_id, rating, review_text, review_image, review_id]);

            res.json(updatedReview.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

}
