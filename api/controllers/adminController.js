const pool = require('../../database');


module.exports = {
    createCar: async (req, res) => {
        try {
            const { model, desc, brand_id, year, price, capacity_id, transmission_id, category_id, condition } = req.body;
            const sql = `WITH new_car AS (
                INSERT INTO cars (brand_id, category_id, model, year, price, description, condition, transmission, capacity, carstatus)
                VALUES (4, 6, 'nice car', 2018, 75000, 'The nice car offers great balance of style, performance, and features. Under the hood, it is powered by a turbocharged 1.4L four cylinder engine. It is paired with a seven speed dual clutch transmission that provides smooth and quick shifts. It is a well rounded compact hatchback that offers plenty of features and performance at an affordable price.', 2, 1, 3, 'active')
                RETURNING car_id
              )
              INSERT INTO images (image_url, car_id)
              VALUES ('https://carro.co/_next/image?url=https%3A%2F%2Fcdn.carro.co%2Ftr%3Aar-16-9%2Cw-1280%2Cpr-true%2F2023%2F11%2FInventory%2F92747587%2Fhyundai-i30-1.4a-t-gdi-dct-turbo-XPK6ZG4XK0-carro-008.jpg&w=1920&q=75', (SELECT car_id FROM new_car));`;

            await pool.query(sql, [model, desc, brand_id, category_id, year, price, transmission_id, capacity_id]);

            res.status(200).json({ message: 'Car created successfully' });
        } catch (error) {
            console.error('Error creating car:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getCarByID: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                const car_id = req.params.id;
                const sql = `SELECT c.car_id,c.model,c.year,c.price,c.description, i.image_url, category.category_name,category.category_id, brand.*,car_capacity.capacity,car_capacity.id as capacity_id,car_transmission.transmission,car_transmission.id as transmission_id,c.condition
                FROM cars c
                INNER JOIN images i ON c.car_id = i.car_id
                INNER JOIN category ON c.category_id = category.category_id 
                INNER JOIN brand on c.brand_id=brand.brand_id 
                INNER JOIN car_capacity on c.capacity=car_capacity.id 
                INNER JOIN car_transmission on c.transmission=car_transmission.id 
                WHERE c.car_id=$1 AND c.carStatus = 'active';`;
                const cars = await pool.query(sql, [car_id]);
                resolve(cars.rows);
            } catch (error) {
                reject({ error: 'Internal server error' });
            }
        });
    },
    updateCar: async (req, res) => {
        try {
            const { car_id, model, desc, brand_id, year, price, capacity_id, transmission_id, category_id } = req.body;


            const sql = `UPDATE cars
                SET model = $1, description = $2, brand_id = $3, category_id = $4,
                year = $5, price = $6, transmission = $7, capacity = $8
                WHERE car_id = $9;`;

            await pool.query(sql, [model, desc, brand_id, category_id, year, price, transmission_id, capacity_id, car_id]);

            res.status(200).json({ message: 'Car updated successfully' });
        } catch (error) {
            console.error('Error updating car:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    deleteCar: async (req, res) => {
        try {
            const car_id = req.params.carId
            const sql = `UPDATE cars set carStatus = 'deleted' WHERE car_id = $1`

            await pool.query(sql, [car_id]);
            res.status(200).json({ message: 'Car deleted successfully' });

        } catch (error) {
            console.error('Error deleting car:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}