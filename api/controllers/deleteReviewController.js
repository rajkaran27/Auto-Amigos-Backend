const { ca } = require('date-fns/locale');
const pool = require('../../database');
// FOR DELETE METHODS ONLY
// for DELETE reviews

module.exports = {
    // pranjal
    deleteReview: async (req, res) => {
        try {
            const { review_id } = req.body;
            const deletedReview = await pool.query('DELETE FROM ratings WHERE review_id = $1 RETURNING *;', [review_id]);
            console.log('deletedReview :', deletedReview)
            console.log('rows :', deletedReview.rows)
            res.json(deletedReview.rows);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

}
