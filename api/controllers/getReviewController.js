const { ca } = require('date-fns/locale');
const pool = require('../../database');
// FOR GET METHODS ONLY
// for GET reviews

module.exports = {
    // pranjal
    getReviewByID: async (req, res) => {
        try {
            const car_id = req.params.id;
            const desiredRating = req.query.rating;
            let query = 'SELECT ratings.*, users.username FROM ratings JOIN users ON ratings.user_id = users.user_id WHERE ratings.car_id = $1'
            const queryParams = [car_id];

            if (desiredRating) {
                // If a specific rating is provided, add a condition to the query
                query += ' AND ratings.rating = $2';
                queryParams.push(desiredRating);

            }

            const reviews = await pool.query(query, queryParams);
            res.json(reviews.rows);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getReviewByUserID: async (req, res) => {
        try {
            const { user_id } = req.body;
            const ReviewByUserID = await pool.query('SELECT * from ratings where user_id = $1;', [user_id]);
            console.log(ReviewByUserID.rows);
            res.json(ReviewByUserID.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getReviewByRating: async (req, res) => {
        try {
            const { rating } = req.body;
            const ReviewByRating = await pool.query('SELECT * from ratings where rating = $1;', [rating]);
            console.log(ReviewByRating.rows);
            res.json(ReviewByRating.rows);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    ReviewCheck: async (req, res) => {
        try {
            const car_id = req.params.carid;
            const user_id = req.params.userid;
            const ReviewCheck = await pool.query(`SELECT EXISTS (
                SELECT 1
                FROM ratings
                WHERE user_id = $1 AND car_id = $2
            ) `, [user_id, car_id]);
            console.log(ReviewCheck.rows);
            res.json(ReviewCheck.rows[0].exists);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}
