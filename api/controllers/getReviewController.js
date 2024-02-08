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
            const page = req.query.page || 1; // Default to page 1 if not specified
            const reviewsPerPage = 3; // Number of reviews per page

            let query = 'SELECT ratings.*, users.username FROM ratings JOIN users ON ratings.user_id = users.user_id WHERE ratings.car_id = $1'
            const queryParams = [car_id];
            // Query to count total number of reviews
            let countQuery = 'SELECT COUNT(*) FROM ratings WHERE car_id = $1';
            const countQueryParams = [car_id];

            if (desiredRating) {
                // If a specific rating is provided, add a condition to the query
                query += ' AND ratings.rating = $2';
                queryParams.push(desiredRating);

            }
            // Execute the count query
            const totalReviewsResult = await pool.query(countQuery, countQueryParams);
            const totalReviews = totalReviewsResult.rows[0].count;

            // Calculate offset based on page number
            const offset = (page - 1) * reviewsPerPage;

            // Add limit and offset to the query
            query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
            queryParams.push(reviewsPerPage, offset);
            const reviews = await pool.query(query, queryParams);
            res.json({ reviews: reviews.rows, totalReviews });
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
    },
    getTopRatedCar: async (req, res) => {
        try {
            // Query to get the top-rated car
            const topRatedCarQuery = `
            SELECT cars.model, ROUND(AVG(ratings.rating)) AS average_rating
            FROM cars
            JOIN ratings ON cars.car_id = ratings.car_id
            GROUP BY cars.model
            ORDER BY average_rating DESC
            LIMIT 1;
            `;

            const topRatedCarResult = await pool.query(topRatedCarQuery);
            const topRatedCar = topRatedCarResult.rows[0];

            res.json({
                carName: topRatedCar.model,
                rating: topRatedCar.average_rating,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getTopRatedBrand: async (req, res) => {
        try {
            // Query to get the top-rated brand
            const topRatedBrandQuery = `
            SELECT brand.brand_name AS brand_name, ROUND(AVG(ratings.rating)) AS average_rating
            FROM cars
            JOIN ratings ON cars.car_id = ratings.car_id
            JOIN brand ON cars.brand_id = brand.brand_id
            GROUP BY brand.brand_name
            ORDER BY average_rating DESC
			LIMIT 1;
            `;

            const topRatedBrandResult = await pool.query(topRatedBrandQuery);
            const topRatedBrand = topRatedBrandResult.rows[0];

            res.json({
                brandName: topRatedBrand.brand_name,
                rating: topRatedBrand.average_rating,
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAverageRatingByCar: async (req, res) => {
        try {

            // Query to get the average rating for each car 
            const averageRatingByBrandQuery = `
            SELECT cars.model, ROUND(AVG(ratings.rating)) AS average_rating
            FROM cars
            JOIN ratings ON cars.car_id = ratings.car_id
            JOIN brand ON cars.brand_id = brand.brand_id
            GROUP BY cars.model
            ORDER BY average_rating DESC;
            `;

            const averageRatingByBrandResult = await pool.query(averageRatingByBrandQuery);
            const averageRatings = averageRatingByBrandResult.rows;

            res.json(averageRatings.map(rating => ({
                carName: rating.model,
                rating: rating.average_rating
            })));
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    getAverageRatingByBrand: async (req, res) => {
        try {

            // Query to get the average rating for each car 
            const averageRatingByBrandQuery = `
            SELECT brand.brand_name AS brand_name, ROUND(AVG(ratings.rating)) AS average_rating
            FROM cars
            JOIN ratings ON cars.car_id = ratings.car_id
            JOIN brand ON cars.brand_id = brand.brand_id
            GROUP BY brand.brand_name
            ORDER BY brand_name;
            `;

            const averageRatingByBrandResult = await pool.query(averageRatingByBrandQuery);
            const averageRatings = averageRatingByBrandResult.rows;

            res.json(averageRatings.map(rating => ({
                brandName: rating.brand_name,
                rating: rating.average_rating
            })));
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}
